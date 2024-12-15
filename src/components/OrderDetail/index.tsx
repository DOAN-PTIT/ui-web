import apiClient from "@/service/auth";
import { AppDispatch, RootState } from "@/store";
import {
  Avatar as AntAvatar,
  Button,
  Col,
  Modal,
  notification,
  Row,
  Spin,
} from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { connect } from "react-redux";
import FormBoxCustomer from "../FormBox/Customer/FormBoxCustomer";
import FormBoxNote from "../FormBox/Note/FormBoxNote";
import FormBoxOrderInfo from "../FormBox/OrderInfo/FormBoxOrderInfo";
import FormBoxPayment from "../FormBox/Payment/FormBoxPayment";
import FormBoxProduct from "../FormBox/Product/FormBoxProduct";
import FormBoxReceive from "../FormBox/Receive/FormBoxReceive";
import "@/styles/order_detail.css";
import { calcTotalOrderPrice, formatNumber, orderStatus } from "@/utils/tools";
import { createOrder } from "@/reducer/order.reducer";
import Avatar from "react-avatar";
import { updateOrder } from "@/action/order.action";

interface OrderDetailProps
  extends ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps> {
  selectedRowKey: any;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  fetchOrder: () => Promise<void>;
}

function OrderDetail(props: OrderDetailProps) {
  const {
    selectedRowKey,
    open,
    setOpen,
    currentShop,
    createOrder,
    orderParams,
    updateOrder,
  } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [orderDetail, setOrderDetail] = useState<any>({});
  const [isAtCounter, setIsAtCounter] = useState(false);

  useEffect(() => {
    getOrderDetail();
  }, [selectedRowKey]);

  const getOrderDetail = async () => {
    setIsLoading(true);
    const url = `/shop/${currentShop.id}/order/${selectedRowKey}`;

    return await apiClient
      .get(url, { params: { id: selectedRowKey, shop_id: currentShop.id } })
      .then((res) => {
        const { data } = res;
        setOrderDetail(data);
        createOrder(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        const message = error?.response?.data?.message || "Lỗi không xác định";
        setIsLoading(false);
        notification.error({
          message: "Có lỗi xảy ra",
          description: message,
        });
      });
  };

  const renderTitle = () => {
    const shopUser = orderDetail?.shopuser?.user;
    return (
      <div className="flex items-center gap-6">
        <div>
          <span>Thông tin đơn hàng: </span>
          <span className="text-sky-500">#{orderDetail.id}</span>
        </div>
        {shopUser && (
          <div className="flex items-center justify-center">
            <div className="text-[14px]">Phân công cho</div> :&nbsp;
            <div className="flex items-center">
              <Avatar
                src={shopUser?.avatar}
                round
                size="26"
                name={shopUser?.name}
                className="mr-2"
              />
              <span className="text-[16px]">{shopUser?.name}</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  const handleUpdateOrder = () => {
    setIsLoading(true);
    updateOrder(orderParams)
      .then((res) => {
        notification.success({
          message: "Cập nhật đơn hàng thành công",
          description: "Cập nhật đơn hàng thành công",
        });
        setOpen(false);
        createOrder({});
        props.fetchOrder();
        setIsLoading(false);
      })
      .catch((error) => {
        const message = error?.response?.data?.message || "Lỗi không xác định";
        notification.error({
          message: "Cập nhật đơn hàng thất bại",
          description: message,
        });
        setIsLoading(false);
      });
  };

  const renderFooter = () => {
    const status = orderStatus.find((item) => item.key == orderDetail.status);
    const totalCost = calcTotalOrderPrice(orderDetail);
    return (
      <div className="flex justify-between items-center">
        <div className="text-[18px]">
          Cần thanh toán:{" "}
          <span className="font-bold">{formatNumber(totalCost, "VND")} đ</span>
        </div>
        <div className="flex gap-4 items-center">
          {status && (
            <div
              className={`text-${status?.color}-500 border p-3 rounded-md text-[16px] cursor-default bg-${status?.color}-300 border-${status?.color}-600`}
            >
              Trang thái: <span className="font-bold">{status?.value}</span>
            </div>
          )}
          <Button
            style={{ height: 50, width: 140 }}
            className="p-4 text-[16px]"
            type="primary"
            onClick={handleUpdateOrder}
            loading={isLoading}
          >
            Lưu
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Modal
      wrapClassName={""}
      styles={{
        body: {
          height: "clamp(320px, 80vh, 1000px)",
          overflow: "hidden",
          overflowY: "auto",
          position: "relative",
        },
        wrapper: { height: "100vh", overflow: "hidden" },
      }}
      open={open}
      title={renderTitle()}
      footer={renderFooter()}
      onCancel={() => {
        setOpen(false);
        createOrder({});
      }}
      width="90%"
      className="top-2"
    >
      {isLoading ? (
        <div className="h-full w-full flex items-center justify-center">
          <div className="mr-4 font-medium text-[18px]">
            Đợi chút bạn nhé...
          </div>
          <Spin />
        </div>
      ) : (
        <div className="bg-gray-200 rounded-xl flex p-5 gap-5 w-full">
          <Row justify="space-between" className="w-full">
            <Col span={15}>
              <Row>
                <FormBoxProduct
                  setIsAtCounter={setIsAtCounter}
                  isAtCounter={isAtCounter}
                  order={orderDetail}
                />
              </Row>
              <Row justify="space-between" className="mt-4">
                <Col span={11}>
                  <FormBoxPayment order={orderDetail} />
                </Col>
                <Col span={11}>
                  <FormBoxNote order={orderDetail} />
                </Col>
              </Row>
            </Col>
            <Col span={8} className="flex flex-col gap-4">
              <Row>
                <FormBoxOrderInfo order={orderDetail} />
              </Row>
              <Row>
                <FormBoxCustomer order={orderDetail} />
              </Row>
              <Row>
                <FormBoxReceive order={orderDetail} />
              </Row>
            </Col>
          </Row>
        </div>
      )}
    </Modal>
  );
}

const mapStateToProps = (state: RootState) => {
  return {
    currentShop: state.shopReducer.shop,
    orderParams: state.orderReducer.createOrder,
  };
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
    createOrder: (order: any) => dispatch(createOrder(order)),
    updateOrder: (order: any) => dispatch(updateOrder(order)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetail);
