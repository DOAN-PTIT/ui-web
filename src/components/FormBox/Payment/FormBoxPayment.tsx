import _ from "lodash";
import { createOrder } from "@/reducer/order.reducer";
import { AppDispatch, RootState } from "@/store";
import {
  calcOrderDebt,
  calcPromotionProduct,
  calculateTotalPriceProduct,
  formatInputNumber,
  formatNumber,
} from "@/utils/tools";
import { Input, notification } from "antd";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import apiClient from "@/service/auth";

const listFee = [
  {
    key: "delivery_cost_shop",
    label: "Phí vận chuyển",
  },
  {
    key: "total_discount",
    label: "Giảm giá",
  },
  {
    key: "paid",
    label: "Đã thanh toán",
  },
  {
    key: "surcharge",
    label: "Phụ thu",
  },
];

interface FormBoxPaymentProps
  extends ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps> {
  order?: any;
}

function FormBoxPayment(props: FormBoxPaymentProps) {
  const { orderParams, createOrder, currentShop } = props;

  const defaultPrice = {
    delivery_cost_shop: formatNumber(
      orderParams?.delivery_cost_shop || "0",
      "VND"
    ),
    // total_discount: formatNumber("0", "VND"),
    paid: formatNumber(orderParams?.paid || "0", "VND"),
    surcharge: formatNumber(orderParams?.surcharge || "0", "VND"),
  };

  const [afterDiscount, setAfterDiscount] = useState(0);
  const [needToPay, setNeedToPay] = useState(0);
  const [debt, setDebt] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [changePrice, setChangePrice] = useState<{
    delivery_cost_shop: string;
    // total_discount: string;
    paid: string;
    surcharge: string;
  }>(defaultPrice);
  const { orderitems, shopuser, customer, ...res } = orderParams;

  useEffect(() => {
    setTotalPrice(calcPrice("TOTAL PRICE"));
    setTotalDiscount(calcPrice("DISCOUNT"));
    setAfterDiscount(calcPrice("AFTER DISCOUNT"));
    setNeedToPay(calcPrice("NEED TO PAY"));
    setDebt(calcPrice("DEBT"));
    if (orderParams?.items?.length === 0) {
      setChangePrice(defaultPrice);
    }
  }, [res]);

  const notifyNoItems = _.debounce(() => {
    notification.warning({
      message: "Thông báo",
      description: "Vui lòng chọn sản phẩm trước khi thay đổi giá",
    });
  }, 500);

  const onChangePrice = (key: string, value: string) => {
    if (!orderParams.orderitems?.length) {
      setChangePrice(defaultPrice);
      notifyNoItems();
      return;
    }
    createOrder({
      ...orderParams,
      [key]: formatInputNumber(value, "VND"),
    });
  };

  const calcPrice = (field: string) => {
    if (orderParams?.orderitems?.length === 0) {
      createOrder({});
      return 0;
    } else {
      switch (field) {
        case "TOTAL PRICE":
          const total_price_product =
            orderParams?.orderitems?.length > 0
              ? calculateTotalPriceProduct(orderParams)
              : 0;
          const delivery_cost_shop = orderParams?.delivery_cost_shop || 0;
          const total_price = total_price_product + delivery_cost_shop;
          return total_price;
        case "DISCOUNT":
          return orderParams?.total_discount || 0;
        case "AFTER DISCOUNT":
          return orderParams?.total_cost - orderParams?.total_discount || 0;
        case "NEED TO PAY":

          return (
            orderParams?.total_cost -
              orderParams?.total_discount -
              orderParams?.paid +
              orderParams?.surcharge || 0
          );
        case "PAID":
          return orderParams?.paid || 0;
        case "DEBT":
          return (
            orderParams?.total_cost -
              orderParams?.total_discount -
              orderParams?.paid +
              orderParams?.surcharge || 0
          );
        default:
          return 0;
      }
    }
  };

  const priceInfo = [
    {
      key: "TOTAL PRICE",
      label: "Tổng tiền",
      value: totalPrice,
    },
    {
      key: "DISCOUNT",
      label: "Giảm giá",
      color: "text-green-500",
      hasDivider: true,
      value: totalDiscount,
    },
    {
      key: "AFTER DISCOUNT",
      label: "Sau giảm giá",
      value: afterDiscount,
      hasDivider: true,
    },
    {
      key: "NEED TO PAY",
      label: "Cần thanh toán",
      value: calcOrderDebt(orderParams) + (orderParams?.paid || 0),
    },
    {
      key: "PAID",
      label: "Đã thanh toán",
      hasDivider: true,
    },
    {
      key: "DEBT",
      label: "Còn nợ",
      color: "text-red-500",
      value: calcOrderDebt(orderParams),
    },
  ];

  return (
    <main className="bg-white p-5 rounded-lg shadow-sm mb-5">
      <div className="font-bold text-xl mb-4">Thanh toán</div>
      <div className="flex flex-col gap-5">
        {listFee.map((fee) => {
          return (
            <div key={fee.key} className="flex justify-between">
              <p className="w-1/2">{fee.label}</p>
              <Input
                defaultValue={0}
                value={orderParams[fee.key] || 0}
                suffix="đ"
                variant="filled"
                onChange={(e) => {
                  setChangePrice({
                    ...changePrice,
                    [fee.key]: e.target.value,
                  });
                  onChangePrice(fee.key, e.target.value);
                }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex flex-col gap-3 bg-gray-100 p-5 mt-[12px] rounded-lg">
        {priceInfo.map((price) => {
          return (
            <>
              <div className="flex justify-between" key={price.key}>
                <p className="w-1/2 font-medium">{price.label}</p>
                <p className={`font-medium ${price.color}`}>
                  {formatNumber(price.value || calcPrice(price.key))}{" "}
                  <span className="font-bold">đ</span>
                </p>
              </div>
              {price.hasDivider && (
                <div className="border h-[1px] w-full border-dashed"></div>
              )}
            </>
          );
        })}
      </div>
    </main>
  );
}

const mapStateToProps = (state: RootState) => {
  return {
    orderParams: state.orderReducer.createOrder,
    currentShop: state.shopReducer.shop,
  };
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
    createOrder: (params: any) => dispatch(createOrder(params)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormBoxPayment);
