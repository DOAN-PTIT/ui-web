"use client";

import { Image, Layout, message, Table, Typography } from "antd";
import HeaderAction from "../HeaderAction/HeaderAction";
import ActionTools from "../ActionTools/ActionTools";
import type { TableProps } from "antd";
import { useEffect, useState } from "react";
import { AppDispatch, RootState } from "@/store";
import {
  createProduct,
  getListProduct,
  getListProductFBShop,
} from "@/action/product.action";
import { connect } from "react-redux";
import { autoAddZero, formatNumber } from "@/utils/tools";
import { createVariation } from "@/action/variation.action";
import ProductDetail from "../ProductDetail/ProductDetail";
import "../../styles/global.css";
import SyncProductFacebookShop from "../SyncProductFacebookShop";
import { debounce } from "lodash";
import { setListProduct } from "@/reducer/product.reducer";

interface ProductType {
  id: string;
  name: string;
  totalAmount: any;
  salePrice: any;
  importedPrice: any;
  note: string;
  totalVariation: any;
}

const { Text } = Typography;

interface ProductProps extends ReturnType<typeof mapStateToProps> {
  createProduct: (data: any) => Promise<any>;
  getListProduct: (data: { shopId: any; page: number }) => Promise<any>;
  getListProductFBShop: (data: any) => Promise<any>;
  createVariation: (data: any) => Promise<any>;
}

