"use client";

import {
  Col,
  Layout,
  message,
  notification,
  Row,
  Select,
  Table,
  Tag,
  Typography,
} from "antd";
import ActionTools from "../ActionTools/ActionTools";
import HeaderAction from "../HeaderAction/HeaderAction";
import type { TableProps } from "antd";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/store";
import { getListOrders, updateOrder } from "@/action/order.action";
import { connect } from "react-redux";
import { useEffect, useState } from "react";
import moment from "moment";
import { autoAddZero, formatNumber, orderStatus } from "@/utils/tools";
import "../../styles/global.css";
import OrderDetail from "../OrderDetail";
import { createOrder } from "@/reducer/order.reducer";
import Avatar from "react-avatar";
import apiClient from "@/service/auth";
import CustomSelect from "@/container/CustomSelect";
import { debounce } from "lodash";
import OrderExcelExcel from "../OrderExcelExcel";

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
  total_discount: string;
}

const { Content } = Layout;
const { Text } = Typography;

interface OrderProps
  extends ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps> {}

function Order(props: OrderProps) {
  const { currentShop, updateOrder } = props;
  const defaultParams = {
    page: 1,
    page_size: 30,
    shop_id: currentShop.id,
  };

  const [totalEntries, setTotalEntries] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [params, setParams] = useState({ ...defaultParams });
  const [selectedRowKey, setSelectedRowKey] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [isExportExcel, setIsExportExcel] = useState(false);

  const route = useRouter();

  useEffect(() => {
    getListOrders(params);
  }, []);

  const getListOrders = async (params: any) => {
    setIsLoading(true);
    try {
      const url = `shop/${params.shop_id}/orders`;
      return await apiClient.get(url, { params }).then((res) => {
        setOrders(res.data.data);
        setTotalEntries(res.data.totalEntries);
        setIsLoading(false);
      });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const columns: TableProps<ColumnType>["columns"] = [
    {
      key: "STT",
      dataIndex: "stt",
      title: "STT",
      fixed: "left",
      width: 80,
      render: (_: any, __: any, index: number) => {
        return <span className="font-medium">{autoAddZero(index + 1, 0)}</span>;
      },
    },
    {
      key: "ID",
      dataIndex: "id",
      title: "ID",
      fixed: "left",
      width: 120,
      render: (text) => {
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <Text
              copyable={{
                icon: <div className="font-bold">{autoAddZero(text, 0)}</div>,
                onCopy(event) {
                  message.success(
                    `Sao chép thành công mã đơn hàng: ${autoAddZero(text, 0)}`
                  );
                },
                tooltips: "Click để sao chép mã đơn hàng",
              }}
            />
          </div>
        );
      },
    },
    {
      key: "PRODUCT",
      dataIndex: "product",
      title: "Sản phẩm",
      ellipsis: true,
      render: (product: any) => {
        return <span className="font-medium">{product}</span>;
      },
    },
    {
      key: "CUSTOMER",
      dataIndex: "customer",
      title: "Khách hàng",
      render: (customer: any) => {
        return (
          <div>
            <Avatar name={customer.name} size="25" round={true} />
            <span className="ml-2">{customer.name}</span>
          </div>
        );
      },
    },
    {
      key: "ADDRESS",
      dataIndex: "address",
      title: "Địa chỉ",
      width: "20%",
      ellipsis: true,
    },
    {
      key: "PHONE NUMBER",
      dataIndex: "phoneNumber",
      title: "Số điện thoại",
      width: 200,
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
      dataIndex: "total_discount",
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
    render: (status: number, record: any) => {
      return (
        <CustomSelect
          data={orderStatus}
          currentStatus={status.toString()}
          handleSelect={handleUpdateOrderStatus}
          handleClick={(e) => {
            e.stopPropagation();
            setSelectedRowKey(record.id);
            setOpen(false);
          }}
        />
      );
    },
  });

  const handleUpdateOrderStatus = async (value: any, prevStatus: any) => {
    if (prevStatus == "-1") {
      notification.warning({
        message: "Cập nhật đơn hàng thất bại",
        description: "Đơn hàng đã bị hủy, không thể cập nhật trạng thái",
      });
      return;
    }
    
    const params = {
      shop_id: currentShop.id,
      id: selectedRowKey,
      status: value,
      is_update_status: true,
    };
    await updateOrder(params)
      .then((res) => {
        setSelectedRowKey(null);
        notification.success({
          message: "Thành công",
          description: "Cập nhật trạng thái đơn hàng thành công",
        });
        getListOrders(defaultParams);
      })
      .catch((error) => {
        console.log(error);
        setSelectedRowKey(null);
        notification.error({
          message: "Lỗi",
          description: "Cập nhật trạng thái đơn hàng thất bại",
        });
      });
  };

  const getData: () => TableProps<any>["dataSource"] = () => {
    return orders.map((order: any) => {
      return {
        id: order.id,
        product: order?.orderitems
          .map((variation: any) => variation.variation.product.name)
          .join("; "),
        customer: order?.customer,
        phoneNumber: order?.customer?.phone_number || "",
        address: order?.customer?.address || "",
        status: order.status || 1,
        totalPrice: `${formatNumber(order.total_cost)} đ`,
        insertedAt: moment(order.createdAt).format("DD/MM/YYYY HH:mm"),
        updatedAt: moment(order.updatedAt).format("DD/MM/YYYY HH:mm"),
        total_discount: order.total_discount || 0,
      };
    });
  };

  const handleRowClick = (record: any) => {
    setSelectedRowKey(record.id);
    setOpen(true);
  };

  const renderTableFooter = () => {
    const totalPrice = orders.reduce((acc, order) => {
      return acc + order?.total_cost;
    }, 0);
    return (
      <Row>
        <Col span={4}>
          Tổng tiền:{" "}
          <span className="font-bold text-green-500">
            {formatNumber(totalPrice)} đ
          </span>
        </Col>
      </Row>
    );
  };

  const handleSearch = (value: string): any => {
    const searchParams = { ...params, search: value };
    setParams(searchParams);
    getListOrders(searchParams);
  };

  const debouncedSearch = debounce(handleSearch, 600);

  return (
    <Layout className={"h-full"}>
      <HeaderAction
        title="Đơn hàng"
        isShowSearch={true}
        inputPlaholder="Tìm kiếm đơn hàng theo id, khách hàng, số điện thoại, sản phẩm"
        handleSearch={debouncedSearch}
      />
      <Content className="content bg-gray-200 rounded-tl-xl p-5 order__table__container">
        <ActionTools
          callBack={() => route.push("sale")}
          reloadCallBack={() => getListOrders(params)}
          handleClickExportExcel={() => setIsExportExcel(true)}
        />
        <Table
          columns={columns}
          dataSource={getData()}
          footer={() => renderTableFooter()}
          virtual
          onRow={(record) => {
            return {
              onClick: () => {
                handleRowClick(record);
              },
              style: { cursor: "pointer" },
            };
          }}
          pagination={{
            defaultPageSize: 30,
            total: totalEntries,
            size: "small",
            pageSizeOptions: ["10", "20", "30", "50", "100"],
            onChange: (page) => {
              if (page !== params.page) {
                setParams({ ...params, page });
                getListOrders(params);
              }
            },
          }}
          scroll={{ x: 2880 }}
          size="small"
          loading={isLoading}
        />
      </Content>
      {open && (
        <OrderDetail
          selectedRowKey={selectedRowKey}
          open={true}
          setOpen={setOpen}
          fetchOrder={() => getListOrders(params)}
        />
      )}
      {isExportExcel && <OrderExcelExcel open={isExportExcel} onCancel={() => setIsExportExcel(false)} />}
    </Layout>
  );
}

const mapStateToProps = (state: RootState) => {
  return {
    isLoading: state.orderReducer.isLoading,
    currentShop: state.shopReducer.shop,
  };
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
    getListOrders: (params: {
      page: number;
      page_size: number;
      shop_id: number;
    }) => dispatch(getListOrders(params)),
    createOrder: (order: any) => dispatch(createOrder(order)),
    updateOrder: (order: any) => dispatch(updateOrder(order)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Order);
