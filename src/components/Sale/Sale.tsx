"use client";

import { Button, Col, Layout, notification, Row, Spin } from "antd";
import HeaderAction from "../HeaderAction/HeaderAction";
import { SaveOutlined } from "@ant-design/icons";
import FormBoxProduct from "../FormBox/Product/FormBoxProduct";
import FormBoxPayment from "../FormBox/Payment/FormBoxPayment";
import FormBoxNote from "../FormBox/Note/FormBoxNote";
import FormBoxOrderInfo from "../FormBox/OrderInfo/FormBoxOrderInfo";
import FormBoxCustomer from "../FormBox/Customer/FormBoxCustomer";
import FormBoxReceive from "../FormBox/Receive/FormBoxReceive";
import FormBoxShopPartner from "@/components/FormBox/FormBoxShopPartner";
import { AppDispatch, RootState } from "@/store";
import { connect } from "react-redux";
import {
  calcOrderDebt,
  calcTotalOrderPriceOriginal,
  formatNumber,
  calcTotalOrderPrice,
} from "@/utils/tools";
import { Fragment, useEffect, useState } from "react";
import { createOrder } from "@/reducer/order.reducer";
import apiClient from "@/service/auth";
import { isEmpty } from "lodash";
import moment from "moment";

const { Content, Footer } = Layout;
const defaultOrder = {
  shopuser_id: null,
  delivery_company: "",
  total_discount: 0,
  tracking_number: "",
  delivery_cost: 0,
  total_cost: 0,
  surcharge: 0,
}

interface SaleProps
  extends ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps> {}

function Sale(props: SaleProps) {
  const { orderParams, currentUser, currentShop, createOrder } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [isAtCounter, setIsAtCounter] = useState(false);
  const [promotionsCanBeActive, setPromotionsCanBeActive] = useState<any>([]);

  useEffect(() => {
    const { createdAt, shopuser_id, ...res } = orderParams;
    createOrder({
      ...defaultOrder,
      createdAt: createdAt || moment().format("YYYY-MM-DD HH:mm"),
    });
  }, []);

  const handleCreateOrder = async () => {
    setIsLoading(true);
    const url = `/shop/${currentShop.id}/order/create`;

    const params = {
      ...orderParams,
      paid: orderParams.paid,
      shopuser_id: orderParams.shopuser_id
        ? orderParams.shopuser_id
        : currentUser.id,
      products_order: orderParams.orderitems?.map((item: any) => ({
        product_id: item.variation_info.product.id,
        quantity: item.quantity,
        variation_id: item.variation_id,
      })),
      delivery_cost_shop: orderParams.delivery_cost_shop,
      at_counter: isAtCounter,
      total_cost: calcTotalOrderPriceOriginal(orderParams),
    };

    delete params.orderitems;
    delete params.prepaid;
    delete params.promotion;
    return apiClient
      .post(url, params)
      .then((res) => {
        notification.success({
          message: "Tạo hoá đơn thành công",
          description: "Tạo hoá đơn thành công",
        });
        createOrder({
          ...defaultOrder,
          createdAt: moment().format("YYYY-MM-DD HH:mm"),
        });
        setIsLoading(false);
      })
      .catch((err) => {
        const errorMessage = err.response?.data?.message
          ? err.response.data.message
          : "Lỗi không xác định";
        setIsLoading(false);
        createOrder({
          ...defaultOrder,
          createdAt: moment().format("YYYY-MM-DD HH:mm"),
        });
        notification.error({
          message: "Tạo hoá đơn thất bại",
          description: errorMessage,
        });
      });
  };

  const findDiscountCanBeActice = async () => {
    try {
      const url = `shop/${currentShop.id}/promotions/promotion-can-be-active`;
      return await apiClient
        .get(url, {
          params: {
            total_price: calcTotalOrderPrice(orderParams),
            order_total: orderParams.orderitems?.length || 0,
            type: 2,
          },
        })
        .then((res) => {
          setPromotionsCanBeActive(res.data);
        })
        .catch((err) => {
          notification.error({
            message: "Lỗi",
            description: "Lỗi không xác định",
          });
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout className="h-screen">
      <HeaderAction isShowSearch={false} title="Tạo hóa đơn" />
      {isLoading ? (
        <div className="w-full h-screen flex justify-center items-center">
          <p className="font-[600] mr-4">Chờ chút xíu bạn nhé...</p>
          <Spin />
        </div>
      ) : (
        <Fragment>
          <Content className="bg-gray-200 rounded-xl overflow-auto overflow-x-hidden flex p-5 gap-5 w-full">
            <Row justify="space-between" className="w-full" gutter={16}>
              <Col span={15}>
                <Row>
                  <FormBoxProduct
                    setIsAtCounter={setIsAtCounter}
                    isAtCounter={isAtCounter}
                    findDiscountCanBeActice={findDiscountCanBeActice}
                    promotionsCanBeActive={promotionsCanBeActive}
                  />
                </Row>
                <Row justify="space-between" className="mt-4" gutter={16}>
                  <Col span={12}>
                    <FormBoxPayment />
                  </Col>
                  <Col span={12}>
                    <FormBoxNote />
                  </Col>
                </Row>
              </Col>
              <Col span={9} className="flex flex-col gap-4">
                <Row>
                  <FormBoxOrderInfo />
                </Row>
                <Row>
                  <FormBoxCustomer customer={orderParams?.add_customer} />
                </Row>
                <Row>
                  <FormBoxReceive />
                </Row>
                {!orderParams.at_counter && (
                  <Row>
                    <FormBoxShopPartner />
                  </Row>
                )}
              </Col>
            </Row>
          </Content>
          <Footer className="bg-white flex justify-between items-center mt-4 shadow-2xl rounded-tr-2xl rounded-tl-2xl">
            <div className="text-xl font-medium">
              Cần thanh toán: {formatNumber(calcTotalOrderPrice(orderParams))} đ
            </div>
            <Button
              onClick={handleCreateOrder}
              icon={<SaveOutlined />}
              type="primary"
              className="text-[20px] font-medium pt-5 pb-5 pl-6 pr-6"
              loading={isLoading}
            >
              Lưu
            </Button>
          </Footer>
        </Fragment>
      )}
    </Layout>
  );
}

const mapStateToProps = (state: RootState) => {
  return {
    orderParams: state.orderReducer.createOrder,
    currentUser: state.userReducer.user,
    currentShop: state.shopReducer.shop,
  };
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
    createOrder: (order: any) => dispatch(createOrder(order)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Sale);
