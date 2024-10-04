"use client";

import { Col, Form, Layout, Row, Input, Carousel, Button } from "antd";
import reportImage from "@/assets/report-image.jpg";
import orderImage from "@/assets/order-image.jpg";
import customerImage from "@/assets/customer-image.jpg";
import Image from "next/image";
import Link from "next/link";

const { Content } = Layout;
const { Password } = Input;

function SignUpComponent() {
  return (
    <Layout className="h-screen">
      <Content>
        <Row className="h-[80vh] bg-white m-10 p-10 rounded-md" align={'middle'}>
          <Col span={8}>
          <h1 className="text-center mb-5 font-bold text-3xl">Dang Ky</h1>
            <Form layout="vertical">
              <Form.Item
                label="Tên đang nhập"
                name={"username"}
                rules={[
                  {
                    required: true,
                    message: "Ten dang nhap khong duoc de trong",
                  },
                ]}
              >
                <Input placeholder="Tên đang nhập" name="username" />
              </Form.Item>
              <Form.Item
                label="Mật khẩu"
                name={"password"}
                rules={[
                  {
                    required: true,
                    message: "Mat khau khong duoc de trong",
                  },
                ]}
              >
                <Password placeholder="Mật khẩu" name="password" />
              </Form.Item>
              <Form.Item
                label="Xác nhận mật khẩu"
                dependencies={["password"]}
                name={"confirm"}
                rules={[
                  {
                    required: true,
                    message: "Xac nhan mat khau khong duoc de trong",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(
                          "Mat khau khong khop!"
                        )
                      );
                    },
                  }),
                ]}
              >
                <Password placeholder="Confirm Password" />
              </Form.Item>
              <Form.Item className="text-center">
                <Button htmlType="submit" type="primary">Dang Ky</Button>
              </Form.Item>
              <Form.Item className="text-center">
                <span>Neu ban da co tai khoan, dang nhap <Link href={'/login'}>tai day!!</Link></span>
              </Form.Item>
            </Form>
          </Col>
          <Col span={16} className="text-center">
          <Carousel
            autoplay
            autoplaySpeed={5000}
            rootClassName="h-full"
            className="h-full"
          >
            <div>
              <Image src={orderImage} height={500} alt="" />
              <h1 className="text-4xl font-bold mb-2">Quản lý bán hàng</h1>
              <span className="font-medium opacity-85">
                Ghi nhận các giao dịch bán hàng, in hóa đơn, và quản lý thanh
                toán
              </span>
            </div>
            <div>
              <Image src={customerImage} height={480} alt="" />
              <h1 className="text-4xl font-bold mb-2">Quản lý khách hàng</h1>
              <span className="font-medium opacity-85">
                Lưu trữ thông tin khách hàng, theo dõi lịch sử giao dịch và
                chương trình khách hàng thân thiết.
              </span>
            </div>
            <div>
              <Image src={reportImage} height={480} alt="" />
              <h1 className="text-4xl font-bold mb-2">Báo cáo và phân tích</h1>
              <span className="font-medium opacity-85">
                Cung cấp các báo cáo chi tiết về doanh thu, lợi nhuận và hiệu
                suất kinh doanh để giúp người quản lý đưa ra quyết định.
              </span>
            </div>
          </Carousel></Col>
        </Row>
      </Content>
    </Layout>
  );
}

export default SignUpComponent;
