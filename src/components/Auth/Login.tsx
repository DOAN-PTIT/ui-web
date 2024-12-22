"use client";

import iconLogo from "@/assets/favicon.png";
import apiClient from "@/service/auth";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Form,
  Grid,
  Input,
  Typography,
  message,
  notification,
} from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
const { Text, Title, Link } = Typography;
const { useBreakpoint } = Grid;

type NotificationPlacement = "topLeft" | "topRight" | "bottomLeft" | "bottomRight";

interface ParamsLogin {
  email: string;
  password: string;
}

function saveTokenWithExpiration(token: string, expiresIn = 1800) {
  const expirationTime = Date.now() + expiresIn * 1000;
  localStorage.setItem("accessToken", token);
  localStorage.setItem("tokenExpiration", expirationTime.toString());
}

export default function LoginComponent() {
  const [params, setParams] = useState<ParamsLogin>({ email: "", password: "" });
  const [api, contextHolder] = notification.useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [errorLogin, setErrorLogin] = useState<string | undefined>(undefined);
  const screens = useBreakpoint();
  const router = useRouter();

  const handleSubmitForm = async () => {
    setIsLoading(true);
    const url = `/auth/email/login`;

    try {
      const res = await apiClient.post(url, params);
      const token = res.data.accessToken;
      const refreshToken = res.data.refreshToken;
      saveTokenWithExpiration(token);
      localStorage.setItem("refreshToken", refreshToken);
      router.push("/shop/overview");
      message.success("Đăng nhập thành công!");
    } catch (error: any) {
      const resMessage = error.response?.data?.message || "Có lỗi xảy ra";
      setErrorLogin(resMessage);
      api.error({ message: "Đăng nhập thất bại", description: resMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginWithFacebook = () => {
    const fbUrl = "http://localhost:8000/social/facebook";
    document.location = fbUrl;
  };

  const styles = {
    imageLogo:{
      width: "70px",
      height: "70px",
      borderRadius: "50%",
      margin: "0 auto",
      display: "block",
      marginBottom: "20px",
    },
    container: {
      background: "#f9fafb",
      margin: "0 auto",
      padding: screens.md ? "40px" : "60px 16px",
      width: "380px",
      border: "1px solid #f0f0f0",
      borderRadius: "8px",
    },
    footer: {
      marginTop: "24px",
      textAlign: "center" as "center",
      width: "100%",
    },
    forgotPassword: {
      float: "right" as "right",
    },
    header: {
      marginBottom: "40px",
    },
    section: {
      alignItems: "center",
      backgroundColor: "#fff",
      display: "flex",
      height: screens.sm ? "100vh" : "auto",
      padding: screens.md ? "64px 0" : "0px",
    },
    text: {
      color: "#8c8c8c",
    },
    title: {
      fontSize: screens.md ? "24px" : "20px",
      fontWeight: 700,
      marginTop: '24px!important',
      marginBottom: '16px',
    },
  };

  return (
    <section style={styles.section}>
      {contextHolder}
      <div style={styles.container}>
        <div style={styles.header}>
          <Image style={styles.imageLogo} src={iconLogo} alt="Favicon" />
          <Title style={styles.title}>Đăng nhập GOS ID</Title>
          <Text style={styles.text}>
            Chào mừng bạn quay lại! Vui lòng nhập thông tin đăng nhập bên dưới.
          </Text>
        </div>
        <Form
          name="normal_login"
          initialValues={{ remember: true }}
          onFinish={handleSubmitForm}
          layout="vertical"
          requiredMark="optional"
        >
          <Form.Item
            name="email"
            validateStatus={errorLogin ? "error" : undefined}
            help={errorLogin ? "Email hoặc mật khẩu không đúng!" : undefined}
            rules={[{ type: "email", required: true, message: "Email không hợp lệ!" }]}
          >
            <Input
              prefix={<MailOutlined />}
              size="large"
              placeholder="Email đăng nhập"
              onChange={(e) => setParams({ ...params, email: e.target.value })}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              size="large"
              placeholder="Mật khẩu"
              onChange={(e) => setParams({ ...params, password: e.target.value })}
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Ghi nhớ đăng nhập</Checkbox>
            </Form.Item>
            <a style={styles.forgotPassword} href="">
              Quên mật khẩu?
            </a>
          </Form.Item>
          <Form.Item>
            <Button size="large" block type="primary" htmlType="submit" loading={isLoading}>
              Đăng nhập
            </Button>
            <div style={styles.footer}>
              <Text style={styles.text}>Bạn chưa có tài khoản?</Text>{" "}
              <Link href="/sign-up">Đăng ký ngay</Link>
            </div>
          </Form.Item>
        </Form>
        <Button
          type="default"
          block
          size="large"
          onClick={handleLoginWithFacebook}
          style={{ marginTop: "16px" }}
        >
          Đăng nhập với Facebook
        </Button>
      </div>
    </section>
  );
}