function Product(props: ProductProps) {
  const [modalVisiable, setModalVisiable] = useState(false);
  const [isSyncFBCatalog, setIsSyncFBCatalog] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    getListProduct,
    getListProductFBShop,
    listProduct,
    currentShop,
    currentUser,
  } = props;

  useEffect(() => {
    getListProduct({ shopId: currentShop.id, page: 1 });
  }, [currentShop.id]);

  const columns: TableProps<ProductType>["columns"] = [
    {
      key: "STT",
      dataIndex: "stt",
      title: "STT",
      fixed: "left",
      width: "5%",
      render: (_: any, __: any, index: number) => {
        return <span className="font-medium">{autoAddZero(index + 1, 0)}</span>;
      },
    },
    {
      key: "PRODUCT CODE",
      dataIndex: "id",
      title: "Mã sản phẩm",
      fixed: "left",
      width: "8%",
      render: (text, record) => {
        console.log(text);
        return (
          <Text
            copyable={{
              text: text,
              onCopy: () => {
                message.success(`Sao chép thành công mã sản phẩm: ${text}`);
              },
              tooltips: "Click để sao chép mã sản phẩm",
            }}
            className="font-[600] text-sky-600"
          >{text}</Text>
        );
      },
    },
    {
      key: "PRODUCT NAME",
      dataIndex: "name",
      title: "Tên sản phẩm",
      fixed: "left",
      width: "10%",
      render: (text, record) => {
        return <span className="font-medium">{text}</span>;
      },
    },
    {
      key: "IMAGE",
      dataIndex: "image",
      title: "Hình ảnh",
      fixed: "left",
      width: "8%",
      render: (text, record) => {
        return <div onClick={(e) => {
          e.stopPropagation();
        }}><Image src={text} width={80} /></div>
      },
    },
    {
      key: "TOTAL AMOUNT",
      dataIndex: "totalAmount",
      title: "Tổng số lượng",
      render: (text, record) => {
        return <span className="font-medium">{text}</span>;
      },
    },
    {
      key: "TOTAL VARIATION",
      dataIndex: "totalVariation",
      title: "Tổng số mẫu mã",
      render: (text, record) => {
        return <span className="font-medium">{text}</span>;
      },
    },
    {
      key: "SALE  PRICE",
      dataIndex: "salePrice",
      title: "Giá bán",
      render: (text, record) => {
        return <span className="font-medium">{text}</span>;
      },
    },
    {
      key: "IMPORTED PRICE",
      dataIndex: "importedPrice",
      title: "Giá nhập",
      render: (text, record) => {
        return <span className="font-medium">{text}</span>;
      },
    },
    {
      key: "NOTE",
      dataIndex: "note",
      title: "Ghi chú",
      render: (text, record) => {
        return <span className="font-medium">{text}</span>;
      },
    },
  ];

  const reloadCallBack = async () => {
    const { getListProduct } = props;
    return await getListProduct({ shopId: currentShop.id, page: 1 });
  };

  const callBack = () => {
    setModalVisiable(true);
  };

  const callBackSyncFBCatalog = () => {
    setIsSyncFBCatalog(true);
  };

  const getData: () => TableProps<ProductType>["dataSource"] = () => {
    return listProduct?.products
      ? listProduct?.products.map((product: any) => {
          const firstVariation = product?.variations && product?.variations[0];
          const totalAmount = product?.variations?.reduce(
            (total: number, variation: any) => total + (variation?.amount || 0),
            0
          );
          const totalVariation = product?.variations?.length || 0;
          // sale Price will get about variation min - max
          const maxSalePrice = Math.max(
            ...product?.variations?.map(
              (variation: any) => variation?.retail_price
            )
          );
          const minSalePrice = Math.min(
            ...product?.variations?.map(
              (variation: any) => variation?.retail_price
            )
          );
          let salePrice;
          if (maxSalePrice == minSalePrice) {
            salePrice = `${formatNumber(maxSalePrice, "VND")} đ`;
          } else {
            salePrice = `${formatNumber(
              minSalePrice,
              "VND"
            )} đ - ${formatNumber(maxSalePrice, "VND")} đ`;
          }

          return {
            id: product.product_code || product.id,
            name: product.name,
            totalAmount,
            salePrice,
            importedPrice: formatNumber(3213912, "VND"),
            note: product.description,
            totalVariation,
            image: firstVariation?.image,
          };
        })
      : [];
  };

  const handleSearch = async (value: any) => {
    const params = {
      shopId: currentShop.id,
      page: 1,
      search: value,
    }
    await getListProduct(params);
  }

  const deboundSearch = debounce(handleSearch, 600);

  return (
    <Layout className="h-full">
      <HeaderAction
        title="Sản phẩm"
        isShowSearch={true}
        inputPlaholder="Tìm kiếm sản phẩm"
        handleSearch={deboundSearch}
      />
      <Layout.Content className="p-5 h-screen bg-gray-200 rounded-tl-xl order__table__container">
        <ActionTools
          callBack={callBack}
          reloadCallBack={reloadCallBack}
          hasSyncFBCatalog={currentShop.fb_shop_id ? true : false}
          callBackSyncFBCatalog={callBackSyncFBCatalog}
        />
        <Table
          columns={columns}
          dataSource={getData()}
          virtual
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setModalVisiable(true);
                setSelectedRowKeys(record.id);
              },
              style: { cursor: "pointer" },
            };
          }}
          pagination={{
            total: props.totalPage ? props.totalPage : 0,
            pageSize: 30,
            defaultCurrent: 1,
            defaultPageSize: 30,
            current: currentPage,
            pageSizeOptions: [10, 20, 30, 50, 100],
            size: "small",
            onChange: (page, pageSize) => {
              setCurrentPage(page);
              getListProduct({ shopId: currentShop.id, page });
            },
          }}
          scroll={{ x: 2500 }}
          size="small"
          loading={props.isLoading}
        />
      </Layout.Content>
      {modalVisiable && (
        <ProductDetail
          modalVisiable={modalVisiable}
          typeView="create"
          setModalVisiable={setModalVisiable}
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
        />
      )}
      <SyncProductFacebookShop
        open={isSyncFBCatalog}
        setOpen={setIsSyncFBCatalog}
      />
    </Layout>
  );
}

const mapStateToProps = (state: RootState) => {
  return {
    isLoading: state.productReducer.isLoading,
    listProduct: state.productReducer.listProduct,
    totalPage: state.productReducer.listProduct?.totalCount || 0,
    currentShop: state.shopReducer.shop,
    currentUser: state.userReducer.user,
    createProduct: state.productReducer.createProduct,
  };
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
    createProduct: (data: any) => dispatch(createProduct(data)),
    getListProduct: (data: { shopId: any; page: number }) =>
      dispatch(getListProduct(data)),
    getListProductFBShop: (data: any) => dispatch(getListProductFBShop(data)),
    createVariation: (data: any) => dispatch(createVariation(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Product);
