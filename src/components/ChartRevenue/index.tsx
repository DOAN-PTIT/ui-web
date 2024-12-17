import apiClient from "@/service/auth";
import { AppDispatch, RootState } from "@/store";
import { formatNumber } from "@/utils/tools";
import {
  CheckSquareOffset,
  Coins,
  Globe,
  Storefront,
} from "@phosphor-icons/react";
import { Spin } from "antd";
import {
  Chart as ChartJS,
  CategoryScale,
  Legend,
  Tooltip,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { connect } from "react-redux";

ChartJS.register(
  CategoryScale,
  Legend,
  Tooltip,
  LinearScale,
  PointElement,
  LineElement
);

interface ChartRevenueProps
  extends ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps> {}

const ChartRevenue = (props: ChartRevenueProps) => {
  const { currentShop } = props;

  const [loading, setLoading] = useState(false);
  const [boxData, setBoxData] = useState({
    counter: {
      amount: 0,
      order: 0,
    },
    online: {
      amount: 0,
      order: 0,
    },
    total: {
      amount: 0,
      order: 0,
    },
  });
  const [chartData, setChartData] = useState({
    labels: [],
    data: [],
  });

  useEffect(() => {
    getData();
  }, []);

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: "Doanh thu",
        data: chartData.data,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const getData = async () => {
    setLoading(true);
    try {
      const url = `shop/${currentShop.id}/day-chart`;
      return await apiClient
        .get(url)
        .then((res) => {
          setLoading(false);
          setBoxData(res.data.box);
          setChartData(res.data.chart);
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  };

  const renderBoxTotal = () => {
    return (
      <div className="p-3 bg-gray-100 rounded-md">
        <div className="flex items-center">
          <div>
            <Coins size={24} color="#06bcea" weight="duotone" />
          </div>
          <div className="ml-2 font-medium">Tổng tiền</div>
        </div>
        <div className="flex flex-col gap-3 mt-2">
          <p className="">
            Doanh thu: &nbsp;&nbsp;&nbsp;{" "}
            <span className="font-bold mr-4">
              {formatNumber(boxData.total.amount)} đ
            </span>
          </p>
          <p className="">
            Đơn chốt: &nbsp;&nbsp;&nbsp;{" "}
            <span className="font-bold mr-4">{boxData.total.order}</span>
          </p>
        </div>
      </div>
    );
  };

  const renderBoxOnline = () => {
    return (
      <div className="p-3 bg-gray-100 rounded-md">
        <div className="flex items-center">
          <div>
            <Globe size={24} color="#06bcea" weight="duotone" />
          </div>
          <div className="ml-2 font-medium">Online</div>
        </div>
        <div className="flex flex-col gap-3 mt-2">
          <p className="">
            Doanh thu: &nbsp;&nbsp;&nbsp;{" "}
            <span className="font-bold mr-4">
              {formatNumber(boxData.online.amount)} đ
            </span>
          </p>
          <p className="">
            Đơn chốt: &nbsp;&nbsp;&nbsp;{" "}
            <span className="font-bold mr-4">
              {formatNumber(boxData.online.order)}
            </span>
          </p>
        </div>
      </div>
    );
  };

  const renderBoxAtCounter = () => {
    return (
      <div className="p-3 bg-gray-100 rounded-md">
        <div className="flex items-center">
          <div>
            <Storefront size={24} color="#06bcea" weight="duotone" />
          </div>
          <div className="ml-2 font-medium">Bán tại quầy</div>
        </div>
        <div className="flex flex-col gap-3 mt-2">
          <p className="">
            Doanh thu: &nbsp;&nbsp;&nbsp;{" "}
            <span className="font-bold mr-4">
              {formatNumber(boxData.counter.amount)} đ
            </span>
          </p>
          <p className="">
            Đơn chốt: &nbsp;&nbsp;&nbsp;{" "}
            <span className="font-bold mr-4">
              {formatNumber(boxData.counter.order)}
            </span>
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex justify-between gap-3">
      <div className="w-2/3 p-4 rounded-md bg-white">
        {loading ? (
          <div className="flex w-full h-full items-center justify-center">
            <Spin />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-3 mb-3">
              {renderBoxTotal()}
              {renderBoxOnline()}
              {renderBoxAtCounter()}
            </div>
            <Line
              data={data}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
              }}
            />
          </>
        )}
      </div>
      <div className="w-1/3 bg-white p-4 rounded-md">
        <div className="text-[18px] font-bold">
          Thông tin kinh doanh hôm nay
        </div>
        <div>
          <div className="flex justify-between mt-4">
            <div>Doanh thu</div>
            <div className="font-bold">0đ</div>
          </div>
          <div className="flex justify-between mt-4">
            <div>Đơn chốt</div>
            <div className="font-bold">0</div>
          </div>
        </div>
        <Line data={data} />
        <div className="flex justify-between mt-3">
          {renderBoxOnline()}
          {renderBoxAtCounter()}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    currentShop: state.shopReducer.shop,
  };
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ChartRevenue);
