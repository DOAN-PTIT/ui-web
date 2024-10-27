"use client";

import { Col, Form, Layout, Row, Input, Carousel, Button, message, notification } from "antd";
import reportImage from "@/assets/report-image.jpg";
import orderImage from "@/assets/order-image.jpg";
import customerImage from "@/assets/customer-image.jpg";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { getHostName } from "@/utils/tools";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { NotificationPlacement } from "antd/es/notification/interface";

const { Content } = Layout;
const { Password } = Input;

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

function SignUpComponent() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [api, contextHolder] = notification.useNotification();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<Omit<RegisterForm, "confirmPassword">>({
    name: "",
    email: "",
    password: ""
  });

  const handleRegister = async () => {
    try {
      const response = await axios.post(
        `${getHostName()}/auth/email/register`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      message.success(response.data.message || "Đăng ký thành công");
      router.push("/login");
    } catch (error: any) {
      const res = error.response.data.message.join("\n ");
      console.log(error);
      openNotification(res);
    }
    finally {
      setIsLoading(false);
    }
  };
  const openNotification = (message: NotificationPlacement) => {
    api.error({
      message: "Login Unsuccess",
      description: message,
    });
  };
  const handleFieldsChange = (_: any, allFields: any) => {
    const updatedData = allFields.reduce((acc: any, field: any) => {
      if (field.name[0] !== "confirmPassword") {
        acc[field.name[0]] = field.value;
      }
      return acc;
    }, {});
    setFormData(updatedData);
  };

  return (
    <Layout className="h-screen">
      {contextHolder}
      <Content>
        <Row className="h-[80vh] bg-white m-10 p-10 rounded-md" align="middle">
          <Col span={8}>
            <h1 className="text-center mb-5 font-bold text-3xl">Đăng ký</h1>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleRegister}
              onFieldsChange={handleFieldsChange} 
            >
              <Form.Item
                label="Tên"
                name="name"
                rules={[{ required: true, message: "Tên không được để trống" }]}
              >
                <Input placeholder="Tên" />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Email không được để trống" },
                  { type: "email", message: "Email không hợp lệ" },
                ]}
              >
                <Input placeholder="Email" />
              </Form.Item>

              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[{ required: true, message: "Mật khẩu không được để trống" }]}
              >
                <Password placeholder="Mật khẩu" />
              </Form.Item>

              <Form.Item
                label="Xác nhận mật khẩu"
                name="confirmPassword"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Xác nhận mật khẩu không được để trống" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Mật khẩu không khớp!"));
                    },
                  }),
                ]}
              >
                <Password placeholder="Xác nhận mật khẩu" />
              </Form.Item>

              <Form.Item className="text-center">
                <Button type="primary" htmlType="submit" loading={isLoading}>
                  Đăng ký
                </Button>
              </Form.Item>

              <Form.Item className="text-center">
                <span>
                  Nếu bạn đã có tài khoản, đăng nhập{" "}
                  <Link href="/login">tại đây!</Link>
                </span>
              </Form.Item>
            </Form>
          </Col>

          <Col span={16} className="text-center">
            <Carousel autoplay autoplaySpeed={5000} className="h-full">
              <div>
                <Image src={orderImage} height={500} alt="Quản lý bán hàng" />
                <h1 className="text-4xl font-bold mb-2">Quản lý bán hàng</h1>
                <span className="font-medium opacity-85">
                  Ghi nhận các giao dịch bán hàng, in hóa đơn, và quản lý thanh toán.
                </span>
              </div>
              <div>
                <Image src={customerImage} height={480} alt="Quản lý khách hàng" />
                <h1 className="text-4xl font-bold mb-2">Quản lý khách hàng</h1>
                <span className="font-medium opacity-85">
                  Lưu trữ thông tin khách hàng, theo dõi lịch sử giao dịch và
                  chương trình khách hàng thân thiết.
                </span>
              </div>
              <div>
                <Image src={reportImage} height={480} alt="Báo cáo và phân tích" />
                <h1 className="text-4xl font-bold mb-2">Báo cáo và phân tích</h1>
                <span className="font-medium opacity-85">
                  Cung cấp các báo cáo chi tiết về doanh thu, lợi nhuận và hiệu
                  suất kinh doanh để giúp người quản lý đưa ra quyết định.
                </span>
              </div>
            </Carousel>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}

export default SignUpComponent;
