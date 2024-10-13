import { formatNumber } from "@/utils/tools";
import { CloseOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, DatePicker, Divider, Select } from "antd";

const customers = [
  {
    name: "Customer",
    phoneNumher: "0933442344",
    email: "email@gmail.com",
    address: "Hoc vien cong nghe buu chinh vien thong, Ha noi",
    dateOfBirth: "19/10/1995",
    totalOrder: 12,
    totalPurchase: 10000323,
    lastOrder: "10/10/2024",
  },
];
function FormBoxCustomer() {
  return (
    <main className="p-5 rounded-lg shadow-lg bg-white w-full">
      <div className="mb-5 flex justify-between">
        <p className="text-xl font-bold">Khach hang</p>
        <Select placeholder="Gioi tinh" className="w-[120px]">
          <Select.Option key="male">Nam</Select.Option>
          <Select.Option key="female">Nu</Select.Option>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Select placeholder="Ten khach hang" options={[]} showSearch />
        <Select placeholder="SDT" />
        <Select placeholder="Email" />
        <DatePicker placeholder="Ngay sinh" format="DD/MM/YYYY" />
      </div>
      {customers && (
        <div className="mt-3 border border-blue-600 bg-sky-100 p-4 rounded-md shadow-sm relative">
          <CloseOutlined className=" border-red-500 border bg-red-100 p-1 rounded-full text-[8px] absolute top-[-8px] right-[-8px] cursor-pointer" />
          <div className="flex justify-between">
            <div className="w-1/2 flex gap-3">
              <Avatar icon={<UserOutlined />} size={40} />
              <div className="font-medium">
                <p>{customers[0].name}</p>
                <p className="text-blue-600">{customers[0].phoneNumher}</p>
              </div>
            </div>
            <div>{customers[0].dateOfBirth}</div>
          </div>
          <Divider />
          <div className="flex justify-between">
            <p>
              Tong so tien da mua:{" "}
              <span className="font-bold">{formatNumber(customers[0].totalPurchase, "VND")}</span>
            </p>
            <div>
              <p>Tong so don da mua: <span className="font-bold text-green-500">{customers[0].totalOrder}</span></p>
              <p>Lan cuoi mua hang: <span className="font-bold">{customers[0].lastOrder}</span></p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default FormBoxCustomer;
