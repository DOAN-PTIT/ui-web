import { Table } from "antd";

const ChartShopUser = () => {
    const columns = [
        {
            title: 'Nhân viên',
            dataIndex: 'product',
            key: 'product',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Doanh thu',
            dataIndex: 'revenue',
            key: 'revenue',
        },
        {
            title: "Đơn chốt",
            dataIndex: "order_confirm",
            key: "order_confirm"
        }
    ]

    return <div className="w-1/2">
        <Table columns={columns} dataSource={[]} title={() => <div className="font-bold text-[18px]">Nhân viên</div>} />
    </div>
}

export default ChartShopUser;