"use client";

import customerImage from "@/assets/customer-image.jpg";
import orderImage from "@/assets/order-image.jpg";
import reportImage from "@/assets/report-image.jpg";
import apiClient from "@/service/auth";
import "@/styles/login.css";
import { FacebookOutlined } from "@ant-design/icons";
import type { NotificationArgsProps } from "antd";
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
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
function saveTokenWithExpiration(token: string, expiresIn = 1800) { // Default is 30 minutes (1800 seconds)
  const expirationTime = Date.now() + expiresIn * 1000;
  localStorage.setItem("accessToken", token);
  localStorage.setItem("tokenExpiration", expirationTime.toString());
}
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
  const [errorLogin, setErrorLogin] = useState()
  useEffect(() => { }, []);
  const route = useRouter();
  const handleSubmitForm = async () => {
    setIsLoading(true);
    const url = `/auth/email/login`;

    return await apiClient
      .post(url, params)
      .then((res) => {
        const token = res.data.accessToken;
        const refreshToken = res.data.refreshToken;
        saveTokenWithExpiration(token);
        localStorage.setItem("refreshToken", refreshToken);
        route.push("/shop/overview");
      })
      .catch((error: any) => {
        const res = error.response.data.message;
        console.log('rfgds',res);
        setErrorLogin(res)
        // openNotification(res);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const openNotification = (message: NotificationPlacement) => {
    api.error({
      message: "Unsuccess",
      description: message,
    });
  };

  const handleLoginWithFacebook = () => {
    const fb_url = "http://localhost:8000/social/facebook"
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
              label="Tên đăng nhập"
              name={"username"}
              rules={[
                {
                  required: true,
                  message: "Tài khoản không được để trống",
                },

              ]}
            validateStatus={errorLogin ? 'error' : undefined}
            help={errorLogin ? 'Tài khoản hoặc mật khẩu không đúng!' : undefined}
            >
            <Input
              placeholder="Tên đăng nhập"
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
                message: "Mật khẩu trông được để trống",
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
            Đăng nhập bằng Facebook
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
    </main >
  );
}

export default LoginComponent;
