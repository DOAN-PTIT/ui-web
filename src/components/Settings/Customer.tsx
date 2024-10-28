"use client"

import { Avatar, Breadcrumb, Button, Input, Layout, Select, TimePicker } from "antd"
import HeaderAction from "../HeaderAction/HeaderAction"
import { DeleteOutlined, FilterOutlined, PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import ModalAddCustomer from "./components/ModalAddCustomer";
import TitleLabel from "../Custom/TitleLabel";
const { Content } = Layout
const { Search } = Input;
export default function Genaral() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [openActor, setOpenActor] = useState(false)
    const [checkId, setCheckId] = useState()
    const handleOpenActor = (id: any) => {
        setOpenActor(true);
        setCheckId(id)
    }
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const customer = [
        {
            id: "1",
            name: "QUÂN",
            avtUrl: 'https://thucanhviet.com/wp-content/uploads/2017/09/pug-dog-dac-diem-nhan-dang-cho-mat-xe.jpg'
        },
        {
            id: "2",
            name: "KHAI DAN",
            avtUrl: 'https://thucanhviet.com/wp-content/uploads/2017/09/pug-dog-dac-diem-nhan-dang-cho-mat-xe.jpg'
        },
    ]
    return (
        <Layout>
            <HeaderAction
                title="Cấu hình"
                isShowSearch={true}
                inputPlaholder="Tìm kiếm cấu hình" />
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item href="/shop/1/settings">Cấu hình</Breadcrumb.Item>
                <Breadcrumb.Item href="/shop/1/settings">Nhân viên</Breadcrumb.Item>
                <Breadcrumb.Item className="mt-3 text-sm text-[#0050b3] font-medium">Danh sách nhân viên</Breadcrumb.Item>
            </Breadcrumb>
            <Content className="overflow-auto overflow-x-hidden flex gap-5 ">
                <div className="grid grid-cols-10 w-full gap-4">
                    <div className="col-span-3 rounded-xl bg-white min-h-screen">
                        <div className="p-4 text-base font-semibold">Danh sách nhân viên</div>
                        <div className="flex px-4">
                            <Search placeholder="Tìm kiếm nhân viên" />
                            <div className="pl-2">
                                <Button type="default" icon={<FilterOutlined />} />
                            </div>
                            <div className="pl-2">
                                <Button type="primary" onClick={showModal} icon={<PlusOutlined />} />
                                <ModalAddCustomer open={isModalOpen} onOk={handleOk} onCancel={handleCancel} />
                            </div>
                        </div>
                        <div className="p-4 ">
                            {customer.map(i => (
                                <div key={i.id} onClick={() => handleOpenActor(i.id)} className="rounded-lg flex items-center justify-between text-sm px-2 py-1 mb-1 bg-cyan-100 cursor-pointer">
                                    <div className="flex">
                                        <Avatar src={i.avtUrl} alt="avt" className="mr-2 size-6" />
                                        <div>{i.name}</div>
                                    </div>
                                    <div><DeleteOutlined /></div>
                                </div>
                            ))}

                        </div>
                    </div>
                    {openActor && customer.find(i => i.id === checkId) ? (
                        <div className="col-span-7 rounded-xl py-4 px-6 bg-white">
                            {customer
                                .filter(i => i.id === checkId)
                                .map(i => (
                                    <div key={i.id} >
                                        <div className="flex items-center gap-4">
                                            <Avatar src={i.avtUrl} alt="avt" size={48} />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <div className="text-base font-semibold">{i.name}</div>
                                                    <Button type="primary">Lưu</Button>
                                                </div>
                                                <div className="flex items-center">
                                                    <div className="flex">
                                                        <div className="text-sm font-medium">Email: </div>
                                                        <div className="mx-2 text-sm">{i.id}</div>
                                                    </div>
                                                    <div className="flex">
                                                        <div className="text-sm font-medium">SĐT: </div>
                                                        <div className="mx-2 text-sm">{i.id}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-4 mt-4">
                                            <div className="flex-1">
                                                <div className="text-sm font-medium mb-1">Bộ phận</div>
                                                <Select
                                                    className="w-full"
                                                    defaultValue="lucy"
                                                    options={[
                                                        { value: 'jack', label: 'Jack' },
                                                        { value: 'lucy', label: 'Lucy' },
                                                        { value: 'Yiminghe', label: 'yiminghe' },
                                                        { value: 'disabled', label: 'Disabled', disabled: true },
                                                    ]}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm font-medium mb-1">Kho hàng</div>
                                                <Select
                                                    className="w-full"
                                                    defaultValue="lucy"
                                                    options={[
                                                        { value: 'jack', label: 'Jack' },
                                                        { value: 'lucy', label: 'Lucy' },
                                                        { value: 'Yiminghe', label: 'yiminghe' },
                                                        { value: 'disabled', label: 'Disabled', disabled: true },
                                                    ]}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm font-medium mb-1">Thời gian làm việc</div>
                                                <TimePicker.RangePicker className="w-full" placeholder={['Bắt đầu', 'Kết thúc']} />
                                            </div>
                                        </div>

                                    </div>
                                ))}
                        </div>
                    ) : null}

                </div>
            </Content>
        </Layout>
    )
}