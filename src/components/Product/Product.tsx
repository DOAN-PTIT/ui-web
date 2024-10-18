"use client";

import {
  Button,
  Col,
  Form,
  Input,
  Layout,
  Modal,
  Row,
  Select,
  Table,
} from "antd";
import HeaderAction from "../HeaderAction/HeaderAction";
import ActionTools from "../ActionTools/ActionTools";
import type { TableProps } from "antd";
import { useState } from "react";
import { DeleteOutlined } from "@ant-design/icons";

interface ProductType {
  id: string;
  productName: string;
  totalAmount: number;
  salePrice: number;
  importedPrice: number;
  note: string;
  totalVariation: number;
}

interface VariationProps {
  id: string;
  iamge: string;
  barcode: string;
  salePrice: number;
  amount: number;
}

function Product() {
  const [modalVisiable, setModalVisiable] = useState(false);
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
      dataIndex: "productImage",
      title: "Ten san pham",
      fixed: "left",
    },
    {
      key: "TOTAL AMOUNT",
      dataIndex: "totalAmount",
      title: "Tong so luong",
    },
    {
      key: "TOTAL VARIATION",
      dataIndex: "totalVariation",
      title: "Tong so mau ma",
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

  const columnsVariation: TableProps<VariationProps>["columns"] = [
    {
      key: "ID",
      dataIndex: "id",
      title: "Ma mau",
      width: 120,
      fixed: "left"
    },
    {
      key: "IMAGE",
      dataIndex: "image",
      title: "Hinh anh",
      width: 120,
      fixed: "left"
    },
    {
      key: "BARCODE",
      dataIndex: "barcode",
      title: "Ma vach",
    },
    {
      key: "SALE PRICE",
      dataIndex: "salePrice",
      title: "Gia ban",
    },
    {
      key: "AMOUNT",
      dataIndex: "amount",
      title: "So luong",
    },
  ];

  columnsVariation.push({
    key: "DELETE",
    title: "",
    width: 60,
    fixed: "right",
    render: () => {
      return <Button icon={<DeleteOutlined />} danger style={{border: "none", boxShadow: "none", background: "none"}} />;
    },
  });

  const getData: () => TableProps<ProductType>["dataSource"] = () => {
    return [];
  };

  const getDataVariation: () => TableProps<VariationProps>["dataSource"] = () => {
    return []
  }

  const callBack = () => {
    setModalVisiable(true);
  };

  return (
    <Layout>
      <HeaderAction
        title="San pham"
        isShowSearch={true}
        inputPlaholder="Tim kiem san pham"
      />
      <Layout.Content className="p-5 h-screen">
        <ActionTools callBack={callBack} />
        <Table
          columns={columns}
          dataSource={getData()}
          pagination={{
            total: 100,
            pageSize: 30,
            defaultCurrent: 1,
            defaultPageSize: 30,
            pageSizeOptions: [10, 20, 30, 50, 100],
            size: "small",
          }}
          scroll={{ x: 2500, y: 500 }}
          size="small"
        />
      </Layout.Content>
      <Modal
        title="Thiet lap san pham"
        open={modalVisiable}
        width={1200}
        styles={{
          content: { padding: 0 },
          header: { padding: 20 },
          footer: { padding: 20 },
        }}
        style={{ top: 40 }}
        onCancel={() => setModalVisiable(false)}
      >
        <Layout className="p-5 h-[600px] overflow-y-scroll">
          <Row justify="space-between" className="mb-5">
            <Col span={12} className="bg-white rounded-lg shadow-sm">
              <Form layout="vertical" className="p-6">
                <Form.Item name="custom_id" label="Ma san pham" required>
                  <Input placeholder="Ma san pham" name="custom_id" />
                </Form.Item>
                <Form.Item name="product_name" label="Ten san pham" required>
                  <Input placeholder="Ten san pham" name="product_name" />
                </Form.Item>
                <Form.Item name="product_note" label="Ghi chu">
                  <Input.TextArea placeholder="Ghi chu" name="product_note" />
                </Form.Item>
              </Form>
            </Col>
            <Col span={11} className="bg-white rounded-lg h-fit shadow-sm">
              <Form layout="vertical" className="p-6">
                <Form.Item name="product_tag" label="The">
                  <Select options={[]} placeholder="The" />
                </Form.Item>
                <Form.Item label="Nha cung cap">
                  <Select options={[]} placeholder="Nha cung cap" />
                </Form.Item>
              </Form>
            </Col>
          </Row>
          <Table pagination={{size: 'small'}} scroll={{x: 1200, y: 800}} className="shadow-sm" columns={columnsVariation} dataSource={getDataVariation()} />
        </Layout>
      </Modal>
    </Layout>
  );
}

export default Product;
