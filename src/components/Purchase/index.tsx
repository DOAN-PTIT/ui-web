import { AppDispatch, RootState } from "@/store";
import { Layout, Table } from "antd";
import type { TableProps } from "antd";
import { connect } from "react-redux";
import HeaderAction from "../HeaderAction/HeaderAction";
import { useState } from "react";
import "../../styles/global.css";
import apiClient from "@/service/auth";
import ActionTools from "../ActionTools/ActionTools";
import DebtDetail from "../DebtDetail";
import PurchaseDetail from "../PurchaseDetail";

const { Content } = Layout;

interface PurchaseProps
  extends ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps> {}

function Purchase(props: PurchaseProps) {
  const [modalVisiable, setModalVisiable] = useState(false);
  const [title, setTitle] = useState("Tạo phiếu nhập hàng");

  const columns: TableProps<any>["columns"] = [
    {
        title: "Người tạo",
        key: "creator",
        dataIndex: "creator"
    },
    {
        title: "Nhà cung cấp",
        key: "supplier",
        dataIndex: "supplier"
    },
    {
        title: "Tiền hàng",
        key: "total_price_product",
        dataIndex: "total_price_product"
    },
    {
        title: "Phí vận chuyển",
        key: "shipping_fee",
        dataIndex: "shipping_fee"
    },
    {
        title: "Chiết khấu",
        key: "discount",
        dataIndex: "discount"
    },
    {
        title: "Tổng tiền",
        key: "total_price",
        dataIndex: "total_price"
    },
    {
        title: "Ngày tạo",
        key: "created_at",
        dataIndex: "created_at"
    },
    {
        title: "Mô tả",
        key: "description",
        dataIndex: "description"
    }
  ];

  const getListDebts = async () => {
    try {
      const url = "/supplier";
      return await apiClient.get(url);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <HeaderAction title="Nhập hàng" isShowSearch={true} inputPlaholder="Tìm kiếm công nợ theo têh, loại công nợ, nhà cung cấp,.." />
      <Content className="p-5 h-screen bg-gray-200 rounded-tl-xl order__table__container">
        <ActionTools
          callBack={() => setModalVisiable(true)}
          reloadCallBack={getListDebts}
        />
        <Table
          columns={columns}
          dataSource={[]}
          pagination={{ size: "small" }}
          scroll={{ y: 500 }}
        />
        {modalVisiable && <PurchaseDetail open={true} setOpen={setModalVisiable} title={title} />}
      </Content>
    </Layout>
  );
}

const mapStateToProps = (state: RootState) => {
  return {};
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Purchase);
