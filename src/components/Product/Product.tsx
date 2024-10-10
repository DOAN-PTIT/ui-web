"use client";

import { Layout, Table } from "antd";
import HeaderAction from "../HeaderAction/HeaderAction";
import ActionTools from "../ActionTools/ActionTools";

function Product() {
  return (
    <Layout>
      <HeaderAction
        title="San pham"
        isShowSearch={true}
        inputPlaholder="Tim kiem san pham"
      />
      <Layout.Content className="p-5 h-screen">
        <ActionTools />
        <Table></Table>
      </Layout.Content>
    </Layout>
  );
}

export default Product;
