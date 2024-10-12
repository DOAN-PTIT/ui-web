"use client";

import { Layout, Table } from "antd";
import HeaderAction from "../HeaderAction/HeaderAction";
import ActionTools from "../ActionTools/ActionTools";
import type { TableProps } from "antd";

interface CustomerType {
  id: string;
  customerName: string;
  dateOfBirth: string;
  totalOrder: number;
  totalPurchasePrice: number;
  insertedAt: string;
  email: string;
  address: string;
  referralCode: string;
  phoneNumber: string;
}

function Customer() {
  const columns: TableProps<CustomerType>["columns"] = [
    {
      key: "ID",
      dataIndex: "id",
      title: "ID",
      fixed: "left",
      width: 180
    },
    {
      key: "CUSTOMER NAME",
      dataIndex: "customerName",
      title: "Ten khach hang",
      fixed: "left",
      width: 200,
    },
    {
      key: "DATE OF BIRTH",
      dataIndex: "dateOfBirth",
      title: "Ngay sinh",
    },
    {
      key: "ADDRESS",
      dataIndex: "address",
      title: "Dia chi",
    },
    {
      key: "PHONE NUMBER",
      dataIndex: "phoneNumber",
      title: "So dien thoai",
    },
    {
      key: "EMAIL",
      dataIndex: "email",
      title: "Email",
    },
    {
      key: "REFERRAL CODE",
      dataIndex: "referralCode",
      title: "Ma gioi thieu",
    },
    {
      key: "TOTAL ORDER",
      dataIndex: "totalOrder",
      title: "Tong so don",
    },
    {
      key: "TOTAL PURCHASE PRICE",
      dataIndex: "totalPurchasePrice",
      title: "Tong tien da chi",
    },
    {
      key: "INSERTED AT",
      dataIndex: "insertedAt",
      title: "Ngay tao",
    },
  ];

  const getData: () => TableProps<CustomerType>["dataSource"] = () => {
    return [];
  };
  return (
    <Layout>
      <HeaderAction
        title="Khach hang"
        isShowSearch={true}
        inputPlaholder="Tim kiem khach hang"
      />
      <Layout.Content className="p-5 h-screen">
        <ActionTools />
        <Table
          columns={columns}
          dataSource={getData()}
          virtual
          scroll={{ x: 2500, y: 500 }}
          pagination={{
            pageSize: 30,
            defaultPageSize: 30,
            pageSizeOptions: [10, 20, 30, 50, 100],
            total: 100,
            size: "small",
          }}
          size="small"
        />
      </Layout.Content>
    </Layout>
  );
}

export default Customer;
