"use client"

import { Divider, InputNumber, Modal, Radio, Tabs, TabsProps } from "antd";
interface Props {
    open: any;
    onOk: any;
    onCancel: any;
}
export default function ModalSettingVoucher({ open, onOk, onCancel }: Props) {
    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Cấu hình',
            children:
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <div>
                            Chiết khấu mã giới thiệu cho khách mới
                        </div>
                        <div>
                            <InputNumber min={1} max={10} defaultValue={3} className="mr-1"/>
                            <Radio.Group>
                                <Radio.Button value="start">%</Radio.Button>
                                <Radio.Button value="end">đ</Radio.Button>
                            </Radio.Group>
                        </div>

                    </div>
                </div>,
        },
        {
            key: '2',
            label: 'Định dạng mã khuyến mãi',
            children: 'Chờ lòn trường quảng',
        },

    ];

    return (
        <Modal title='Tên nhân viên' open={open} onOk={onOk} onCancel={onCancel} cancelText='Hủy' okText='Lưu'>
            <Divider className="m-0" />
            <Tabs defaultActiveKey="1" items={items} />
            <Divider className="m-0" />
        </Modal>
    )
}