"use client";

import { Button, Col, Layout, Row } from "antd";
import HeaderAction from "../HeaderAction/HeaderAction";
import { SaveOutlined } from "@ant-design/icons";
import FormBoxProduct from "../FormBox/Product/FormBoxProduct";
import FormBoxPayment from "../FormBox/Payment/FormBoxPayment";
import FormBoxNote from "../FormBox/Note/FormBoxNote";
import FormBoxOrderInfo from "../FormBox/OrderInfo/FormBoxOrderInfo";
import FormBoxCustomer from "../FormBox/Customer/FormBoxCustomer";
import FormBoxReceive from "../FormBox/Receive/FormBoxReceive";

const { Content, Footer } = Layout;
function Sale() {
  const totalPrice = 0;
  return (
    <Layout className="h-screen">
      <HeaderAction isShowSearch={false} title="Tạo hóa đơn" />
      <Content className="bg-white rounded-xl overflow-auto overflow-x-hidden flex p-5 gap-5 w-full">
        <Row justify='space-between' className="w-full">
          <Col span={15}>
            <Row>
              <FormBoxProduct />
            </Row>
            <Row justify="space-between" className="mt-4">
              <Col span={11}>
                <FormBoxPayment />
              </Col>
              <Col span={11}>
                <FormBoxNote />
              </Col>
            </Row>
          </Col>
          <Col span={8} className="flex flex-col gap-4">
            <Row>
              <FormBoxOrderInfo />
            </Row>
            <Row>
              <FormBoxCustomer />
            </Row>
            <Row>
              <FormBoxReceive />
            </Row>
          </Col>
        </Row>
      </Content>
      <Footer className="bg-white flex justify-between items-center mt-4 shadow-2xl rounded-tr-2xl rounded-tl-2xl">
        <div className="text-xl font-medium">Can thanh toan: {totalPrice}</div>
        <Button icon={<SaveOutlined />} type="primary">
          Luu
        </Button>
      </Footer>
    </Layout>
  );
}

export default Sale;
