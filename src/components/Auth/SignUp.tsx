"use client";
import iconLogo from "@/assets/favicon.png";
import apiClient from "@/service/auth";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import {
  Button,
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
import Img1 from "@/assets/webcake_showcase.png";
const { Text, Title, Link } = Typography;
const { useBreakpoint } = Grid;

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export default function SignUpComponent() {
  const [form] = Form.useForm();
  const router = useRouter();
  const screens = useBreakpoint();
  const [api, contextHolder] = notification.useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Omit<RegisterForm, "confirmPassword">>({
    name: "",
    email: "",
    password: ""
  });
  const handleFieldsChange = (_: any, allFields: any) => {
    const updatedData = allFields.reduce((acc: any, field: any) => {
      if (field.name[0] !== "confirmPassword") {
        acc[field.name[0]] = field.value;
      }
      return acc;
    }, {});
    setFormData(updatedData);
  };
  const handleSubmitForm = async () => {
    setIsLoading(true);
    try {
      await apiClient.post(`/auth/email/register`, formData);
      message.success("Đăng ký thành công!");
      router.push("/login");
    } catch (error: any) {
      const resMessage = error.response?.data?.message || "Có lỗi xảy ra";
      api.error({ message: "Đăng ký thất bại", description: resMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const styles = {
    imageLogo: {
      width: "70px",
      height: "70px",
      borderRadius: "50%",
      margin: "0 auto",
      display: "block",
      marginBottom: "20px",
    },
    container: {
      background: "#f9fafb",
      padding: screens.md ? "40px" : "60px 16px",
      width: "380px",
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
      margin: "auto auto",
      justifyContent: "center",
      backgroundColor: "#314776",
      display: "flex",
      height: screens.sm ? "100vh" : "auto",
      padding: screens.md ? "30px 0" : "0px",
    },
    text: {
      color: "#8c8c8c",
    },
    title: {
      fontSize: screens.md ? "24px" : "20px",
      fontWeight: 700,
      marginTop: '24px!important',
      marginBottom: '16px',
      color: "#47566e"
    },
    titleItem: {
      fontSize: "24px",
      fontWeight: 700,
      marginBottom: "12px",
      lineHeight: "30px",
    },
    titleChild: {
      fontSize: "16px",
      fontWeight: 400,
    }
  };

  return (
    <section style={styles.section}>
      {contextHolder}
      <div className="rounded-l-lg" style={styles.container}>
        <div style={styles.header}>
          <Image style={styles.imageLogo} src={iconLogo} alt="Favicon" />
          <Title style={styles.title}>Đăng ký POS</Title>
          <Text>Hãy tạo tài khoản mới để bắt đầu sử dụng dịch vụ của chúng tôi.</Text>
        </div>
        <Form
          form={form}
          name="register"
          layout="vertical"
          onFinish={handleSubmitForm}
          onFieldsChange={handleFieldsChange} 
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
          >
            <Input size="large" prefix={<UserOutlined />} placeholder="Họ và tên" />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[{ type: "email", required: true, message: "Email không hợp lệ!" }]}
          >
            <Input size="large" prefix={<MailOutlined />} placeholder="Email đăng nhập" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password size="large" prefix={<LockOutlined />} placeholder="Mật khẩu" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu!" },
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
            <Input.Password size="large" prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Button size="large" block type="primary" htmlType="submit" loading={isLoading}>
              Đăng ký
            </Button>
          </Form.Item>

          <div style={styles.footer}>
            <Text>Bạn đã có tài khoản?</Text> <Link href="/login">Đăng nhập ngay</Link>
          </div>
        </Form>
      </div>
      <div className="w-1/2 rounded-r-lg bg-[#5578bc] text-white">
        <Image className="w-5/6 mx-auto" src={Img1} alt={""} />
        <div className="mt-3 text-center">
          <div style={styles.titleItem}>Webgos - Thiết kế dễ dàng, khởi chạy nhanh chóng</div>
          <div style={styles.titleChild}>Quản lý bán hàng toàn diện trên mạng xã hội và nền tảng thương mại điện tử</div>
        </div>
      </div>
    </section>
  );
}
