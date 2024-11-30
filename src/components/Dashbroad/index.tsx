"use client";

import { Button, DatePicker, Layout } from "antd";
import HeaderAction from "../HeaderAction/HeaderAction";
import ChartOrder from "../ChartOrder";
import ChartRevenue from "../ChartRevenue";
import ChartProduct from "../ChartProduct";
import ChartShopUser from "../ChartShopUser";
import { ReloadOutlined } from "@ant-design/icons";

const { Content } = Layout;

function Dashbroad() {
  const renderHeader = () => {
    return (
      <div className="mb-4 flex justify-between">
        <div>
          <span className="font-medium">Khoảng thời gian</span>
          <DatePicker.RangePicker className="ml-3" format="DD/MM/YYYY" />
        </div>
        <div>
          <Button icon={<ReloadOutlined />}>Tải lại</Button>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <HeaderAction title="Tổng quan" isShowSearch={false} />
      <Content className="p-5 bg-gray-200 rounded-tl-xl min-h-screen flex flex-col gap-4">
        {renderHeader()}
        <ChartOrder />
        <ChartRevenue />
        <div className="flex gap-3 w-full">
          <ChartProduct />
          <ChartShopUser />
        </div>
      </Content>
    </Layout>
  );
}

export default Dashbroad;
