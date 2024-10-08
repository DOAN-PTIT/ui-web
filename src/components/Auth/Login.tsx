"use client";

import { Button, Carousel, Col, Form, Input, Row } from "antd";
import reportImage from "@/assets/report-image.jpg";
import orderImage from "@/assets/order-image.jpg";
import customerImage from "@/assets/customer-image.jpg";
import Image from "next/image";
import "@/styles/login.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

const { Password } = Input;
function LoginComponent() {
  const route = useRouter()
  const shopId = 12
  const handleSubmitForm = () => {
    route.push(`shop/${shopId}`)
  }

  return (
    <main className="login__container p-10 m-10">
      <Row className="border rounded-md h-[80vh]" align="middle">
        <Col span={10} className="p-10">
          <h1 className="text-center font-bold text-2xl mb-4">Đăng nhập</h1>
          <Form className="" layout="vertical" onFinish={handleSubmitForm}>
            <Form.Item
              label="Tên đang nhập"
              name={"username"}
              rules={[
                {
                  required: true,
                  message: "Tai khoan khong duoc de trong",
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
                  message: "mat khau khong duoc de trong",
                },
              ]}
            >
              <Password placeholder="Mật khẩu" name="password" />
            </Form.Item>
            <Form.Item className="text-center">
              <Button htmlType="submit" type="primary">Đăng nhập</Button>
            </Form.Item>
            <Form.Item className="text-center">
              <span>
                Nếu bạn chưa có tài khoản, đăng ký{" "}
                <Link href={"/sign-up"} className="font-medium">
                  tại đây!!
                </Link>
              </span>
            </Form.Item>
          </Form>
        </Col>
        <Col span={14} className="h-full text-center">
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
          </Carousel>
        </Col>
      </Row>
    </main>
  );
}

export default LoginComponent;
