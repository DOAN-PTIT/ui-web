import _ from "lodash";
import apiClient from "@/service/auth";
import { AppDispatch, RootState } from "@/store";
import { formatNumber } from "@/utils/tools";
import { CloseOutlined, LoadingOutlined } from "@ant-design/icons";
import { DatePicker, Divider, notification, Select } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import Avatar from "react-avatar";
import moment from "moment";
import { Customer } from "@/utils/type";
import { createOrder } from "@/reducer/order.reducer";
import CustomDatePicker from "@/components/CustomDatePicker";

interface FormBoxCustomerProps
  extends ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps> {
      order?: any;
      customer?: any
    }

function FormBoxCustomer(props: FormBoxCustomerProps) {
  const { currentShop, order, customer } = props;

  const [searchField, setSearchField] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<
    Customer | undefined
  >(order?.customer || customer || undefined);

  useEffect(() => {
    if (selectedCustomer) {
      props.createOrder({
        ...props.orderParams,
        add_customer: selectedCustomer,
      });
    }
  }, [selectedCustomer]);

  const handleSearchCustomer = useCallback(
    async (value: string) => {
      const url = `/shop/${currentShop.id}/customers`;

      if (!value) {
        return;
      }

      setIsLoading(true);
      return await apiClient
        .post(url, _, {
          params: {
            shopId: currentShop.id,
            searchTerm: value,
            field: searchField || "",
          },
        })
        .then((res) => {
          setCustomers(res.data);
          setIsLoading(false);
        })
        .catch((err) => {
          notification.error({
            message: "Lỗi",
            description: "Không thể tìm kiếm khách hàng",
          });
          setIsLoading(false);
        });
    },
    [searchField, currentShop.id]
  );

  const handleSelectedCustomer = (selectedId: any) => {
    const selected = customers.find((customer) => customer.id == selectedId);
    setSelectedCustomer(selected);
  };

  const renderCustomerOptions = () => {
    return customers.length > 0
      ? customers.map((customer) => ({
          label: (
            <div className="flex gap-1">
              <Avatar name={customer.name} size="30" round />
              <div className="ml-3">
                <p className="font-medium">{customer.name}</p>
                <p>{customer.phone_number}</p>
              </div>
            </div>
          ),
          value: customer.id,
        }))
      : [];
  };

  const renderNotFoundContent = () => {
    return isLoading ? (
      <LoadingOutlined />
    ) : (
      <div className="text-center">Không tìm thấy khách hàng</div>
    );
  };

  const deboundSearch = useMemo(() => {
    return _.debounce(handleSearchCustomer, 800);
  }, [handleSearchCustomer]);

  return (
    <main className="p-5 rounded-lg shadow-sm bg-white w-full">
      <div className="mb-5 flex justify-between">
        <p className="text-xl font-bold">Khách hàng</p>
        <Select
          value={selectedCustomer?.gender}
          placeholder="Giới tính"
          className="w-[120px]"
          variant="filled"
        >
          <Select.Option key="MALE">Nam</Select.Option>
          <Select.Option key="FEMALE">Nữ</Select.Option>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Select
          placeholder="Tên khách hàng"
          options={renderCustomerOptions()}
          value={selectedCustomer?.name}
          onSelect={handleSelectedCustomer}
          notFoundContent={renderNotFoundContent()}
          showSearch
          onSearch={deboundSearch}
          onFocus={() => setSearchField("name")}
          filterOption={false}
          variant="filled"
        />
        <Select
          placeholder="SDT"
          onSearch={deboundSearch}
          onFocus={() => setSearchField("phone_number")}
          onSelect={handleSelectedCustomer}
          options={renderCustomerOptions()}
          value={selectedCustomer?.phone_number}
          notFoundContent={renderNotFoundContent()}
          showSearch
          filterOption={false}
          variant="filled"
        />
        <Select
          placeholder="Email"
          onSearch={deboundSearch}
          onFocus={() => setSearchField("email")}
          onSelect={handleSelectedCustomer}
          options={renderCustomerOptions()}
          notFoundContent={renderNotFoundContent()}
          value={selectedCustomer?.email}
          showSearch
          filterOption={false}
          variant="filled"
        />
        <CustomDatePicker
          placeholder="Ngày sinh"
          format="DD/MM/YYYY"
          value={selectedCustomer && moment(selectedCustomer?.date_of_birth)}
          variant="filled"
        />
      </div>
      {selectedCustomer && (
        <div className="mt-3 border border-blue-600 bg-sky-100 p-4 rounded-md shadow-sm relative">
          <CloseOutlined
            onClick={() => setSelectedCustomer(undefined)}
            className=" border-red-500 border bg-red-100 p-1 rounded-full text-[8px] absolute top-[-8px] right-[-8px] cursor-pointer"
          />
          <div className="flex justify-between">
            <div className="w-1/2 flex gap-3">
              <Avatar name={selectedCustomer.name} size="40" round />
              <div className="font-medium">
                <p>{selectedCustomer.name}</p>
                <p className="text-blue-600">{selectedCustomer.phone_number}</p>
              </div>
            </div>
            <div>
              {moment(selectedCustomer?.date_of_birth).format("DD/MM/YYYY")}
            </div>
          </div>
          <Divider />
          <div className="flex justify-between">
            <p className="w-3/4">
              Tổng số tiền đã chi:{" "}
              <span className="font-bold">
                {formatNumber(selectedCustomer?.total_spent, "VND")} đ
              </span>
            </p>
            <div>
              <p>
                Tổng số đơn đã mua:{" "}
                <span className="font-bold text-green-500">
                  {selectedCustomer?.order_count || 0}
                </span>
              </p>
              <p>
                Lần cuối mua hàng:{" "}
                <span className="font-[600]">
                  {selectedCustomer?.last_purchase ? moment(selectedCustomer?.last_purchase).format("DD/MM/YYYY HH:MM") : <span className="text-red-500">Chưa mua hàng</span>}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

const mapStateToProps = (state: RootState) => {
  return {
    currentShop: state.shopReducer.shop,
    orderParams: state.orderReducer.createOrder,
  };
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
    createOrder: (order: any) => dispatch(createOrder(order)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormBoxCustomer);
