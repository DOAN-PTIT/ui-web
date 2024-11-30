"use client";

import {
  Layout,
  Table,
} from "antd";
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
      width: 120,
    },
    {
      key: "PRODUCT NAME",
      dataIndex: "name",
      title: "Ten san pham",
      fixed: "left",
    },
    {
      key: "TOTAL AMOUNT",
      dataIndex: "totalAmount",
      title: "Tổng số lượng",
    },
    {
      key: "TOTAL VARIATION",
      dataIndex: "totalVariation",
      title: "Tổng số mẫu mã",
    },
    {
      key: "SALE  PRICE",
      dataIndex: "salePrice",
      title: "Giá bán",
    },
    {
      key: "IMPORTED PRICE",
      dataIndex: "importedPrice",
      title: "Giá nhập",
    },
    {
      key: "NOTE",
      dataIndex: "note",
      title: "Ghi chú",
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
    return getListProductFBShop({
      access_token: currentUser.access_token,
      fb_shop_id: currentShop.fb_shop_id,
    });
  };

  const getData: () => TableProps<ProductType>["dataSource"] = () => {
    return listProduct?.products
      ? listProduct?.products.map((product) => ({
          id: product.product_code || product.id,
          name: product.name,
          totalAmount: 0,
          salePrice: formatNumber(1231289, "VND"),
          importedPrice: formatNumber(3213912, "VND"),
          note: product.description,
          totalVariation: 0,
        }))
      : [];
  };

  return (
    <Layout>
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
