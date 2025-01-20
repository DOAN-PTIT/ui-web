import { AppDispatch, RootState } from "@/store";
import { Layout } from "antd";
import type { TableProps } from "antd";
import { connect } from "react-redux";
import HeaderAction from "../HeaderAction/HeaderAction";
import ReportAction from "../ReportAction";
import { useEffect, useState } from "react";
import { DisplayChart, Revenue } from "@/utils/type";
import ReportChart from "../ReportChart";
import ReportTable from "../ReportTable";
import { getRevenueReport } from "@/action/report.action";
import { formatNumber } from "@/utils/tools";

const { Content } = Layout;
interface ReportOrderProps
  extends ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps> {}

function ReportOrder(props: ReportOrderProps) {
  const { currentShop, year, month, getRevenueReport } = props;

  const [data, setData] = useState<Revenue[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRevenue();
  }, [year, month]);

  const columns: TableProps<any>["columns"] = [
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      fixed: "left",
      align: "right",
      className: "bg-gray-200",
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Đơn chốt",
      dataIndex: "order",
      key: "order",
      align: "right",
      sorter: (a, b) => a.order - b.order,
      showSorterTooltip: false,
      render: (text) => (
        <span className="font-medium">{formatNumber(text)}</span>
      ),
    },
    {
      title: "Đơn hủy",
      dataIndex: "cancel",
      key: "cancel",
      align: "right",
      showSorterTooltip: false,
      sorter: (a, b) => a.cancel - b.cancel,
      render: (text) => (
        <span className="font-medium">{formatNumber(text)}</span>
      ),
    },
    {
      title: "Tỉ lệ chốt",
      dataIndex: "orderRate",
      key: "orderRate",
      align: "right",
      render: (text) => {
        console.log(text);
        const rate = text.total_orders ? (parseInt(text.received_orders) / parseInt(text.total_orders)) * 100 : 0
        return (
          <div>
            <span className="font-medium">
              {rate > 0 ? rate.toFixed(2) : 0}%
            </span>
          </div>
        );
      }
    },
    {
      title: "Tỉ lệ hủy",
      dataIndex: "cancelRate",
      key: "cancelRate",
      align: "right",
      showSorterTooltip: false,
      render: (text) => {
        const rate = text.total_orders ? (parseInt(text.returned_orders) / parseInt(text.total_orders)) * 100 : 0
        return (
          <div>
            <span className="font-medium">
              {rate > 0 ? rate.toFixed(2) : 0}%
            </span>
          </div>
        );
      }
    },
    {
      title: "Doanh số",
      dataIndex: "revenue",
      key: "revenue",
      align: "right",
      showSorterTooltip: false,
      sorter: (a, b) => a.revenue - b.revenue,
      render: (text) => (
        <span className="font-medium">{formatNumber(text)} đ</span>
      ),
    },
    {
      title: "Doanh thu",
      dataIndex: "profit",
      key: "profit",
      align: "right",
      showSorterTooltip: false,
      render: (text) => (
        <span className="font-medium">{formatNumber(text)} đ</span>
      ),
      sorter: (a, b) => a.profit - b.profit,
    },
  ];

  const fetchRevenue = async () => {
    const params = { shop_id: currentShop.id, year, month };

    setLoading(true);
    await getRevenueReport(params)
      .then((res) => {
        if (res.payload) {
          setData(res.payload);
        }
        setLoading(false);
      })
      .then((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const getDatasets = () => {
    let columns: any[] = [];
    let datasets: any[] = [];

    if (data.length > 0) {
      data.forEach((item) => {
        columns.push(item.period);
      });

      datasets.push({
        data: data.map((item) => parseInt(item.revenue as string)),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgb(75, 192, 192)",
        label: "Doanh thu",
      });
    }

    return { columns, datasets };
  };

  const getDataSource = () => {
    return data.length > 0
      ? data.map((item) => {
          return {
            date: item.period,
            order: item.received_orders,
            cancel: item.returned_orders,
            orderRate: {
              total_orders: item.total_orders,
              received_orders: item.received_orders,
            },
            cancelRate: {
              total_orders: item.total_orders,
              returned_orders: item.returned_orders,
            },
            revenue: item.sales,
            profit: item.revenue,
          };
        })
      : [];
  };
  return (
    <Layout className="w-full min-h-screen">
      <HeaderAction title="Báo cáo Đơn hàng" isShowSearch={false} />
      <Content className="content bg-gray-200 rounded-tl-xl p-5 order__table__container">
        <ReportAction />
        <ReportChart
          title="Đơn hàng"
          datasets={getDatasets().datasets}
          columns={getDatasets().columns}
          loading={loading}
        />
        <ReportTable
          columns={columns}
          dataSource={getDataSource()}
          loading={loading}
        />
      </Content>
    </Layout>
  );
}

const mapStateToProps = (state: RootState) => {
  return {
    year: state.reportReducer.year,
    month: state.reportReducer.month,
    currentShop: state.shopReducer.shop,
  };
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
    getRevenueReport: (params: any) => dispatch(getRevenueReport(params)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ReportOrder);
