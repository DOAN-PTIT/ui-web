import { Table } from "antd";

const ChartProduct = () => {
    const columns = [
        {
            title: 'Tên sản phẩm',
            dataIndex: 'product',
            key: 'product',
        },
        {
            title: 'Mẫu mã',
            dataIndex: 'variation',
            key: 'variation',
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
        <Table columns={columns} dataSource={[]} title={() => <div className="font-bold text-[18px]">Sản Phẩm</div>} />
    </div>
}

export default ChartProduct;