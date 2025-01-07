"use client";
import { RootState } from "@/store";
import {
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Avatar, Dropdown, Input, Layout, Menu, message } from "antd";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { connect } from "react-redux";

interface HeaderActionProps  extends ReturnType<typeof mapStateToProps> {
  title: string;
  isShowSearch: boolean;
  inputPlaholder?: string;
  handleSearch?: (value: string) => any;
}

function HeaderAction(props: HeaderActionProps) {
  const { isShowSearch, title, inputPlaholder, handleSearch, currentUser } = props;
  const router = useRouter();
  const [loading, setLoading] = useState(false)

  async function logout() {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.log('Người dùng chưa đăng nhập.');
        return;
      }
      const expirationTime = localStorage.getItem('tokenExpiration');
      if (expirationTime && Date.now() >= parseInt(expirationTime)) {
        console.log("Token đã hết hạn, không thể đăng xuất.");
        localStorage.removeItem('accessToken');
        localStorage.removeItem('tokenExpiration');
        router.push('/login');
        return;
      }
      const response = await axios.post(`http://localhost:8000/auth/logout`);

      if (response.status === 200) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('tokenExpiration');
        console.log('Đăng xuất thành công.');
        router.push('/login');
      } else {
        console.error('Đăng xuất thất bại:', response.statusText);
      }

    }
    catch (error: any) {
      console.error('Lỗi khi gọi API đăng xuất:', error.response?.data || error.message);
    }
    finally {
      message.success('Đăng xuất thành công');
    }
  }


  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <div className="flex items-center justify-between">
          <SettingOutlined />
          <p className="ml-3">Thiết lập tài khoản</p>
        </div>
      ),
      onClick: () => router.push(`/setting-account`),
    },
    {
      key: "2",
      label: (
        <div className="flex items-center justify-between">
          <LogoutOutlined />
          <p className="ml-3">Đăng xuất</p>
        </div>
      ),
      onClick: () => logout(),
    },
  ];

  return (
    
      <Layout.Header className="flex items-center justify-between px-2 h-12 bg-slate-100">
        <div className="flex items-center w-1/2">
          <div className="w-1/3 text-xl font-bold">{title}</div>
          {isShowSearch && (
            <Input
              placeholder={inputPlaholder}
              onChange={(e) => handleSearch?.(e.target.value)}
            />
          )}
        </div>

        <Dropdown overlay={<Menu items={items} />} trigger={['click']}>
        <Avatar className="cursor-pointer mr-2" icon={<UserOutlined />} src={currentUser.avatar ? currentUser.avatar : null} />
        </Dropdown>
      </Layout.Header>

  );
}

const mapStateToProps = (state: RootState) => {
  return {
    currentUser: state.userReducer.user,
  };
}

export default connect(mapStateToProps, {})(HeaderAction);
