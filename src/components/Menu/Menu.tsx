"use client";

import React from "react";
import { Layout, Menu as AntdMenu, Avatar, Divider } from "antd";
import {
  ReconciliationOutlined,
  AuditOutlined,
  SettingOutlined,
  PieChartOutlined,
  LeftCircleOutlined,
  UserOutlined,
  ContainerOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useParams, usePathname, useRouter } from "next/navigation";

const { Sider } = Layout;
const listItem = [
  {
    key: "dashbroad",
    label: "Tổng quan",
    icon: <PieChartOutlined />,
  },
  {
    key: "sale",
    label: "Bán hàng",
    icon: <ShoppingCartOutlined />,
  },
  {
    key: "order",
    label: "Hóa đơn",
    icon: <ReconciliationOutlined />,
  },
  {
    key: "customer",
    label: "Khách hàng",
    icon: <AuditOutlined />,
  },
  {
    key: "product",
    label: "Sản phẩm",
    icon: <ContainerOutlined />,
  },
  {
    key: "settings",
    label: "Cấu hình",
    icon: <SettingOutlined />,
  },
  {
    key: "home",
    label: "Quay lại",
    icon: <LeftCircleOutlined />,
  },
];
function Menu() {
  const route = useRouter();
  const params = useParams();
  const pathName = usePathname().split("/");

  const items: MenuProps["items"] = listItem.map((item) => ({
    key: item.key,
    label: item.label,
    icon: item.icon,
    onClick: () => {
      return item.key === "home"
        ? route.push("/shop/overview")
        : route.push(`/shop/${params.id[0]}/${item.key}`);
    },
  }));

  return (
    <Sider className="h-screen overflow-auto fixed bottom-0 top-0">
      {params.id && (
        <div className="flex items-center gap-3 flex-col mt-5">
          <Avatar icon={<UserOutlined />} size={64} />
          <h1 className="text-white text-xl font-bold">Shop test</h1>
        </div>
      )}
      <Divider />
      <AntdMenu
        defaultOpenKeys={['dashbroad']}
        defaultSelectedKeys={['dashbroad']}
        selectedKeys={[pathName[3]]}
        items={params.id ? items : []}
        theme="dark"
        mode="inline"
      />
    </Sider>
  );
}

export default Menu;
