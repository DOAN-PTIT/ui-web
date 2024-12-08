import { createOrder } from "@/reducer/order.reducer";
import { AppDispatch, RootState } from "@/store";
import { DatePicker, Input } from "antd";
import { connect } from "react-redux";

interface FormBoxReceiveProps
  extends ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps> {}

function FormBoxReceive(props: FormBoxReceiveProps) {
  const { createOrder, orderParams } = props;

  return (
    <main className="w-full bg-white p-5 rounded-lg shadow-sm">
      <div className="mb-5 text-xl font-bold">Nhận hàng</div>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <p>Dự kiến nhận hàng</p>
          <DatePicker
            variant="filled"
            format={"DD/MM/YYYY HH:mm"}
            showTime
            showHour
            showMinute
            onChange={(date, dateTime) =>
              createOrder({
                ...orderParams,
                estimated_delivery: date.format("YYYY-MM-DD"),
              })
            }
          />
        </div>
        <div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Input
              variant="filled"
              placeholder="Tên người nhận"
              onChange={(value) =>
                createOrder({
                  ...orderParams,
                  recipient_name: value.target.value,
                })
              }
            />
            <Input
              variant="filled"
              placeholder="SDT"
              onChange={(value) =>
                createOrder({
                  ...orderParams,
                  recipient_phone_number: value.target.value,
                })
              }
            />
          </div>
          <Input
            placeholder="Địa chỉ nhận hàng"
            variant="filled"
            onChange={(value) =>
              createOrder({
                ...orderParams,
                delivery_address: value.target.value,
              })
            }
          />
        </div>
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
    createOrder: (order: any) => dispatch(createOrder(order)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormBoxReceive);
