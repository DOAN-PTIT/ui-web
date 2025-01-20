import apiClient from "@/service/auth";
import { AppDispatch, RootState } from "@/store";
import { formatNumber } from "@/utils/tools";
import {
  CalendarX,
  CheckSquareOffset,
  Coins,
  Globe,
  IdentificationCard,
  ListNumbers,
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
import { Fragment, useEffect, useState } from "react";
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
  const [todayData, setTodayData] = useState({
    canceledOrdersCount: 0,
    newCustomersCount: 0,
    newOrdersCount: 0,
    totalOrdersAtCounter: 0,
    totalOrdersOnline: 0,
    totalQuantitySold: 0,
    totalRevenueAtCounter: 0,
    totalRevenueOnline: 0,
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

  const getLast7DaysData = async () => {
    try {
      const url = `shop/${currentShop.id}/day-chart`;
      return await apiClient
        .get(url)
        .then((res) => {
          setBoxData(res.data.box);
          setChartData(res.data.chart);
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  };

  const getTodayData = async () => {
    try {
      const url = `shop/${currentShop.id}/today-stats`;
      return await apiClient
        .get(url)
        .then((res) => {
          setTodayData(res.data);
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  };

  const getData = async () => {
    setLoading(true);
    return await Promise.all([getLast7DaysData(), getTodayData()])
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
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

  const renderBoxToday = (
    title: any,
    counterAmount: any,
    counterOrder = 0,
    showCountOrder: boolean = false,
    icon: any,
    showRevenue: boolean
  ) => {
    return (
      <div className="p-3 bg-gray-100 rounded-md">
        <div className="flex items-center">
          <div>{icon}</div>
          <div className="ml-2 font-medium">{title}</div>
        </div>
        <div className="flex flex-col gap-3 mt-2">
          <p className="">
            {showRevenue ? (
              <Fragment>
                Doanh thu: &nbsp;&nbsp;&nbsp;{" "}
                <span className="font-bold mr-4">
                  {formatNumber(counterAmount)} đ
                </span>
              </Fragment>
            ) : (
              <p className="font-[600]">{counterAmount}</p>
            )}
          </p>
          {showCountOrder && (
            <p className="">
              Đơn chốt: &nbsp;&nbsp;&nbsp;{" "}
              <span className="font-bold mr-4">
                {formatNumber(counterOrder)}
              </span>
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex justify-between">
      <div className="w-2/3 p-4 rounded-md bg-white">
        {loading ? (
          <div className="flex w-full h-full items-center justify-center">
            <Spin />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-3 mb-3">
              {renderBoxTotal()}
              {renderBoxToday(
                "Online",
                boxData.online.amount,
                boxData.online.order,
                true,
                <Globe size={24} color="#06bcea" weight="duotone" />,
                true
              )}
              {renderBoxToday(
                "Bán tại quầy",
                boxData.counter.amount,
                boxData.counter.order,
                true,
                <Storefront size={24} color="#06bcea" weight="duotone" />,
                true
              )}
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
      <div className="w-1/3 bg-white p-4 rounded-md ml-3">
        {loading ? (
          <>
            <div className="flex w-full h-full items-center justify-center">
              <Spin />
            </div>
          </>
        ) : (
          <>
            <div className="text-[18px] font-bold">
              Thông tin kinh doanh hôm nay
            </div>
            <div className="mb-4">
              <div className="flex justify-between mt-4">
                <div>Doanh thu:</div>
                <div className="font-bold">
                  {formatNumber(
                    todayData.totalRevenueAtCounter +
                      todayData.totalRevenueOnline
                  )}
                  đ
                </div>
              </div>
              <div className="flex justify-between mt-4">
                <div>Đơn chốt:</div>
                <div className="font-bold">
                  {todayData.totalOrdersAtCounter + todayData.totalOrdersOnline}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {renderBoxToday(
                "Online",
                todayData.totalRevenueOnline,
                todayData.totalOrdersOnline,
                true,
                <Globe size={24} color="#06bcea" weight="duotone" />,
                true
              )}
              {renderBoxToday(
                "Bán tại quầy",
                todayData.totalRevenueAtCounter,
                todayData.totalOrdersAtCounter,
                true,
                <Storefront size={24} color="#06bcea" weight="duotone" />,
                true
              )}
              {renderBoxToday(
                "Khách hàng mới",
                <span>{todayData.newCustomersCount} (khách)</span>,
                0,
                false,
                <IdentificationCard
                  size={24}
                  color="#06bcea"
                  weight="duotone"
                />,
                false
              )}
              {renderBoxToday(
                <span className="text-green-500">Đơn mới</span>,
                <span>{todayData.newOrdersCount} (đơn)</span>,
                0,
                false,
                <CheckSquareOffset size={24} color="green" weight="duotone" />,
                false
              )}
              {renderBoxToday(
                <span className="text-red-500">Đơn hủy</span>,
                <span>{todayData.canceledOrdersCount} (đơn)</span>,
                0,
                false,
                <CalendarX size={24} color="#d93030" />,
                false
              )}
              {renderBoxToday(
                "Số lượng bán",
                <span>{todayData.totalQuantitySold} (đơn)</span>,
                0,
                false,
                <ListNumbers size={24} color="#06bcea" weight="duotone" />,
                false
              )}
            </div>
          </>
        )}
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
