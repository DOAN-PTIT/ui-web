import CustomDatePicker from "@/components/CustomDatePicker";
import { createOrder } from "@/reducer/order.reducer";
import { AppDispatch, RootState } from "@/store";
import { DatePicker, Input } from "antd";
import moment from "moment";
import { connect } from "react-redux";

interface FormBoxReceiveProps
  extends ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps> {
  order?: any;
}

function FormBoxReceive(props: FormBoxReceiveProps) {
  const { createOrder, orderParams, order } = props;

  const defaultValue = order?.estimated_delivery
    ? moment(order?.estimated_delivery).utc()
    : null;

  const handleDateChange = (date, dateString) => {
    createOrder({
      ...orderParams,
      estimated_delivery: date ? date.toISOString() : null,
    });
  };

  return (
    <main className="w-full bg-white p-5 rounded-lg shadow-sm">
      <div className="mb-5 text-xl font-bold">Nhận hàng</div>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <p>Dự kiến nhận hàng</p>
          <CustomDatePicker 
            defaultValue={defaultValue}
            format={"DD/MM/YYYY HH:mm"}
            showHour
            showMinute
            showTime
            onChange={handleDateChange}
          />
        </div>
        <div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Input
              variant="filled"
              placeholder="Tên người nhận"
              defaultValue={order?.recipient_name}
              onChange={(value) =>
                createOrder({
                  ...orderParams,
                  recipient_name: value.target.value,
                })
              }
            />
            <Input
              variant="filled"
              defaultValue={order?.recipient_phone_number}
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
            defaultValue={order?.delivery_address}
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
