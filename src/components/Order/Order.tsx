"use client";

import { Layout, Table } from "antd";
import ActionTools from "../ActionTools/ActionTools";
import HeaderAction from "../HeaderAction/HeaderAction";

const { Content } = Layout;
function Order() {
  return (
    <Layout>
      <HeaderAction
        title="Don hang"
        isShowSearch={true}
        inputPlaholder="Tim kien don hang"
      />
      <Content className="p-5 h-screen">
        <ActionTools />
        <Table></Table>
      </Content>
    </Layout>
  );
}

export default Order;
