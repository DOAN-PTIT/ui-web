'use client'

import { Layout, Table } from "antd";
import HeaderAction from "../HeaderAction/HeaderAction";
import ActionTools from "../ActionTools/ActionTools";

function Customer() {
  return (
    <Layout>
      <HeaderAction
        title="Khach hang"
        isShowSearch={true}
        inputPlaholder="Tim kiem khach hang"
      />
      <Layout.Content className="p-5 h-screen">
        <ActionTools />
        <Table></Table>
      </Layout.Content>
    </Layout>
  );
}

export default Customer;
