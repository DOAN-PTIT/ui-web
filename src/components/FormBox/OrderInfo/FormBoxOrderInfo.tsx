import { DatePicker, Select } from "antd"

function FormBoxOrderInfo() {
    return <main className="p-5 bg-white w-full rounded-lg shadow-lg">
        <div className="mb-5 text-xl  font-bold">
            Thong tin
        </div>
        <div className="flex flex-col gap-3">
            <div className="flex justify-between">
                <p>Tao luc</p>
                <DatePicker className="w-[180px]" format="DD/MM/YYYY HH:mm" showHour showMinute showTime />
            </div>
            <div className="flex justify-between">
                <p>Nhan vien xu ly</p>
                <Select className="w-[180px]">
                    <Select.Option key="123">aa</Select.Option>
                </Select>
            </div>
        </div>
    </main>
}

export default FormBoxOrderInfo