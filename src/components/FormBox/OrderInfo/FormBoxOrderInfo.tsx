import { getListShopUser } from "@/action/shop.action";
import { createOrder } from "@/reducer/order.reducer";
import { AppDispatch, RootState } from "@/store";
import { LoadingOutlined } from "@ant-design/icons";
import { DatePicker, Select } from "antd";
import { connect } from "react-redux";
import Avatar from "react-avatar";
import moment from "moment";
import CustomDatePicker from "@/components/CustomDatePicker";
import { useEffect, useState } from "react";
interface FormBoxOrderInfoProps
  extends ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps> {
  order?: any;
}

function FormBoxOrderInfo(props: FormBoxOrderInfoProps) {
  const {
    orderParams,
    createOrder,
    shopUser,
    getListShopUser,
    isLoading,
    currentShop,
    currentUser,
    order,
  } = props;

  const [createdAt, setCreatedAt] = useState<any>(orderParams.createdAt ? moment(orderParams.createdAt) : moment());

  useEffect(() => {
    createOrder({ ...orderParams, createdAt: moment(createdAt).format("YYYY-MM-DD HH:mm") });
  }, [createdAt]);

  const onFocusSelect = async () => {
    getListShopUser({ shopId: currentShop.id });
  };

  const handleSelectChange = (value: any) => {
    const userId = value;
    const user: any = shopUser?.employees.find((user: any) => user.id == userId);
    const shopUserId = user?.shopusers?.find((shopuser: any) => shopuser.shop_id == currentShop.id);
    createOrder({ ...orderParams, shopuser_id: shopUserId?.id });
  }

  return (
    <main className="p-5 bg-white w-full rounded-lg shadow-sm">
      <div className="mb-5 text-xl  font-bold">Thông tin</div>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between">
          <p>Tạo lúc</p>
          <CustomDatePicker
            className="w-[180px]"
            onChange={(date, datetime) => {
              setCreatedAt(date);
            }}
            format="DD/MM/YYYY HH:mm"
            showHour
            showMinute
            showTime
            variant="filled"
            value={createdAt}
          />
        </div>
        <div className="flex justify-between">
          <p>Nhân viên xử lý</p>
          <Select
            onFocus={onFocusSelect}
            filterOption={false}
            onSelect={(value) => handleSelectChange(value)}
            placeholder="Chọn nhân viên"
            className="w-[180px]"
            loading={isLoading}
            variant="filled"
            notFoundContent={
              isLoading ? <LoadingOutlined /> : <div>Không có nhân viên!</div>
            }
            value={order?.shopuser?.user?.id}
          >
            {shopUser?.employees.map((user: any) => {
              return (
                <Select.Option key={user} value={user.id}>
                  <Avatar
                    name={user.name}
                    size="20"
                    round={true}
                    className="mr-2"
                  />
                  {user.name}
                </Select.Option>
              );
            })}
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
    currentUser: state.userReducer.user,
  };
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
    createOrder: (order: any) => dispatch(createOrder(order)),
    getListShopUser: (params: any) => dispatch(getListShopUser(params)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormBoxOrderInfo);
