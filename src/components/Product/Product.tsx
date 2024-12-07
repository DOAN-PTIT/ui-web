"use client";

import { Image, Layout, Table } from "antd";
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
import { formatNumber } from "@/utils/tools";
import { createVariation } from "@/action/variation.action";
import ProductDetail from "../ProductDetail/ProductDetail";
import "../../styles/global.css";
import SyncProductFacebookShop from "../SyncProductFacebookShop";

interface ProductType {
  id: string;
  name: string;
  totalAmount: any;
  salePrice: any;
  importedPrice: any;
  note: string;
  totalVariation: any;
}

interface ProductProps
  extends ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps> {}

function Product(props: ProductProps) {
  const [modalVisiable, setModalVisiable] = useState(false);
  const [isSyncFBCatalog, setIsSyncFBCatalog] = useState(false);

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
      key: "ID",
      dataIndex: "id",
      title: "ID",
      fixed: "left",
      width: "10%",
      render: (text, record) => {
        return <span className="font-medium">{text}</span>
      }
    },
    {
      key: "PRODUCT NAME",
      dataIndex: "name",
      title: "Tên sản phẩm",
      fixed: "left",
      width: "10%",
      render: (text, record) => {
        return <span className="font-medium">{text}</span>
      }
    },
    {
      key: "IMAGE",
      dataIndex: "image",
      title: "Hình ảnh",
      fixed: "left",
      width: "8%",
      render: (text, record) => {
        return <Image src={text} width={80} />
      }
    },
    {
      key: "TOTAL AMOUNT",
      dataIndex: "totalAmount",
      title: "Tổng số lượng",
      render: (text, record) => {
        return <span className="font-medium">{text}</span>
      }
    },
    {
      key: "TOTAL VARIATION",
      dataIndex: "totalVariation",
      title: "Tổng số mẫu mã",
      render: (text, record) => {
        return <span className="font-medium">{text}</span>
      }
    },
    {
      key: "SALE  PRICE",
      dataIndex: "salePrice",
      title: "Giá bán",
      render: (text, record) => {
        return <span className="font-medium">{text}</span>
      }
    },
    {
      key: "IMPORTED PRICE",
      dataIndex: "importedPrice",
      title: "Giá nhập",
      render: (text, record) => {
        return <span className="font-medium">{text}</span>
      }
    },
    {
      key: "NOTE",
      dataIndex: "note",
      title: "Ghi chú",
      render: (text, record) => {
        return <span className="font-medium">{text}</span>
      }
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
        const firstVariation = product?.variations[0];
          const totalAmount = product?.variations.reduce(
            (total: number, variation: any) => total + (variation?.amount || 0),
            0
          );
          const totalVariation = product?.variations?.length || 0;
          // sale Price will get about variation min - max
          const maxSalePrice = Math.max(
            ...product?.variations?.map((variation: any) => variation?.retail_price)
          );
          const minSalePrice = Math.min(
            ...product?.variations?.map((variation: any) => variation?.retail_price)
          );
          let salePrice;
          if (maxSalePrice == minSalePrice) {
            salePrice = `${formatNumber(maxSalePrice, "VND")} đ`;
          } else {
            salePrice = `${formatNumber(minSalePrice, "VND")} đ - ${formatNumber(maxSalePrice,"VND")} đ`;
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

  return (
    <Layout className="h-full">
      <HeaderAction
        title="Sản phẩm"
        isShowSearch={true}
        inputPlaholder="Tìm kiếm sản phẩm"
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
          pagination={{
            total: props.totalPage ? props.totalPage : 0,
            pageSize: 30,
            defaultCurrent: 1,
            defaultPageSize: 30,
            pageSizeOptions: [10, 20, 30, 50, 100],
            size: "small",
          }}
          scroll={{ x: 2500, y: 500 }}
          size="small"
          loading={props.isLoading}
        />
      </Layout.Content>
      <ProductDetail
        modalVisiable={modalVisiable}
        typeView="create"
        setModalVisiable={setModalVisiable}
      />
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
