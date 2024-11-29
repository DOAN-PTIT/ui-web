import _ from "lodash";
import { createOrder } from "@/reducer/order.reducer";
import { AppDispatch, RootState } from "@/store";
import {
  calculateTotalPriceProduct,
  formatInputNumber,
  formatNumber,
} from "@/utils/tools";
import { Input, notification } from "antd";
import { useEffect, useState } from "react";
import { connect } from "react-redux";

const listFee = [
  {
    key: "delivery_cost",
    label: "Phí vận chuyển",
  },
  {
    key: "discount",
    label: "Giảm giá",
  },
  {
    key: "prepaid",
    label: "Đã thanh toán",
  },
  {
    key: "surcharge",
    label: "Phụ thu",
  },
];

const defaultPrice = {
  delivery_cost: "0",
  discount: "0",
  prepaid: "0",
  surcharge: "0",
};

interface FormBoxPaymentProps
  extends ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps> {}

function FormBoxPayment(props: FormBoxPaymentProps) {
  const { orderParams, createOrder } = props;

  const [afterDiscount, setAfterDiscount] = useState(0);
  const [needToPay, setNeedToPay] = useState(0);
  const [debt, setDebt] = useState(0);
  const [changePrice, setChangePrice] = useState<{
    delivery_cost: string;
    discount: string;
    prepaid: string;
    surcharge: string;
  }>({
    delivery_cost: "0",
    discount: "0",
    prepaid: "0",
    surcharge: "0",
  });

  useEffect(() => {
    calcPrice("TOTAL PRICE");
    setAfterDiscount(calcPrice("TOTAL PRICE") - orderParams?.discount || 0);
    setNeedToPay(
      calcPrice("TOTAL PRICE") -
        (orderParams?.discount || 0) -
        (orderParams?.prepaid || 0) +
        (orderParams?.surcharge ||
        0)
    );
    setDebt(
      calcPrice("TOTAL PRICE") -
        (orderParams?.discount || 0) -
        (orderParams?.prepaid || 0) +
        (orderParams?.surcharge ||
        0)
    );
    if (orderParams.items?.length === 0) {
      setChangePrice(defaultPrice);
    }
  }, [orderParams, changePrice])

  const notifyNoItems = _.debounce(() => {
    notification.warning({
      message: "Thông báo",
      description: "Vui lòng chọn sản phẩm trước khi thay đổi giá",
    });
  }, 500);

  const priceInfo = [
    {
      key: "TOTAL PRICE",
      label: "Tổng tiền",
    },
    {
      key: "DISCOUNT",
      label: "Giảm giá",
    },
    {
      key: "AFTER DISCOUNT",
      label: "Sau giảm giá",
      value: afterDiscount,
    },
    {
      key: "NEED TO PAY",
      label: "Cần thanh toán",
      value: needToPay,
    },
    {
      key: "PAID",
      label: "Đã thanh toán",
    },
    {
      key: "DEBT",
      label: "Còn nợ",
      value: debt,
    },
  ];

  const onChangePrice = (key: string, value: string) => {
    if (!orderParams.items?.length) {
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
    if (orderParams.items?.length === 0) {
      createOrder({});
      return 0;
    } else {
      switch (field) {
        case "TOTAL PRICE":
          const total_price_product =
            orderParams.items?.length > 0
              ? calculateTotalPriceProduct(orderParams)
              : 0;
          const delivery_cost = orderParams?.delivery_cost || 0;
          const total_price = total_price_product + delivery_cost;
          return total_price;
        case "DISCOUNT":
          return orderParams?.discount || 0;
        case "AFTER DISCOUNT":
          return orderParams?.total_price - orderParams?.discount || 0;
        case "NEED TO PAY":
          return (
            orderParams?.total_price -
              orderParams?.discount -
              orderParams?.prepaid +
              orderParams?.surcharge || 0
          );
        case "PAID":
          return orderParams?.prepaid || 0;
        case "DEBT":
          return (
            orderParams?.total_price -
              orderParams?.discount -
              orderParams?.prepaid +
              orderParams?.surcharge || 0
          );
        default:
          return 0;
      }
    }
  };

  return (
    <main className="bg-white p-5 rounded-lg shadow-lg mb-5">
      <div className="font-bold text-xl mb-4">Thanh toán</div>
      <div className="flex flex-col gap-5">
        {listFee.map((fee) => {
          return (
            <div key={fee.key} className="flex justify-between">
              <p className="w-1/2">{fee.label}</p>
              <Input
                defaultValue={0}
                value={formatInputNumber(changePrice[fee.key], "VND")}
                addonAfter={<span>₫</span>}
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
      <div className="flex flex-col gap-5 bg-slate-200 p-5 mt-[12px] rounded-lg">
        {priceInfo.map((price) => {
          return (
            <div className="flex justify-between" key={price.key}>
              <p className="w-1/2">{price.label}</p>
              <p>{price.value || calcPrice(price.key)}</p>
            </div>
          );
        })}
      </div>
    </main>
  );
}

const mapStateToProps = (state: RootState) => {
  return {
    orderParams: state.orderReducer.createOrder,
  };
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
    createOrder: (params: any) => dispatch(createOrder(params)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormBoxPayment);
