"use client";
import { getHostName } from "@/utils/tools";
import {
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Dropdown, Input, Layout, Menu } from "antd";
import type { MenuProps } from "antd";
import axios from "axios";
import { useRouter } from "next/navigation";

interface HeaderActionProps {
  title: string;
  isShowSearch: boolean;
  inputPlaholder?: string;
}

function HeaderAction(props: HeaderActionProps) {
  const { isShowSearch, title, inputPlaholder } = props;
  const router = useRouter();

  async function logout(): Promise<void> {
    try {
      const accessToken = localStorage.getItem('token');
      if (!accessToken) {
        console.log('Người dùng chưa đăng nhập.');
        return;
      }
      // console.log('URL API:', `${getHostName}/auth/logout`);
      const response = await axios.post(`${getHostName()}/auth/logout`,{}, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        localStorage.removeItem('token');
        console.log('Đăng xuất thành công.');
        router.push('/login');
      } else {
        console.error('Đăng xuất thất bại:', response.statusText);
      }
    } catch (error: any) {
      console.error('Lỗi khi gọi API đăng xuất:', error.response?.data || error.message);
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
    <Layout.Header className="flex items-center justify-between px-0 h-12 bg-slate-100">
      <div className="flex items-center w-1/2">
        <div className="w-1/3 text-xl font-bold">{title}</div>
        {isShowSearch && <Input placeholder={inputPlaholder} />}
      </div>

      <Dropdown overlay={<Menu items={items} />} trigger={['click']}>
        <Avatar className="cursor-pointer" icon={<UserOutlined />} />
      </Dropdown>
    </Layout.Header>
  );
}

export default HeaderAction;
