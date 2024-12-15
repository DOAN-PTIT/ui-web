import apiClient from "@/service/auth";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Button, DatePicker, Divider, Empty, Input, Modal, Select, Table, TableProps } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

export default function CustomerDetail({ open, onCancel, onOk,data }: { open: boolean, onCancel: () => void, onOk: () => void,data:any }) {
    // const [dataCustomer,setDataCustomer] = useState()
    const columns: TableProps["columns"] = [
        {
            key: "ID",
            dataIndex: "id",
            title: "Mã",
            fixed: "left",
            width: 150,
        },
        {
            key: "CUSTOMER NAME",
            dataIndex: "customerName",
            title: "Sản phẩm",
            fixed: "left",
            width: 180
        },
        
        {
            key: "ADDRESS",
            dataIndex: "address",
            title: "Tổng tiền",
        },
        {
            key: "PHONE NUMBER",
            dataIndex: "phoneNumber",
            title: "Mua lúc",
        },
        {
            key: "EMAIL",
            dataIndex: "email",
            title: "Trạng thái",
        },

    ];
    return (
        <Modal open={open} closable footer={false} onCancel={onCancel} className="modal-detail !w-5/6">
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
                <div className="w-2/3">
                    <Table
                        className="bottom-0"
                        bordered
                        locale={{ emptyText: <Empty description="Trống"/>}}
                        title={() => (
                            <div className="text-base font-medium">
                                Lịch sử mua hàng
                            </div>
                        )}
                        columns={columns}
                        footer={()=> (
                            <div>
                                <div className="flex">
                                    <div className="mr-1">Đã mua: </div>
                                    <div className="font-medium">{data?.order.count} lần</div>
                                </div>
                            </div>
                        )}
                    />
                </div>
            </div>
        </Modal>
    )
}