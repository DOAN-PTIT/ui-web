import { getListShopUser } from "@/action/shop.action";
import { createOrder } from "@/reducer/order.reducer";
import { AppDispatch, RootState } from "@/store";
import { LoadingOutlined } from "@ant-design/icons";
import { DatePicker, Select } from "antd";
import { connect } from "react-redux";
import Avatar from "react-avatar";
interface FormBoxOrderInfoProps
  extends ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps> {}

function FormBoxOrderInfo(props: FormBoxOrderInfoProps) {
  const {
    orderParams,
    createOrder,
    shopUser,
    getListShopUser,
    isLoading,
    currentShop,
    currentUser
  } = props;

  const onFocusSelect = async () => {
    getListShopUser({ shopId: currentShop.id })
  };

  return (
    <main className="p-5 bg-white w-full rounded-lg shadow-sm">
      <div className="mb-5 text-xl  font-bold">Thông tin</div>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between">
          <p>Tạo lúc</p>
          <DatePicker
            className="w-[180px]"
            onChange={(date, datetime) => {
              createOrder({ ...orderParams, createdAt: date.format("YYYY-MM-DD HH:mm") });
            }}
            format="DD/MM/YYYY HH:mm"
            showHour
            showMinute
            showTime
            variant="filled"
          />
        </div>
        <div className="flex justify-between">
          <p>Nhân viên xử lý</p>
          <Select
            onFocus={onFocusSelect}
            filterOption={false}
            onChange={(value) => {
                createOrder({ ...orderParams, shopuser_id: value });
            }}
            className="w-[180px]"
            loading={isLoading}
            variant="filled"
            notFoundContent={
              isLoading ? <LoadingOutlined /> : <div>Không có nhân viên!</div>
            }
            defaultValue={currentUser.id}
          >
            {shopUser?.employees.map((user: any) => (
              <Select.Option key={user} value={user.id}>
                <Avatar
                  name={user.name}
                  size="20"
                  round={true}
                  className="mr-2"
                />
                {user.name}
              </Select.Option>
            ))}
          </Select>
        </div>
      </div>
    </main>
  );
}

const mapStateToProps = (state: RootState) => {
  return {
    orderParams: state.orderReducer.createOrder,
    shopUser: state.shopReducer.user,
    isLoading: state.shopReducer.isLoading,
    currentShop: state.shopReducer.shop,
    currentUser: state.userReducer.user
  };
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
    createOrder: (order: any) => dispatch(createOrder(order)),
    getListShopUser: (params: any) => dispatch(getListShopUser(params)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormBoxOrderInfo);
