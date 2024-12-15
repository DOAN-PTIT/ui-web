import { createOrder } from "@/reducer/order.reducer";
import { AppDispatch, RootState } from "@/store";
import { Input } from "antd";
import { connect } from "react-redux";

interface FormBoxNoteProps extends ReturnType<typeof mapStateToProps>, ReturnType<typeof mapDispatchToProps> {
  order?: any;
}

function FormBoxNote(props: FormBoxNoteProps) {
  const { createOrder, orderParams, order } = props

  return (
    <main className="rounded-lg bg-white p-5 shadow-sm">
      <div className="text-xl font-bold mb-5">Ghi chú</div>
      <Input.TextArea
      variant="filled"
        style={{ resize: "none", height: 180 }}
        className="border focus:border-blue-500"
        placeholder="Viết ghi chú cho đơn hàng"
        defaultValue={order?.note}
        onChange={(e) => createOrder({ ...orderParams, note: e.target.value })}
      />
    </main>
  );
}

const mapStateToProps = (state: RootState) => {
  return {
    orderParams: state.orderReducer.createOrder
  }
}

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
    createOrder: (order: any) => dispatch(createOrder(order))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FormBoxNote);
