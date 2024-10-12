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
      <HeaderAction isShowSearch={false} title="Tao hoa don" />
      <Content className="overflow-auto flex p-5 gap-5">
        <Col span={16}>
          <Row>
            <FormBoxProduct />
          </Row>
          <Row>
            <Col span={12}>
              <FormBoxPayment />
            </Col>
            <Col span={12}>
              <FormBoxNote />
            </Col>
          </Row>
        </Col>
        <Col span={8}>
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
      </Content>
      <Footer className="bg-white flex justify-between items-center shadow-2xl rounded-tr-2xl rounded-tl-2xl">
        <div>Can thanh toan: {totalPrice}</div>
        <Button icon={<SaveOutlined />} type="primary">
          Luu
        </Button>
      </Footer>
    </Layout>
  );
}

export default Sale;
