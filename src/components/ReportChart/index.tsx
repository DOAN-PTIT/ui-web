import { AppDispatch, RootState } from "@/store";
import { DisplayChart } from "@/utils/type";
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
import { Divider } from "antd";

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
  displayChart: DisplayChart;
  title: string;
}

const ReportChart = (props: ReportChartProps) => {
  const { displayChart, title } = props;

  const columnsByMonth = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];

  const columnsByYear = Array.from({ length: 10 }, (_, i) =>
    (new Date().getFullYear() - i).toString()
  );

  return (
    <div className="w-full bg-white p-6 rounded-lg h-[700px] mt-4">
      <div className="font-[600] text-[16px]">{title}</div>
      <div className="w-full border border-dashed my-3"></div>
        <Bar
          data={{
            labels: displayChart === "month" ? columnsByMonth : columnsByYear,
            datasets: [
              {
                data: [65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56],
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
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  return {};
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ReportChart);
