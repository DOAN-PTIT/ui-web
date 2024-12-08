import { createOrder } from "@/reducer/order.reducer";
import { AppDispatch, RootState } from "@/store";
import { Input } from "antd";
import { connect } from "react-redux";

interface FormBoxNoteProps extends ReturnType<typeof mapStateToProps>, ReturnType<typeof mapDispatchToProps> {}

function FormBoxNote(props: FormBoxNoteProps) {
  const { createOrder, orderParams } = props

  return (
    <main className="rounded-lg bg-white p-5 shadow-sm">
      <div className="text-xl font-bold mb-5">Ghi chú</div>
      <Input.TextArea
        style={{ resize: "none", height: 180 }}
        className="bg-slate-100 border-none hover:bg-slate-100 focus:bg-white focus:border-blue-500"
        placeholder="Viết ghi chú cho đơn hàng"
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
