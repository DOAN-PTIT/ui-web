"use client"
import {
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Dropdown, Input, Layout, Menu } from "antd";
import type { MenuProps } from "antd";
import { useRouter } from "next/navigation";

interface HeaderActionProps {
  title: string;
  isShowSearch: boolean;
  inputPlaholder?: string;
}

function HeaderAction(props: HeaderActionProps) {
  const { isShowSearch, title, inputPlaholder } = props;
  const router = useRouter();
  // Define the list items with onClick actions
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <div className="flex items-center justify-between">
          <SettingOutlined />
          <p className="ml-3">Thiết lập tài khoản</p>
        </div>
      ),
      onClick: () => router.push(`/setting-account`), // Navigate on click
    },
    {
      key: "2",
      label: (
        <div className="flex items-center justify-between">
          <LogoutOutlined />
          <p className="ml-3">Đăng xuất</p>
        </div>
      ),
      onClick: () => console.log("Logging out"), // Handle logout logic
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
