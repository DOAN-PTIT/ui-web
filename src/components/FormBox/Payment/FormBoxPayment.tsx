import { Input } from "antd"

const listFee = [
    {
        key: "SHIPPING FEE",
        label: "Phi van chuyen"
    },
    {
        key: "DISCOUNT",
        label: "Giam gia"
    },
    {
        key: "PAID",
        label: "Da thanh toan"
    },
    {
        key: "SURCHARGE",
        label: "Phu thu"
    }
]
const priceInfo = [
    {
        key: "TOTAL PRICE",
        label: "Tong tien"
    },
    {
        key: "DISCOUNT",
        label: "Giam gia"
    },
    {
        key: "AFTER DISCOUNT",
        label: "Sau giam gia"
    },
    {
        key: "NEED TO PAY",
        label: "Can thanh toan"
    },
    {
        key: "PAID",
        label: "Da thanh toan"
    },
    {
        key: "DEBT",
        label: "Con no"
    }
]
function FormBoxPayment() {
    return <main className="bg-white p-5 rounded-lg shadow-lg mb-5">
        <div className="font-bold text-xl mb-4">
            Thanh toan
        </div>
        <div className="flex flex-col gap-5">
        {listFee.map(fee => {
            return <div key={fee.key} className="flex justify-between">
                <p className="w-1/2">{fee.label}</p>
                <Input defaultValue={0} addonAfter={<span>₫</span>} />
            </div>
        })}
        </div>
        <div className="flex flex-col gap-5 bg-slate-200 p-5 mt-[12px] rounded-lg">
            {priceInfo.map(price => {
                return <div className="flex justify-between">
                    <p className="w-1/2">{price.label}</p>
                    <p>10000</p>
                </div>
            })}
        </div>
    </main>
}

export default FormBoxPayment