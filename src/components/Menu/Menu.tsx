"use client";

import React from "react";
import { Layout, Menu as AntdMenu } from "antd";
import {
  AppstoreOutlined,
  BarChartOutlined,
  CloudOutlined,
  ShopOutlined,
  TeamOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";

const { Sider } = Layout;
const shopId = null;
function Menu() {
  const items: MenuProps["items"] = [
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined,
    BarChartOutlined,
    CloudOutlined,
    AppstoreOutlined,
    TeamOutlined,
    ShopOutlined,
  ].map((icon, index) => ({
    key: String(index + 1),
    icon: React.createElement(icon),
    label: `nav ${index + 1}`,
  }));

  return (
    <Sider className="h-screen overflow-auto fixed bottom-0 top-0">
      <AntdMenu
        items={shopId ? items : []}
        theme="dark"
        mode="inline"
        expandIcon={<div>Aloo</div>}
      />
    </Sider>
  );
}

export default Menu;
