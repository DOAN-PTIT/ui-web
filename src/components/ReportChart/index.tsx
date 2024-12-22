import { AppDispatch, RootState } from "@/store";
import { DisplayChart, Revenue } from "@/utils/type";
import { connect } from "react-redux";
import {
  Chart as ChartJS,
  CategoryScale,
  Legend,
  Tooltip,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { Divider, Spin } from "antd";
import { getRevenueReport } from "@/action/report.action";
import { useEffect, useState } from "react";

ChartJS.register(
  CategoryScale,
  Legend,
  Tooltip,
  LinearScale,
  PointElement,
  LineElement,
  BarElement
);

interface ReportChartProps
  extends ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps> {
  title: string;
  datasets: any[];
  columns: string[];
  loading: boolean;
}

const ReportChart = (props: ReportChartProps) => {
  const {
    title,
    datasets,
    columns,
    loading,
  } = props;

  return (
    <div className="w-full bg-white p-6 rounded-lg h-[700px] mt-4">
      <div className="font-[600] text-[16px]">{title}</div>
      <div className="w-full border border-dashed my-3"></div>
      {loading ? (
        <div className="h-full font-medium text-lg flex items-center justify-center w-full">
          <p>
            Chờ chút bạn nhé... <Spin />
          </p>
        </div>
      ) : (
        <Bar
          data={{
            labels: columns,
            datasets: [
              {
                data: loading ? [] : datasets[0]?.data,
                borderColor: "rgb(75, 192, 192)",
                backgroundColor: "rgb(75, 192, 192)",
                label: "Doanh thu",
              },
            ],
          }}
          options={{
            scales: {
              y: {
                beginAtZero: true,
              },
            },
            plugins: {
              legend: {
                display: false,
              },
            },
          }}
        />
      )}
    </div>
  );
};

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

export default connect(mapStateToProps, mapDispatchToProps)(ReportChart);
