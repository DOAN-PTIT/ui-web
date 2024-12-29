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

interface ReportRevenueProps
  extends ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps> {}

function ReportRevenue(props: ReportRevenueProps) {
  const { currentShop, year, month, getRevenueReport } = props;
  const [displayChart, setDisplayChart] = useState<DisplayChart>("month");
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
      align: "right",
      fixed: "left",
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Đơn chốt",
      dataIndex: "order",
      key: "order",
      align: "right",
      render: (text) => (
        <span className="font-medium">{formatNumber(text)}</span>
      ),
      sorter: (a, b) => a.order - b.order,
      showSorterTooltip: false,
    },
    {
      title: "Đơn hủy",
      dataIndex: "cancel",
      key: "cancel",
      align: "right",
      render: (text) => (
        <span className="font-medium">{formatNumber(text)}</span>
      ),
      showSorterTooltip: false,
      sorter: (a, b) => a.cancel - b.cancel,
    },
    {
      title: "Chiết khấu",
      dataIndex: "discount",
      key: "discount",
      align: "right",
      render: (text) => (
        <span className="font-medium">{formatNumber(text)} đ</span>
      ),
      sorter: (a, b) => a.discount - b.discount,
      showSorterTooltip: false,
    },
    {
      title: "Phí vận chuyển",
      dataIndex: "shipping_fee",
      key: "shipping_fee",
      align: "right",
      render: (text) => (
        <span className="font-medium">{formatNumber(text)} đ</span>
      ),
      sorter: (a, b) => a.shipping_fee - b.shipping_fee,
      showSorterTooltip: false,
    },
    {
      title: "Phí vận chuyển ĐVVC",
      dataIndex: "partner_shipping_fee",
      key: "partner_shipping_fee",
      align: "right",
      render: (text) => (
        <span className="font-medium">{formatNumber(text)} đ</span>
      ),
      sorter: (a, b) => a.partner_shipping_fee - b.partner_shipping_fee,
      showSorterTooltip: false,
    },
    {
      title: "Doanh số",
      dataIndex: "sales",
      key: "sales",
      align: "right",
      render: (text) => (
        <span className="font-medium">{formatNumber(text)} đ</span>
      ),
      sorter: (a, b) => a.sales - b.sales,
      showSorterTooltip: false,
    },
    {
      title: "Doanh thu",
      dataIndex: "revenue",
      key: "revenue",
      align: "right",
      render: (text) => (
        <span className="font-medium">{formatNumber(text)} đ</span>
      ),
      sorter: (a, b) => a.revenue - b.revenue,
      showSorterTooltip: false,
    },
    {
      title: "Lợi nhuận",
      dataIndex: "profit",
      key: "profit",
      align: "right",
      render: (text) => (
        <span className="font-medium">{formatNumber(text)} đ</span>
      ),
      sorter: (a, b) => a.profit - b.profit,
      showSorterTooltip: false,
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
            discount: item.total_discount,
            revenue: item.revenue,
            shipping_fee: item.delivery_cost_shop,
            partner_shipping_fee: item.delivery_cost,
            sales: item.sales,
            profit: item.total_profit,
          };
        })
      : [];
  };

  return (
    <Layout className="w-full min-h-screen">
      <HeaderAction title="Báo cáo Doanh thu" isShowSearch={false} />
      <Content className="content bg-gray-200 rounded-tl-xl p-5 order__table__container">
        <ReportAction />
        <ReportChart
          title="Doanh thu (đ)"
          loading={loading}
          datasets={getDatasets().datasets}
          columns={getDatasets().columns}
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
    currentShop: state.shopReducer.shop,
    year: state.reportReducer.year,
    month: state.reportReducer.month,
  };
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
    getRevenueReport: (params: any) => dispatch(getRevenueReport(params)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ReportRevenue);
