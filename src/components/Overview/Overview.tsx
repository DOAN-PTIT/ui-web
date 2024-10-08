"use client";

import {
  UserOutlined,
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  LoginOutlined,
  SyncOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Card, Dropdown, Layout, Space, Tooltip } from "antd";
import type { MenuProps } from "antd";
import { useRouter } from "next/navigation";

const { Header, Content } = Layout;
const shops = [
  {
    id: 1,
    name: "Shop 1",
    description: "Shop 1 description",
  },
  {
    id: 2,
    name: "Shop 1",
    description: "Shop 1 description",
  },
];
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
function Overview() {
    const route = useRouter()
    const handleClickAccess = (shopId: number) => {
        route.push(`/shop/${shopId}`)
    }

  return (
    <Layout className="w-full min-h-screen">
      <Header className="flex justify-between items-center bg-slate-200">
        <div className="text-lg font-bold">Danh sach cua hang</div>
        <Dropdown menu={{ items }}>
          <Avatar className="cursor-pointer" icon={<UserOutlined />} />
        </Dropdown>
      </Header>
      <Content className="p-8">
        <Space className="w-full justify-end" align="center">
          <Button type="primary" icon={<SyncOutlined />}>
            Tai lai
          </Button>
          <Button type="primary" icon={<PlusCircleOutlined />}>
            Them cua hang
          </Button>
        </Space>
        <Space className="gap-10 mt-10 justify-center w-full">
          {shops.map((shop) => {
            return (
              <Card
                key={shop.id}
                className="w-[300px] min-h-[250px]"
                title={
                  <div className="p-5 text-center">
                    <Avatar icon={<UserOutlined />} size={80} />
                    <h1 className="mt-4">{shop.name}</h1>
                  </div>
                }
                actions={[
                  <Tooltip key="edit" title="Cap nhat cua hang">
                    <EditOutlined />
                  </Tooltip>,
                  <Tooltip key="delete" title="Xoa cua hang">
                    <DeleteOutlined />
                  </Tooltip>,
                  <Tooltip key="leave" title="Roi khoi cua hang">
                    <LoginOutlined />
                  </Tooltip>,
                ]}
              >
                <div className="text-center">
                  <p className="opacity-80 mb-4">{shop.description}</p>
                  <Button onClick={() => handleClickAccess(shop.id)} icon={<LoginOutlined />}>Truy cap</Button>
                </div>
              </Card>
            );
          })}
        </Space>
      </Content>
    </Layout>
  );
}

export default Overview;
