"use client";

import { Layout, Table } from "antd";
import HeaderAction from "../HeaderAction/HeaderAction";
import ActionTools from "../ActionTools/ActionTools";
import type { TableProps } from "antd";

interface ProductType {
  id: string;
  productName: string;
  productImage: string;
  totalAmount: number;
  salePrice: number;
  importedPrice: number;
  note: string;
}

function Product() {
  const columns: TableProps<ProductType>["columns"] = [
    {
      key: "ID",
      dataIndex: "id",
      title: "ID",
      fixed: "left",
      width: 120
    },
    {
      key: "PRODUCT NAME",
      dataIndex: "productImage",
      title: "Ten san pham",
      fixed: "left",
    },
    {
      key: "PRODUCT IMAGE",
      dataIndex: "productImage",
      title: "Anh",
    },
    {
      key: "TOTAL AMOUNT",
      dataIndex: "totalAmount",
      title: "Tong so luong",
    },
    {
      key: "SALE  PRICE",
      dataIndex: "salePrice",
      title: "Gia ban",
    },
    {
      key: "IMPORTED PRICE",
      dataIndex: "importedPrice",
      title: "Gia nhap",
    },
    {
      key: "NOTE",
      dataIndex: "note",
      title: "Ghi chu",
    },
  ];

  const getData: () => TableProps<ProductType>["dataSource"] = () => {
    return [];
  };

  return (
    <Layout>
      <HeaderAction
        title="Sản phẩm"
        isShowSearch={true}
        inputPlaholder="Tìm kiếm sản phẩm"
      />
      <Layout.Content className="p-5 h-screen">
        <ActionTools />
        <Table
          columns={columns}
          dataSource={getData()}
          pagination={{
            total: 100,
            pageSize: 30,
            defaultCurrent: 1,
            defaultPageSize: 30,
            pageSizeOptions: [10, 20, 30, 50, 100],
            size: 'small'
          }}
          scroll={{x: 2500, y: 500}}
          size="small"
        />
      </Layout.Content>
    </Layout>
  );
}

export default Product;
