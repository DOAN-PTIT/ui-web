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
import { AppDispatch, RootState } from "@/store";
import { connect } from "react-redux";

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

interface MenuComponentProps extends ReturnType<typeof mapStateToProps>, ReturnType<typeof mapDispatchToProps> {}

function Menu(props: MenuComponentProps) {
    const { currentShop } = props;

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
    <Sider className="h-screen bg-[#f2f4f7] overflow-auto fixed bottom-0 top-0">
      {params.id && (
        <div className="flex items-center  gap-3 flex-col mt-5">
          <Avatar icon={<UserOutlined />} size={64} />
          <h1 className="text-[#101828] text-xl font-bold">{currentShop.name || "Chưa có tên"}</h1>
        </div>
      )}
      <Divider />
      <AntdMenu
        className="bg-[#f2f4f7] text-[#101828]"
        defaultOpenKeys={['dashbroad']}
        defaultSelectedKeys={['dashbroad']}
        selectedKeys={[pathName[3]]}
        items={params.id ? items : []}
        theme="light"
        mode="inline"
      />
    </Sider>
  );
}

const mapStateToProps = (state: RootState) => {
  return {
    currentShop: state.shopReducer.shop
  }
}

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
