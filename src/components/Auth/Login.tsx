"use client";

import React from "react";
import {
  Button,
  Carousel,
  Col,
  Divider,
  Form,
  Input,
  Row,
  notification,
} from "antd";
import type { NotificationArgsProps } from "antd";
import reportImage from "@/assets/report-image.jpg";
import orderImage from "@/assets/order-image.jpg";
import customerImage from "@/assets/customer-image.jpg";
import Image from "next/image";
import "@/styles/login.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { getHostName } from "@/utils/tools";
import { FacebookOutlined } from "@ant-design/icons";

interface ParamsLogin {
  email: string;
  password: string;
}
type NotificationPlacement = NotificationArgsProps["placement"];

const { Password } = Input;
function LoginComponent() {
  const [params, setParams] = useState<ParamsLogin>({
    email: "",
    password: "",
  });
  const [api, contextHolder] = notification.useNotification();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {}, []);
  const route = useRouter();
  const handleSubmitForm = async () => {
    setIsLoading(true);
    const url = `${getHostName()}/auth/email/login`;
    return await axios
      .post(url, params)
      .then((res) => {
        const token = res.data.accessToken;
        localStorage.setItem("token", token);
        route.push("/shop/overview");
      })
      .catch((error) => {
        const res = error.response.data.message.join("\n ");
        console.log(error);
        openNotification(res);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const openNotification = (message: NotificationPlacement) => {
    api.error({
      message: "Login Unsuccess",
      description: message,
    });
  };

  const handleLoginWithFacebook = () => {
    const redirect_uri = "http://localhost:8000/social/facebook/redirect";
    const fb_url = `https://www.facebook.com/v3.2/dialog/oauth?response_type=code&redirect_uri=${redirect_uri}&scope=public_profile%2Cemail%2Cpages_manage_metadata%2Cpages_read_engagement%2Cpages_show_list%2Cpages_read_user_content%2Cpages_manage_posts%2Cpages_manage_engagement%2Cpages_messaging%2Cpage_events%2Cpages_show_list%2Cads_management%2Ccatalog_management%2Cleads_retrieval%2Cbusiness_management&client_id=857187493287495`;
    document.location = fb_url;
  };

  return (
    <main className="login__container p-10 m-10">
      {contextHolder}
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
              <Input
                placeholder="Tên đang nhập"
                name="username"
                onChange={(e) =>
                  setParams({ ...params, email: e.target.value })
                }
              />
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
              <Password
                placeholder="Mật khẩu"
                name="password"
                onChange={(e) =>
                  setParams({ ...params, password: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item className="text-center">
              <Button htmlType="submit" type="primary" loading={isLoading}>
                Đăng nhập
              </Button>
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
          <Divider />
          <div className="text-center">
            <Button
              onClick={handleLoginWithFacebook}
              icon={<FacebookOutlined />}
              type="primary"
            >
              Dang nhap bang Facebook
            </Button>
          </div>
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
