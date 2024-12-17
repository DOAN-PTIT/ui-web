import { UserOutlined } from "@ant-design/icons";
import { Avatar, Button, DatePicker, Divider, Empty, Input, Modal, Select, Spin, Table, TableProps } from "antd";
import dayjs from "dayjs";
import moment from "moment";
import { useEffect, useState } from "react";

export default function CustomerDetail({ open, onCancel, data, loading }: { open: boolean, onCancel: () => void,data:any ,loading:boolean}) {
    
    const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
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
                { title: 'ID sản phẩm', dataIndex: 'id', key: 'id' },
                { title: 'Tên sản phẩm', dataIndex: 'product', key: 'product', render: (product) => product?.name || "N/A" },
                { title: 'Giá', dataIndex: 'retail_price', key: 'retail_price', render: (_, item) => formatCurrency(item?.variation?.retail_price || 0) },
                { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
                { title: 'Tổng tiền', key: 'cost', render: (_, item) => formatCurrency(item?.quantity * item?.variation?.retail_price || 0) },
            ]}
            dataSource={record?.orderitems || []} 
            pagination={false}
          
        />
    );

    const columns: TableProps["columns"] = [
        {
            key: "STT",
            dataIndex: "id",
            title: "Mã",
            fixed: "left",
            width: 150,
        },
        {
            key: "CUSTOMER NAME",
            dataIndex: "name",
            title: "Sản phẩm",
            fixed: "left",
            width: 180,
            render: (_, record) => (
                <div>
                    {record?.orderitems?.map((item: any) => item?.product?.name).join(", ") || "N/A"}
                </div>
            )
        },
        
        {
            key: "TOTAL COST",
            dataIndex: "total_cost",
            title: "Tổng tiền",
            render: (_,i)=> (
                <div>
                    {formatCurrency(i?.total_cost)}
                </div>
            )
        },
        {
            key: "CREATED",
            dataIndex: "createdAt",
            title: "Mua lúc",
            render: (_,i)=> (
                <div className="text-gray-500 italic">{i?.createdAt ? moment(i.createdAt).format("HH:mm DD/MM/YYYY") : "N/A"}</div>
            )
        },
        {
            key: "EMAIL",
            dataIndex: "status",
            title: "Trạng thái",
            render: (_,i)=> (
                <div className={`${colorStatus(i?.status)}`}>
                    {checkStatus(i?.status)}
                </div>
            )
        },

    ];
    const statusLabels = {
        1: "Đang xử lý",
        2: "Chấp nhận",
        3: "Đang giao",
        4: "Đã giao",
        "-1": "Đã hủy",
    };

    const statusColors = {
        1: "text-yellow-500",
        2: "text-blue-500",
        3: "text-cyan-500",
        4: "text-green-500",
        "-1": "text-red-500",
    };

    const checkStatus = (status: number) => statusLabels[status] || "Không xác định";
    const colorStatus = (status: number) => statusColors[status] || "text-gray-400";
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
        return `${new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)}`;
    };
    const ListName = (data:any)=> {
        return data?.orderitems?.map((i:any)=>i.product.name)
    }
    return (
        <Modal open={open} closable footer={false} onCancel={onCancel} className="modal-detail !w-5/6">
            <Spin spinning={loading}>
                <div className="flex p-4 justify-between">
                    <div className="flex items-center">
                        <Avatar size={40} icon={<UserOutlined />} />
                        <div className="ml-2 text-base font-medium">{data?.customer.name}</div>
                    </div>
                    <div className="flex items-end  ">
                        <Button type="primary" size="middle" className="mr-12 ">Tạo đơn</Button>
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
                            <div className="text-base font-medium px-4 py-4">Thông tin cá nhân</div>
                            <Divider className="m-0" />
                            <div className="p-4">
                                <div className="flex justify-between items-center text-sm mb-2">
                                    <div className="">Ngày sinh</div>
                                    <DatePicker value={dayjs(data?.customer.date_of_birth)} placeholder="Chọn ngày sinh" className="w-1/2" />
                                </div>
                                <div className="flex justify-between items-center text-sm mb-2">
                                    <div className="">Giới tính</div>
                                    <Select value={data?.customer.gender} placeholder='Chọn giới tính' className="w-1/2" options={[
                                        {label:'Nam'},
                                        {label:'Nữ'},
                                        {label:'Khác'}
                                    ]} />
                                </div>
                                <div className="flex justify-between items-center text-sm mb-2">
                                    <div className="">Số điện thoại</div>
                                    <div className="text-blue-800 font-medium">{data?.customer.phone_number}</div>
                                </div>
                                <div className="flex justify-between items-center text-sm mb-2">
                                    <div className="">Email</div>
                                    <div className="text-blue-800 font-medium">{data?.customer.email}</div>
                                </div>

                            </div>
                        </div>
                        <div className="rounded-md bg-white">
                            <div className="text-base font-medium px-4 py-4">Thông tin mua hàng</div>
                            <Divider className="m-0" />
                            <div className="p-4">
                                <div className="flex justify-between items-center text-sm mb-2">
                                    <div className="w-2/3">Mã giới thiệu</div>
                                    <Input className="w-full" />
                                </div>
                                <div className="flex justify-between items-center text-sm mb-2">
                                    <div className="w-2/3">Số lần giới thiệu</div>
                                    <DatePicker className="w-full" />
                                </div>
                                <div className="flex justify-between items-center text-sm mb-2">
                                    <div className="w-2/3">Lần mua cuối</div>
                                    <DatePicker className="w-full" />
                                </div>
                                <div className="flex justify-between items-center text-sm mb-2">
                                    <div className="w-2/3">Ngày sinh</div>
                                    <DatePicker className="w-full" />
                                </div>
                            </div>
                            
                        </div>
                    </div>
                    <div className="w-2/3 rounded-lg bg-white">
                        <Table
                            className="bottom-0 cursor-pointer"
                            rowKey="id"
                            bordered
                            scroll={{y:300}}
                            locale={{ emptyText: <Empty description="Trống"/>}}
                            title={() => (
                                <div className="text-base font-medium">
                                    Lịch sử mua hàng
                                </div>
                            )}
                            pagination={{pageSize:5}}
                            dataSource={data?.orders?.orders||[]}
                            expandable={{
                                expandedRowRender,
                                expandedRowKeys,
                                onExpand: handleExpand,
                            }}
                            columns={columns}
                            footer={()=> (
                                <div className="flex gap-6 !rounded-none">
                                    <div className="flex">
                                        <div className="mr-1">Đã mua: </div>
                                        <div className="font-medium">{data?.orders.count +' lần'} </div>
                                    </div>
                                    <div className="flex">
                                        <div className="mr-1">Đã nhận: </div>
                                        <div className="font-medium">{received(data?.orders.orders) + ' lần'} </div>
                                    </div>
                                    <div className="flex">
                                        <div className="mr-1">Đã chi: </div>
                                        <div className="font-medium">{formatCurrency(spent(data?.orders.orders))} </div>
                                    </div>
                                </div>
                            )}
                        />
                    </div>
                </div>

            </Spin>
        </Modal>
    )
}