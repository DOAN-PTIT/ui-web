"use client";

import { AppDispatch, RootState } from "@/store";
import {
  AuditOutlined,
  ContainerOutlined,
  AppstoreOutlined,
  PieChartOutlined,
  ReconciliationOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu as AntdMenu, Avatar, Layout } from "antd";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { connect } from "react-redux";

const { Sider } = Layout;

const backItem = {
  key: "home",
  label: "Bảng điểu khiển",
  icon: <AppstoreOutlined />
}

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
  }
];

interface MenuComponentProps
  extends ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps> {}

function Menu(props: MenuComponentProps) {
  const { currentShop } = props;
  const [collapsed, setCollapsed] = useState(false);
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
    <Sider
      collapsible
      collapsedWidth={60}
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      className="custom-sider min-h-fit bg-[#f2f4f7] bottom-0 top-0 h-full"
    >
      <div className="flex flex-col justify-between h-full">
        <div>
          {params.id && (
            <div className="flex items-center  gap-3 flex-col mt-3 mb-2">
              <Avatar
                src={currentShop.avatar}
                icon={<UserOutlined />}
                size={collapsed ? 24 : 64}
              />
              {!collapsed && (
                <h1 className="text-[#101828] text-sm font-medium">
                  {currentShop.name || "Chưa có tên"}
                </h1>
              )}
            </div>
          )}
          <AntdMenu
            className="bg-[#f2f4f7] text-[#101828] !border-none justify-center "
            defaultOpenKeys={["dashbroad"]}
            defaultSelectedKeys={["dashbroad"]}
            selectedKeys={[pathName[3]]}
            items={params.id ? items : []}
            theme="light"
            mode="inline"
          />
        </div>
        <div>
          <AntdMenu
            className="bg-[#f2f4f7] text-[#101828] !border-none justify-center"
            defaultOpenKeys={["dashbroad"]}
            defaultSelectedKeys={["dashbroad"]}
            selectedKeys={["settings"]}
            items={[backItem]}
            onClick={() => route.push("/shop/overview")}
            theme="light"
            mode="inline"
          />
        </div>
      </div>
    </Sider>
  );
}

const mapStateToProps = (state: RootState) => {
  return {
    currentShop: state.shopReducer.shop,
  };
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
