import { AppDispatch, RootState } from "@/store";
import { Layout } from "antd";
import { connect } from "react-redux";
import HeaderAction from "../HeaderAction/HeaderAction";
import ReportAction from "../ReportAction";
import { useState } from "react";
import { DisplayChart } from "@/utils/type";
import ReportChart from "../ReportChart";
import ReportTable from "../ReportTable";

const { Content } = Layout;
interface ReportOrderProps
  extends ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps> {
}

function ReportOrder(props: ReportOrderProps) {
    const [displayChart, setDisplayChart] = useState<DisplayChart>("month");

  const handleSelectedChart = (value: DisplayChart) => {
    setDisplayChart(value);
  };

  const columns = [
    {
        title: "Ngày",
        dataIndex: "date",
        key: "date",
    },
    {
        title: "Đơn chốt",
        dataIndex: "order",
        key: "order",
    },
    {
        title: "Đơn hủy",
        dataIndex: "cancel",
        key: "cancel",
    },
    {
        title: "Tỉ lệ chốt",
        dataIndex: "orderRate",
        key: "orderRate",
    },
    {
        title: "Tỉ lệ hủy",
        dataIndex: "cancelRate",
        key: "cancelRate",
    },
    {
        title: "Doanh số",
        dataIndex: "revenue",
        key: "revenue",
    },
    {
        title: "Doanh thu",
        dataIndex: "profit",
        key: "profit",
    }
  ]
  return (
    <Layout className="w-full min-h-screen">
      <HeaderAction title="Báo cáo Đơn hàng" isShowSearch={false} />
      <Content className="content bg-gray-200 rounded-tl-xl p-5 order__table__container">
        <ReportAction
          setDisplayChart={setDisplayChart}
          displayChart={displayChart}
          handleSelectedChart={handleSelectedChart}
        />
        <ReportChart displayChart={displayChart} title="Đơn hàng" />
        <ReportTable columns={columns} />
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

export default connect(mapStateToProps, mapDispatchToProps)(ReportOrder);
