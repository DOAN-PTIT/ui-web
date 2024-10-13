import { DatePicker, Input } from "antd";

function FormBoxReceive() {
  return (
    <main className="w-full bg-white p-5 rounded-lg">
      <div className="mb-5 text-xl font-bold">Nhan hang</div>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <p>Du kien nhan hang</p>
          <DatePicker format={"DD/MM/YYYY"} showTime showHour showMinute />
        </div>
        <div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Input placeholder="Ten nguoi nhan" />
            <Input placeholder="SDT" />
          </div>
          <Input placeholder="Dia chi nhan hang" />
        </div>
      </div>
    </main>
  );
}

export default FormBoxReceive;
