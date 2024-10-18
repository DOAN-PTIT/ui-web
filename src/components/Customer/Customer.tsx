"use client";

import { Layout, Modal, Table, Input, Divider, DatePicker } from "antd";
import HeaderAction from "../HeaderAction/HeaderAction";
import ActionTools from "../ActionTools/ActionTools";
import type { TableProps } from "antd";
import { useState } from "react";
import {
  CalendarOutlined,
  ContainerOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";

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
  const [modalVisiable, setModalVisiable] = useState(false);
  const columns: TableProps<CustomerType>["columns"] = [
    {
      key: "ID",
      dataIndex: "id",
      title: "ID",
      fixed: "left",
      width: 180,
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

  const callBack = () => {
    setModalVisiable(true);
  };

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
        <ActionTools callBack={callBack} />
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
      <Modal
        title={
          <div>
            Them khach hang
            <Divider />
          </div>
        }
        open={modalVisiable}
        onCancel={() => setModalVisiable(false)}
      >
        <div className="mt-5">
          <div className="flex">
            <UserOutlined className="mr-5" />
            <Input name="name" placeholder="Ten khach hang" />
          </div>
          <Divider />
          <div className="flex">
            <MailOutlined className="mr-5" />
            <Input name="email" placeholder="Email" />
          </div>
          <Divider />
          <div className="flex">
            <PhoneOutlined className="mr-5" />
            <Input name="phone_number" placeholder="So dien thoai" />
          </div>
          <Divider />
          <div className="flex">
            <CalendarOutlined className="mr-5" />
            <DatePicker
              name="date_of_birth"
              className="w-full"
              placeholder="Ngay sinh"
            />
          </div>
          <Divider />
          <div className="flex">
            <ContainerOutlined className="mr-5" />
            <Input name="address" placeholder="Dia chi" />
          </div>
          <Divider />
        </div>
      </Modal>
    </Layout>
  );
}

export default Customer;
