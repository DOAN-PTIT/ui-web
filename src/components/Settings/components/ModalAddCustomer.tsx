"use client"

import { Button, Divider, Input, Modal, Radio, RadioChangeEvent, Select, Space, Switch } from "antd"
import { useState } from "react";
interface Props {
    open: any;
    onOk: any;
    onCancel: any;
}
export default function ModalAddCustomer({ open, onOk, onCancel }: Props) {
    const [value, setValue] = useState(1);
    const options = [
        {
            value: '+84',
            label: '(Viet Nam) +84',
        },
        {
            value: '+856',
            label: '(Laos) +856',
        },
    ];
    const onChange = (e: RadioChangeEvent) => {
        console.log('radio checked', e.target.value);
        setValue(e.target.value);
    };
    return (
        <Modal title='Tên nhân viên' open={open} onOk={onOk} onCancel={onCancel} cancelText='Hủy' okText='Đồng ý'>
            <Divider className="m-0" />
            <div className="py-4">
                <div className="flex mb-2">
                    <Switch defaultChecked />
                    <div className="ml-2">Tự động thêm tài khoản có vai trò trên trang vào cửa hàng</div>
                </div>
                <Radio.Group className="my-2" onChange={onChange} value={value}>
                    <Radio value={1}>Email</Radio>
                    <Radio value={2}>Số điện thoại</Radio>
                    <Radio value={3}>Facebook ID</Radio>
                    <Radio value={4}>Tên đăng nhập</Radio>
                </Radio.Group>
                <div className="flex w-full my-2">
                    {value === 1 ? <Input placeholder="Nhập email nhân viên" />
                        : value === 2
                            ? <Space.Compact className="w-full">
                                <Select defaultValue="+84" options={options} />
                                <Input defaultValue="Nhập SĐT nhân viên" />
                            </Space.Compact>
                            : value === 3 ? <Input placeholder="Nhập Facebook ID nhân viên" />
                                : value === 4 ? <Input placeholder="Nhập Tên đăng nhập" /> : ''
                    }
                    <Button className="ml-2" value={value} type="primary">Thêm mới</Button>
                </div>

            </div>
            <Divider className="m-0" />
        </Modal>
    )
}