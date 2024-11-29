import _ from "lodash";
import { useMemo, useRef, useState, useCallback, Dispatch } from "react";
import { AppDispatch, RootState } from "@/store";
import { notification, Select, Tag } from "antd";
import { connect } from "react-redux";
import { LoadingOutlined } from "@ant-design/icons";
import apiClient from "@/service/auth";
import Image from "next/image";
import { formatNumber } from "@/utils/tools";

interface ProductSearchBarProps
  extends ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps> {
  setSelectedProduct: Dispatch<any>,
  selectedProduct: []
}

const { Option } = Select;
const deboundTime = 800;

function ProductSearchBar(props: ProductSearchBarProps) {
  const { currentShop, selectedProduct, setSelectedProduct } = props;

  const [searchProductResult, setSearchProductResult] = useState<[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRef = useRef(0);

  const handleSearch = useCallback(
    async (value: string) => {
      if (!value) {
        return;
      }
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setIsLoading(true);
      setSearchProductResult([]);
      const url = `/shop/${currentShop.id}/variation/${value}`;

      return await apiClient
        .get(url)
        .then((res) => {
          if (fetchId !== fetchRef.current) {
            return;
          }
          setIsLoading(false);
          setSearchProductResult(res.data);
        })
        .catch((error) => {
          setIsLoading(false);
          console.log(error);
        });
    },
    [currentShop.id]
  );

  const deboundSearch = useMemo(() => {
    return _.debounce(handleSearch, deboundTime);
  }, [handleSearch]);

  const handleSelectedProduct = async (value: any) => {
    const cloneSelectedProduct = _.cloneDeep(selectedProduct);
    const index = cloneSelectedProduct.findIndex(
      (variation: any) => variation.id == value
    );
    if (index == -1) {
      const selected = searchProductResult.find(
        (variation: any) => variation.id == value
      );
      cloneSelectedProduct.push(selected);
    } else {
      notification.warning({
        message: "Sản phẩm đã tồn tại trong đơn hàng",
        description: "Vui lòng chọn sản phẩm khác",
      })
    }

    setSelectedProduct(cloneSelectedProduct)
  };

  return (
    <Select
      showSearch
      className="w-full"
      placeholder="Nhập tên sản phẩm, mã mẫu mã, mã sản phẩm"
      filterOption={false}
      value={null}
      onChange={(value) => {
        handleSelectedProduct(value);
      }}
      notFoundContent={
        isLoading ? (
          <div className="text-center">
            <LoadingOutlined />
          </div>
        ) : (
          <div className="h-14 flex items-center justify-center">
            Không tìm thấy sản phẩm!!
          </div>
        )
      }
      onSearch={deboundSearch}
      suffixIcon={null}
    >
      {searchProductResult.map((variation: any) => (
        <Option key={variation.id}>
          <div className="flex gap-2 w-full justify-between">
            <div className="w-1/5">
              <Image
                quality={100}
                width={100}
                height={100}
                alt=""
                src={variation.image}
              />
            </div>
            <div className="w-4/5 flex justify-between">
              <div className="flex flex-col gap-1 w-2/3">
                <p className="font-bold">{variation.product.name}</p>
                <p>
                  <Tag color="green">
                    <span>{variation.product.product_code}</span>
                  </Tag>
                  <Tag color="red">
                    <span>{variation.variation_code}</span>
                  </Tag>
                </p>
                <div>
                  <span className="font-medium opacity-65">
                    Số lượng:{" "}
                    <span className="opacity-100 font-bold text-orange-500">
                      {variation.amount}
                    </span>
                  </span>
                </div>
              </div>
              <div className="text-green-500 font-bold w-1/3 text-end">
                {formatNumber(variation.retail_price, "VND")} ₫
              </div>
            </div>
          </div>
        </Option>
      ))}
    </Select>
  );
}

const mapStateToProps = (state: RootState) => {
  return {
    currentShop: state.shopReducer.shop as { id: number },
  };
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductSearchBar);
