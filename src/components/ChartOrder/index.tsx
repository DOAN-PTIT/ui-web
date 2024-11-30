import { ProductOutlined } from "@ant-design/icons";
import { ArrowUUpLeft, CheckSquareOffset, Vault } from "@phosphor-icons/react";
import { Col, Row, Space } from "antd";

const listBox = [
  {
    key: 1,
    icon: <CheckSquareOffset size={32} color="#298302" weight="duotone" />,
    title: "Tổng hàng chốt",
    isShowPercent: true,
    detail: [
      {
        title: "Tổng tiền",
        value: "0 đ",
        color: "text-green-500",
      },
      {
        title: "Số lượng",
        value: "0",
      },
    ],
  },
  {
    key: 2,
    icon: <ArrowUUpLeft size={32} color="#b60202" weight="duotone" />,
    title: "Tổng đơn huỷ",
    isShowPercent: true,
    detail: [
      {
        title: "Tổng tiền",
        value: "0 đ",
        color: "text-red-500",
      },
      {
        title: "Số lượng",
        value: "0",
      },
    ],
  },
  {
    key: 3,
    icon: <Vault size={32} color="#0ab6ff" weight="duotone" />,
    title: "Có thể bán",
    isShowPercent: false,
    detail: [
      {
        title: "Tổng tiền",
        value: "0 đ",
      },
      {
        title: "Số lượng",
        value: "0",
      },
    ],
  },
];

const ChartOrder = () => {
  const renderBoxInfo = (box: any) => {
    return (
      <div className="min-h-[150px]" key={box.key}>
        <div className="flex gap-4 items-center h-1/4">
          <p className="text-[32px]">{box.icon}</p>
          <p className="font-medium">{box.title}</p>
        </div>
        <div className="flex mt-1 h-3/4">
          {box.detail.map((item: any, index: number) => {
            return (
              <div key={index} className="w-1/2">
                <p className="font-medium opacity-85">{item.title}</p>
                <p className={`font-bold text-[18px] py-3 ${item.color}`}>{item.value}</p>
                {box.isShowPercent && <p className={`${item.color}`}>_ %</p>}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex justify-between gap-3">
      {listBox.map((item: any, index: number) => {
      return <div className="bg-white p-4 rounded-md w-1/3" key={index}>{renderBoxInfo(item)}</div>;
      })}
    </div>
  );
};

export default ChartOrder;
