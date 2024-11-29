"use client"

import { QuestionCircleOutlined, SettingOutlined } from "@ant-design/icons"
import { Breadcrumb, Button, Layout, Select, Switch, Tooltip } from "antd"
import { useState } from "react"
import HeaderAction from "../HeaderAction/HeaderAction"
import ModalSettingVoucher from "./components/ModalSettingVoucher"
const { Content } = Layout
export default function Customer() {
    const [openSetVoucher, setOpenSetVoucher] = useState(false)
    const [openForm, setOpenForm] = useState(false)
    const shopId = localStorage.getItem('shopId')
    const handleOpenSetVoucher = (checked: boolean) => {
        setOpenSetVoucher(checked);
    }
    const handleOpenForm = () => {
        setOpenForm(true)
    }
    const handleOk = () => {
        setOpenForm(false)
    }
    const handleCancel = () => {
        setOpenForm(false)
    }
    return (
        <Layout className="">
            <HeaderAction
                title="Cấu hình"
                isShowSearch={true}
                inputPlaholder="Tìm kiếm cấu hình" />
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item href={`/shop/${shopId}/settings`}>Cấu hình</Breadcrumb.Item>
                <Breadcrumb.Item href={`/shop/${shopId}/settings`}>Khách hàng</Breadcrumb.Item>
                <Breadcrumb.Item className="mt-3 text-sm text-[#0050b3] font-medium">Cài đặt khách hàng</Breadcrumb.Item>
            </Breadcrumb>
            <Content className="overflow-auto overflow-x-hidden flex gap-5 h-screen">
                <div className="flex w-full gap-4 p-4 rounded-md bg-white">
                    <div className="font-medium w-1/4">Cấu hình khách hàng</div>
                    <div className="w-3/4">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex">
                                <div>Tạo đơn trùng SĐT</div>
                                <Tooltip title="Chỉ chặn khi SĐT trước đó năm trong đơn có trạng thái nhỏ hơn Chờ chuyển hàng">
                                    <QuestionCircleOutlined className="text-orange-500 ml-2" />
                                </Tooltip>
                            </div>
                            <div className="mr-8">
                                <Select
                                    defaultValue="Cho phép"
                                    style={{ width: 120 }}
                                    options={[
                                        { value: 'Chặn', label: 'Chặn' },
                                        { value: 'Cảnh báo', label: 'Cảnh báo' },
                                        { value: 'Cho phép', label: 'Cho phép' },
                                    ]}
                                />
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex">
                                <Switch defaultChecked={openSetVoucher} onChange={handleOpenSetVoucher} />
                                <div className="ml-2">Cấu hình mã giới thiệu</div>
                            </div>
                            <div className="mr-8">
                                {openSetVoucher && (<Button color="primary" variant="outlined" onClick={handleOpenForm}>Cấu hình<SettingOutlined /></Button>)}
                                <ModalSettingVoucher open={openForm} onOk={handleOk} onCancel={handleCancel} />
                            </div>
                        </div>
                    </div>
                </div>

            </Content>
        </Layout>
    )
}