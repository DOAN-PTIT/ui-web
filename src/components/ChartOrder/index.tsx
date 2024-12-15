import apiClient from "@/service/auth";
import { AppDispatch, RootState } from "@/store";
import { formatNumber } from "@/utils/tools";
import { ProductOutlined } from "@ant-design/icons";
import { ArrowUUpLeft, CheckSquareOffset, Vault } from "@phosphor-icons/react";
import { Col, Row, Space, Spin } from "antd";
import { useEffect, useState } from "react";
import { connect } from "react-redux";

interface ChartOrderProps
  extends ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps> {}

const ChartOrder = (props: ChartOrderProps) => {
  const { currentShop } = props;

  const [loading, setLoading] = useState(false);
  const [orderStat, setOrderStat] = useState<any>(null);
  const [totalOrder, setTotalOrder] = useState<any>(null);

  useEffect(() => {
    getOrderStat();
  }, [currentShop]);

  const getOrderStat = async () => {
    setLoading(true);
    try {
      const url = `shop/${currentShop.id}/order-stat`;
      return await apiClient
        .post(url)
        .then((res) => {
          console.log(res.data);
          setOrderStat(res.data);
          setTotalOrder(res.data.totalOrder);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getTotalOrderConfirm = () => {
    // status = 4
    const quantity = orderStat?.totalProductDelivered?._sum.quantity || 0;
    const total_cost = orderStat?.totalAmount?.map((item: any) => {
      if (item.status == 4) {
        return item?._sum?.total_cost;
      }

      return 0;
    });

    return {
      total_cost: total_cost,
      quantity: quantity,
    };
  };

  const getTotalOrderCancel = () => {
    // status = -1
    const quantity = orderStat?.totalProductCanceled?._sum.quantity || 0;
    const total_cost = orderStat?.totalAmount?.map((item: any) => {
      if (item.status == -1) {
        return item?._sum?.total_cost;
      }

      return 0;
    });

    return {
      total_cost: total_cost || 0,
      quantity: quantity || 0,
    };
  };

  const getTotalVariation = () => {
    const amount = orderStat?.totalVariation?._sum.amount || 0;
    const retail_price = orderStat?.totalVariation?._sum?.retail_price;

    return {
      retail_price: retail_price || 0,
      amount: amount || 0,
    };
  };

  const listBox = [
    {
      key: 1,
      icon: <CheckSquareOffset size={32} color="#298302" weight="duotone" />,
      title: "Tổng hàng chốt",
      isShowPercent: true,
      detail: [
        {
          title: "Tổng tiền",
          value: formatNumber(getTotalOrderConfirm().total_cost) + " đ",
          color: "text-green-500",
        },
        {
          title: "Số lượng",
          value: getTotalOrderConfirm().quantity,
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
          value: formatNumber(getTotalOrderCancel().total_cost) + " đ",
          color: "text-red-500",
        },
        {
          title: "Số lượng",
          value: getTotalOrderCancel().quantity,
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
          value: formatNumber(getTotalVariation().retail_price) + " đ",
          color: "text-orange-500",
        },
        {
          title: "Số lượng",
          value: getTotalVariation().amount,
        },
      ],
    },
  ];

  const renderBoxInfo = (box: any) => {
    return (
      <div className="min-h-[150px]" key={box.key}>
        <div className="flex gap-4 items-center h-1/4">
          <p className="text-[32px]">{box.icon}</p>
          <p className="font-medium">{box.title}</p>
        </div>
        <div className="flex mt-1 h-3/4">
          {box.detail.map((item: any, index: number) => {
            let value = item.value;
            if (typeof value === "string") {
              value = value.replace(/đ/g, "");
            } else if (value === null) {
              value = "0";
            }

            value = parseInt(value, 10) || 0;

            const percent = totalOrder ? (value / totalOrder) * 100 : 0;
            return (
              <div key={index} className="w-1/2">
                <p className="font-medium opacity-85">{item.title}</p>
                <p className={`font-bold text-[18px] py-3 ${item.color}`}>
                  {item.value}
                </p>
                {box.isShowPercent && (
                  <p className={`${item.color}`}>
                    {percent.toFixed(2)} %
                  </p>
                )}
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
        return (
          <div className="bg-white p-4 rounded-md w-1/3" key={index}>
            {loading ? (
              <div className="min-h-[150px] flex items-center justify-center">
                <Spin />
              </div>
            ) : (
              renderBoxInfo(item)
            )}
          </div>
        );
      })}
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

export default connect(mapStateToProps, mapDispatchToProps)(ChartOrder);
