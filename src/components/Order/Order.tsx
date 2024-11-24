"use client";

import { Col, Layout, Row, Table } from "antd";
import ActionTools from "../ActionTools/ActionTools";
import HeaderAction from "../HeaderAction/HeaderAction";
import type { TableProps } from "antd";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/store";
import { getListOrders } from "@/action/order.action";
import { connect } from "react-redux";
import { useEffect, useState } from "react";

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

interface OrderProps extends ReturnType<typeof mapStateToProps>, ReturnType<typeof mapDispatchToProps> {}

function Order(props: OrderProps) {
  const { isLoading, currentShop } = props;
  const defaultParams = {
    page: 1,
    page_size: 30,
    shop_id: currentShop.id
  }

  const [totalEntries, setTotalEntries] = useState();
  const [params, setParams] = useState({...defaultParams});

  const route = useRouter()

  useEffect(() => {
    props.getListOrders(params).then(res => {
      setTotalEntries(res.payload.totalEntries)
    })
  }, []);

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
      title: "Sản phẩm",
    },
    {
      key: "CUSTOMER",
      dataIndex: "customer",
      title: "Khách hàng",
    },
    {
      key: "ADDRESS",
      dataIndex: "address",
      title: "Địa chỉ",
      width: 200,
      ellipsis: true,
    },
    {
      key: "PHONE NUMBER",
      dataIndex: "phoneNumber",
      title: "Số điện thoại",
    },
    {
      key: "TOTAL PRICE",
      dataIndex: "totalPrice",
      title: "Tổng tiền",
      width: 200,
      ellipsis: true,
    },
    {
      key: "DISCOUNT",
      dataIndex: "discount",
      title: "Giảm giá",
    },
    {
      key: "INSERTED AT",
      dataIndex: "insertedAt",
      title: "Ngày tạo",
    },
    {
      key: "UPDATE AT",
      dataIndex: "updatedAt",
      title: "Ngày cập nhật",
    },
  ];

  columns.push({
    key: "status",
    dataIndex: "status",
    title: "Trạng thái",
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

  const getListOrders = async (params: any) => {
    props.getListOrders(params)
    .then(res => {
      setTotalEntries(res.payload.totalEntries)
    })
  }

  return (
    <Layout className={"h-screen order__container"}>
      <HeaderAction
        title="Đơn hàng"
        isShowSearch={true}
        inputPlaholder="Tìm kiếm đơn hàng"
      />
      <Content className="content p-5">
        <ActionTools callBack={() => route.push("sale")} reloadCallBack={() => getListOrders(params)} />
        <Table
          columns={columns}
          rootClassName={"order__table__container"}
          style={{height: '100vh'}}
          dataSource={getData()}
          footer={() => renderTableFooter()}
          virtual
          pagination={{
            defaultPageSize: 30,
            total: totalEntries,
            size: "small",
            pageSizeOptions: ["10", "20", "30", "50", "100"],
            onChange: page => {
              if (page !== params.page) {
                setParams({...params, page})
                getListOrders(params);
              }
            }
          }}
          scroll={{ x: 2880, y: 500 }}
          size="small"
          loading={isLoading}
        />
      </Content>
    </Layout>
  );
}

const mapStateToProps = (state: RootState) => {
  return {
    isLoading: state.orderReducer.isLoading,
    currentShop: state.shopReducer.shop
  };
}

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
    getListOrders: (params: {page: number, page_size: number, shop_id: number}) => dispatch(getListOrders(params))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Order);
