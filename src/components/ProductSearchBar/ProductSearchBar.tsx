import _ from "lodash";
import { useMemo, useRef, useState, useCallback } from "react";
import { AppDispatch, RootState } from "@/store";
import { Select } from "antd";
import { connect } from "react-redux";
import { LoadingOutlined } from "@ant-design/icons";
import apiClient from "@/service/auth";

interface ProductSearchBarProps
  extends ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps> {
        callBackResult: (value: any) => any;
    }

const { Option } = Select;
const deboundTime = 800;

function ProductSearchBar(props: ProductSearchBarProps) {
  const { currentShop, callBackResult } = props;

  const [searchProductResult, setSearchProductResult] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState<any>([]);
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
      const url = `/shop/${currentShop.id}/products/${value}`;

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

  return (
    <Select
      showSearch
      className="w-full"
      placeholder="Nhập tên sản phẩm, mã mẫu mã, mã sản phẩm"
      filterOption={false}
      value={null}
      onChange={(value, option) => {
        setSelectedProduct((prevState: any) => [...prevState, value]);
        callBackResult([...selectedProduct, value]);
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
        {searchProductResult.map((product: any) => (
            <Option key={product.id}>
                {product.name}
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
