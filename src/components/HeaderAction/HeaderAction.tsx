import {
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Dropdown, Input, Layout } from "antd";
import type { MenuProps } from "antd";


const listItem = [
  {
    key: "1",
    title: "Cai dat tai khoan",
    icon: <SettingOutlined />,
  },
  {
    key: "2",
    title: "Dang xuat",
    icon: <LogoutOutlined />,
  },
];
const items: MenuProps["items"] = listItem.map((item) => ({
  key: item.key,
  label: (
    <div className="flex items-center justify-between">
      {item.icon}
      <p className="ml-3">{item.title}</p>
    </div>
  ),
}));
interface HeaderActionProps {
title: string,
  isShowSearch: boolean;
  inputPlaholder?: string
}

function HeaderAction(props: HeaderActionProps) {
  const { isShowSearch, title, inputPlaholder } = props;
  return (
    <Layout.Header className="flex bg-slate-100 justify-between items-center">
      <div className="flex items-center w-1/2">
        <p className="w-1/3 text-xl font-bold">{title}</p>
        {isShowSearch && <Input placeholder={inputPlaholder} />}
      </div>
      <Dropdown menu={{ items }}>
        <Avatar className="cursor-pointer" icon={<UserOutlined />} />
      </Dropdown>
    </Layout.Header>
  );
}

export default HeaderAction;
