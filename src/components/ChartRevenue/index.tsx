import {
  CheckSquareOffset,
  Coins,
  Globe,
  Storefront,
} from "@phosphor-icons/react";
import {
  Chart as ChartJS,
  CategoryScale,
  Legend,
  Tooltip,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  Legend,
  Tooltip,
  LinearScale,
  PointElement,
  LineElement
);

const ChartRevenue = () => {
  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
  ];
  const data = {
    labels: labels,
    datasets: [
      {
        label: "My First Dataset",
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
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
            <span className="font-bold mr-4">0đ</span>
          </p>
          <p className="">
            Đơn chốt: &nbsp;&nbsp;&nbsp;{" "}
            <span className="font-bold mr-4">0</span>
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
            <span className="font-bold mr-4">0đ</span>
          </p>
          <p className="">
            Đơn chốt: &nbsp;&nbsp;&nbsp;{" "}
            <span className="font-bold mr-4">0</span>
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
            <span className="font-bold mr-4">0đ</span>
          </p>
          <p className="">
            Đơn chốt: &nbsp;&nbsp;&nbsp;{" "}
            <span className="font-bold mr-4">0</span>
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex justify-between gap-3">
      <div className="w-2/3 p-4 rounded-md bg-white">
        <div className="grid grid-cols-3 gap-3">
          {renderBoxTotal()}
          {renderBoxOnline()}
          {renderBoxAtCounter()}
        </div>
        <Line data={data} />
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

export default ChartRevenue;
