"use client";

import { Col, Layout, Row, Table } from "antd";
import ActionTools from "../ActionTools/ActionTools";
import HeaderAction from "../HeaderAction/HeaderAction";
import type { TableProps } from "antd";
import { useRouter } from "next/navigation";

interface ColumnType {
  id: string;
  product: string;
  customer: string;
  phoneNumber: string;
  address: string;
  status: string;
  totalPrice: number;
  insertedAt: string;
  updatedAt: string;
  discount: string;
}

const { Content } = Layout;
function Order() {
  const route = useRouter()

  const columns: TableProps<ColumnType>["columns"] = [
    {
      key: "ID",
      dataIndex: "id",
      title: "ID",
      fixed: "left",
      width: 200,
    },
    {
      key: "PRODUCT",
      dataIndex: "product",
      title: "San Pham",
    },
    {
      key: "CUSTOMER",
      dataIndex: "customer",
      title: "Khach hang",
    },
    {
      key: "ADDRESS",
      dataIndex: "address",
      title: "Dia chi",
      width: 200,
      ellipsis: true,
    },
    {
      key: "PHONE NUMBER",
      dataIndex: "phoneNumber",
      title: "SDT",
    },
    {
      key: "TOTAL PRICE",
      dataIndex: "totalPrice",
      title: "Tong tien",
      width: 200,
      ellipsis: true,
    },
    {
      key: "DISCOUNT",
      dataIndex: "discount",
      title: "Giam gia",
    },
    {
      key: "INSERTED AT",
      dataIndex: "insertedAt",
      title: "Ngay tao",
    },
    {
      key: "UPDATE AT",
      dataIndex: "updatedAt",
      title: "Ngay cap nhat",
    },
  ];

  columns.push({
    key: "status",
    dataIndex: "status",
    title: "Trang thai",
    fixed: "right",
    width: 200,
  });

  const getData: () => TableProps<ColumnType>["dataSource"] = () => {
    return []
  };

  const renderTableFooter = () => {
    const totalPrice = 123;
    return (
      <Row>
        <Col span={4}>
          Tong tien: <span>{totalPrice}</span>
        </Col>
      </Row>
    );
  };

  return (
    <Layout className={"h-screen order__container"}>
      <HeaderAction
        title="Đơn hàng"
        isShowSearch={true}
        inputPlaholder="Tìm kiếm đơn hàng"
      />
      <Content className="content p-5">
        <ActionTools callBack={() => route.push("sale")} />
        <Table
          columns={columns}
          rootClassName={"order__table__container"}
          style={{height: '100vh'}}
          dataSource={getData()}
          footer={() => renderTableFooter()}
          virtual
          pagination={{
            defaultPageSize: 30,
            total: 100,
            size: "small",
            pageSizeOptions: ["10", "20", "30", "50", "100"],
          }}
          scroll={{ x: 2880, y: 500 }}
          size="small"
        />
      </Content>
    </Layout>
  );
}

export default Order;
