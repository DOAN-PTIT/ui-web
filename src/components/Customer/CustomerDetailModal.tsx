import { createOrder } from "@/reducer/order.reducer";
import apiClient from "@/service/auth";
import { AppDispatch, RootState } from "@/store";
import { CopyOutlined, UserOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Divider,
  Empty,
  Input,
  message,
  Modal,
  Select,
  Spin,
  Table,
  TableProps,
  Tooltip,
} from "antd";
import dayjs from "dayjs";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Avatar from "react-avatar";
import { connect, useSelector } from "react-redux";

interface CustomerDetailProps
  extends ReturnType<typeof mapStateToProps>,
  ReturnType<typeof mapDispatchToProps> {
  open: boolean;
  onCancel: () => void;
  data: any;
  loading: boolean;
}

function CustomerDetail({
  open,
  onCancel,
  data,
  loading,
  createOrder,
  currentShop,
}: CustomerDetailProps) {
  const router = useRouter();
  const { id } = currentShop;
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
  const [profileCustomer, setProfileCustomer] = useState({
    name: "",
    email: "",
    gender: "",
    address: "",
    phone_number: "",
    date_of_birth: "",
    referral_code: "",
  });
  useEffect(() => {
    if (data?.customer) {
      setProfileCustomer({
        name: data.customer.name || "",
        email: data.customer.email || "",
        gender: data.customer.gender || "",
        address: data.customer.address || "",
        phone_number: data.customer.phone_number || "",
        date_of_birth: data.customer.date_of_birth || "",
        referral_code: data.customer.referral_code || "",
      });
    }
  }, [data]);

  const handleExpand = (expanded: boolean, record: any) => {
    setExpandedRowKeys((prevKeys) => {
      const rowKey = record?.id;
      if (!rowKey) return prevKeys;
      if (expanded) {
        return [rowKey];
      } else {
        return prevKeys.filter((key) => key !== rowKey);
      }
    });
  };

  const expandedRowRender = (record: any) => (
    <Table
      columns={[
        {
          title: "ID sản phẩm",
          dataIndex: "id",
          key: "id",
          render: (_: any, __: any, index: number) => index + 1,
        },
        {
          title: "Tên sản phẩm",
          dataIndex: "product",
          key: "product",
          render: (product) => product?.name || "N/A",
        },
        {
          title: "Giá",
          dataIndex: "retail_price",
          key: "retail_price",
          render: (_, item) =>
            formatCurrency(item?.variation?.retail_price || 0),
        },
        { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
        {
          title: "Tổng tiền",
          key: "cost",
          render: (_, item) =>
            formatCurrency(item?.quantity * item?.variation?.retail_price || 0),
        },
      ]}
      dataSource={record?.orderitems || []}
      pagination={false}
    />
  );

  const columns: TableProps["columns"] = [
    {
      key: "STT",
      dataIndex: "STT",
      title: "Thứ tự",
      fixed: "left",
      width: 150,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      key: "CUSTOMER NAME",
      dataIndex: "name",
      title: "Sản phẩm",
      fixed: "left",
      width: 180,
      render: (_, record) => {
        const productNames = record?.orderitems
          ?.map((item: any) => item?.product?.name)
          .join(", ");
        const maxLength = 25;
        const shortenedNames =
          productNames?.length > maxLength
            ? productNames.substring(0, maxLength) + "..."
            : productNames;

        return (
          <div title={productNames || "N/A"}>{shortenedNames || "N/A"}</div>
        );
      },
    },

    {
      key: "TOTAL COST",
      dataIndex: "total_cost",
      title: "Tổng tiền",
      render: (_, i) => <div>{formatCurrency(i?.total_cost)}</div>,
    },
    {
      key: "CREATED",
      dataIndex: "createdAt",
      title: "Mua lúc",
      render: (_, i) => (
        <div className="text-gray-500 italic">
          {i?.createdAt
            ? moment(i.createdAt).format("HH:mm DD/MM/YYYY")
            : "N/A"}
        </div>
      ),
    },
    {
      key: "EMAIL",
      dataIndex: "at_counter",
      title: "Hình thức mua hàng",
      render: (_, i) => (
        <div
          className={`${checkColorCounter(
            i?.at_counter
          )} border py-1 rounded-lg flex items-center justify-center`}
        >
          {checkCounter(i?.at_counter)}
        </div>
      ),
    },
    {
      key: "EMAIL",
      dataIndex: "status",
      title: "Trạng thái",
      render: (_, i) => (
        <div className={`${colorStatus(i?.status)}`}>
          {checkStatus(i?.status)}
        </div>
      ),
    },
  ];
  const statusLabels: any = {
    1: "Đang xử lý",
    2: "Chấp nhận",
    3: "Đang giao",
    4: "Đã giao",
    "-1": "Đã hủy",
  };

  const statusColors: any = {
    1: "text-yellow-500",
    2: "text-blue-500",
    3: "text-cyan-500",
    4: "text-green-500",
    "-1": "text-red-500",
  };
  const checkColorCounter = (data: any) => {
    if (data === true) {
      return "text-[#E67E22] border-[#E67E22]";
    } else {
      return "text-[#3498DB] border-[#3498DB]";
    }
  };
  const checkCounter = (data: any) => {
    if (data === true) {
      return "Office";
    } else {
      return "Online";
    }
  };
  const checkStatus = (status: number) =>
    statusLabels[status] || "Không xác định";
  const colorStatus = (status: number) =>
    statusColors[status] || "text-gray-400";

  const received = (data: any) => {
    if (!Array.isArray(data)) {
      return 0;
    }
    return data.filter((i: any) => i.status === 4).length;
  };
  const spent = (data: any) => {
    if (!Array.isArray(data)) {
      return 0;
    }
    return data.reduce((sum, order) => {
      if (order?.status === 4 && typeof order?.total_cost === "number") {
        return sum + order.total_cost;
      }
      return sum;
    }, 0);
  };
  const formatCurrency = (amount: number | undefined): string => {
    if (typeof amount !== "number") {
      return "0 đ";
    }
    return `${new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)}`;
  };
  const handleCopy = () => {
    navigator.clipboard
      .writeText(data?.customer?.referral_code || "Không có mã")
      .then(
        () => message.success("Đã sao chép!"),
        () => message.error("Sao chép thất bại!")
      );
  };
  const options = [
    { label: "Nam", value: "MALE" },
    { label: "Nữ", value: "FEMALE" },
    { label: "Khác", value: "OTHER" },
  ];
  const handleSingleFieldUpdate = async (fieldName: string, value: any) => {
    try {
      const updatedProfile = { ...profileCustomer, [fieldName]: value };
      await apiClient.post(`shop/${id}/customer/${data.customer.id}/update`, {
        [fieldName]: value,
      });
      setProfileCustomer(updatedProfile);
      message.success(`Cập nhật ${fieldName} thành công!`);
    } catch (error) {
      console.error(error);
      message.error(`Cập nhật ${fieldName} thất bại!`);
    }
  };
  const [editing, setEditing] = useState(false);
  return (
    <Modal
      open={open}
      closable
      footer={false}
      onCancel={onCancel}
      className="modal-detail !w-5/6"
    >
      <Spin spinning={loading}>
        <div className="flex p-4 justify-between">
          <Tooltip title="Click để thay đổi tên khách hàng!">
            <div className="flex items-center">
              <Avatar name={profileCustomer.name} round size={"40"} />
              {editing ? (
                <Input
                  className="ml-3"
                  value={profileCustomer?.name}
                  onChange={(e) =>
                    setProfileCustomer((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  onBlur={() => {
                    setEditing(false);
                    handleSingleFieldUpdate("name", profileCustomer?.name);
                  }}
                  onPressEnter={() => {
                    setEditing(false);
                    handleSingleFieldUpdate("name", profileCustomer?.name);
                  }}
                />
              ) : (
                <div
                  onClick={() => setEditing(true)}
                  className="ml-2 text-base font-medium"
                >
                  {profileCustomer.name}
                </div>
              )}
            </div>
          </Tooltip>
          <div className="flex items-end  ">
            <Button
              type="primary"
              size="middle"
              className="mr-12 "
              onClick={() => {
                createOrder({
                  add_customer: data.customer ? data.customer : null,
                });
                router.push(`sale`);
              }}
            >
              Tạo đơn
            </Button>
          </div>
        </div>
        <Divider className="mt-1 mb-0" />
        <div className="flex w-full p-3 text-blue-800 text-sm border-b">
          <UserOutlined />
          <div className="ml-4">Thông tin khách hàng</div>
        </div>
        <div className="bg-gray-200 p-5 h-auto flex gap-4">
          <div className="w-1/3 ">
            <div className="rounded-md bg-white mb-2">
              <div className="text-base font-medium px-4 py-4">
                Thông tin cá nhân
              </div>
              <Divider className="m-0" />
              <div className="p-4">
                <div className="flex justify-between items-center text-sm mb-2">
                  <div className="w-1/2">Ngày sinh</div>
                  <DatePicker
                    onChange={(value) => {
                      handleSingleFieldUpdate(
                        "date_of_birth",
                        dayjs(value).format("YYYY-MM-DD")
                      );
                    }}
                    value={
                      profileCustomer?.date_of_birth
                        ? dayjs(profileCustomer?.date_of_birth)
                        : null
                    }
                    placeholder={
                      profileCustomer?.date_of_birth || "Chưa có thông tin"
                    }
                    className="w-1/2"
                  />
                </div>
                <div className="flex justify-between items-center text-sm mb-2">
                  <div className="w-1/2">Giới tính</div>
                  <Select
                    className="w-1/2"
                    placeholder="Chọn giới tính"
                    value={profileCustomer?.gender}
                    options={options}
                    onChange={(value) =>
                      handleSingleFieldUpdate("gender", value)
                    }
                  />
                </div>
                <div className="flex justify-between items-center text-sm mb-2">
                  <div className="w-1/2">Số điện thoại</div>
                  <Input value={profileCustomer?.phone_number}
                    onChange={(e) => setProfileCustomer((prev) => ({
                      ...prev,
                      phone_number: e.target.value
                    }))}
                    onBlur={() => handleSingleFieldUpdate('phone_number', profileCustomer?.phone_number)}
                    onPressEnter={() => handleSingleFieldUpdate('phone_number', profileCustomer?.phone_number)}
                    className="text-blue-800 font-medium w-1/2" />

                </div>
                <div className="flex justify-between items-center text-sm mb-2">
                  <div className="w-1/2">Email</div>
                  <div className="text-blue-800 font-medium">
                    {data?.customer.email}
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-md bg-white">
              <div className="text-base font-medium px-4 py-4">
                Thông tin mua hàng
              </div>
              <Divider className="m-0" />
              <div className="p-4">
                <div className="flex justify-between items-center text-sm mb-2">
                  <div className="w-1/2">Mã giới thiệu</div>
                  <Input
                    className="w-1/2"
                    value={data?.customer?.referral_code || "Không có mã"}
                    readOnly
                    suffix={<CopyOutlined onClick={handleCopy} />}
                  />
                </div>
                <div className="flex justify-between items-center text-sm mb-2">
                  <div className="w-1/2">Số lần giới thiệu</div>
                  <div className="text-blue-800 font-medium">
                    {data?.customer.number_of_referrals}
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm mb-2">
                  <div className="w-1/2">Lần mua cuối</div>
                  <Input
                    className="w-1/2"
                    value={
                      data?.customer.last_purchase
                        ? moment(data?.customer.last_purchase).format(
                          "HH:mm DD/MM/YYYY"
                        )
                        : moment().format("DD/MM/YYYY")
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="w-2/3 rounded-lg bg-white">
            <Table
              className="bottom-0 cursor-pointer"
              rowKey="id"
              bordered
              scroll={{ y: 300 }}
              locale={{ emptyText: <Empty description="Trống" /> }}
              title={() => (
                <div className="text-base font-medium">Lịch sử mua hàng</div>
              )}
              pagination={{ pageSize: 30, size: "small" }}
              dataSource={data?.orders?.orders || []}
              expandable={{
                expandedRowRender,
                expandedRowKeys,
                onExpand: handleExpand,
              }}
              columns={columns}
              footer={() => (
                <div className="flex gap-6 !rounded-none">
                  <div className="flex">
                    <div className="mr-1">Đã mua: </div>
                    <div className="font-medium">
                      {data?.orders.count + " lần"}{" "}
                    </div>
                  </div>
                  <div className="flex">
                    <div className="mr-1">Đã nhận: </div>
                    <div className="font-medium">
                      {received(data?.orders.orders) + " lần"}{" "}
                    </div>
                  </div>
                  <div className="flex">
                    <div className="mr-1">Đã chi: </div>
                    <div className="font-medium">
                      {formatCurrency(spent(data?.orders.orders))}{" "}
                    </div>
                  </div>
                </div>
              )}
            />
          </div>
        </div>
      </Spin>
    </Modal>
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
    createOrder: (order: any) => dispatch(createOrder(order)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomerDetail);
