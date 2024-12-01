"use client";

import { getListShopUser } from "@/action/shop.action";
import apiClient from "@/service/auth";
import { AppDispatch, RootState } from "@/store";
import { DeleteOutlined, UserOutlined } from "@ant-design/icons";
import {
    Avatar,
    Button,
    Divider,
    Empty,
    Input,
    message,
    Modal,
    Radio,
    RadioChangeEvent,
    Switch,
} from "antd";
import { useState, useMemo } from "react";
import { connect, useSelector } from "react-redux";

interface Props {
    open: any;
    onOk: any;
    onCancel: any;
}

interface Employee {
    id?: string;
    name?: string;
    email?: string;
    fb_id?: string;
    avatar?: string;
}

export default function ModalAddCustomer({ open, onOk, onCancel }: Props) {
    const { id } = useSelector((state: RootState) => state.shopReducer.shop);
  
    const [value, setValue] = useState(1); 
    const [employee, setEmployee] = useState<Partial<Employee>>({}); 
    const [findEmploye, setFindEmploye] = useState<Employee[]>([]); 

    
    const remove = (array:Employee[])=>{
        const map = new Map<string,Employee>()
        array.forEach(i => {
            if(!map.has(i.id!)){
                map.set(i.id!,i)
            }
        });
        return Array.from(map.values())
    }
    const uniqueArr = remove(findEmploye)
   
    const newUserArray = uniqueArr.map((item) => ({
        user_id: item.id,
    }));

    const onChange = (e: RadioChangeEvent) => setValue(e.target.value);

    const handleAdd = async () => {
        if (newUserArray.length === 0) {
            message.info("Bạn chưa chọn nhân viên");
        } else {
            try {
                await apiClient.post(`/shop/${id}/employee/add`, newUserArray);
                message.success("Thêm nhân viên thành công");
                onOk()
            } catch (error) {
                console.error(error);
                message.error("Thêm nhân viên thất bại");
            } finally {
                onCancel();
            }
        }
    };

    const handleFind = async () => {
        const url =
            value === 1
                ? `/shop/${id}/employee/add/find-email`
                : `/shop/${id}/employee/add/find-fb-id`;

        try {
            const res = await apiClient.post(url, employee);

            // Kiểm tra và thêm nhân viên mới
            setFindEmploye(prev=>[...prev, res.data])
        } catch (error: any) {
            const errorMsg = error.response?.data?.message;
            if (errorMsg === "Employee already in shop") {
                message.warning("Nhân viên đã có trong cửa hàng");
            } else if (errorMsg === "User not found") {
                message.error("Tài khoản không tồn tại");
            } else {
                message.error("Có lỗi xảy ra");
            }
            console.error(error);
        }
    };

    const handleRemoveEmployee = (idToRemove: string) => {
        setFindEmploye((prev) => prev.filter((employee) => employee.id !== idToRemove));
    };
    return (
        <Modal
            title="Thêm nhân viên"
            open={open}
            onOk={handleAdd}
            onCancel={onCancel}
            cancelText="Hủy"
            okText="Đồng ý"
        >
            <Divider className="m-0" />
            <div className="py-4">
                <div className="flex mb-2">
                    <Switch defaultChecked />
                    <div className="ml-2">
                        Tự động thêm tài khoản có vai trò trên trang vào cửa hàng
                    </div>
                </div>
                <Radio.Group className="my-2" onChange={onChange} value={value}>
                    <Radio value={1}>Email</Radio>
                    <Radio value={3}>Facebook ID</Radio>
                </Radio.Group>
                <div className="flex w-full my-2">
                    {value === 1 ? (
                        <Input
                            onChange={(e) =>
                                setEmployee((prev) => ({ ...prev, email: e.target.value }))
                            }
                            placeholder="Nhập email nhân viên"
                        />
                    ) : (
                        <Input
                            onChange={(e) =>
                                setEmployee((prev) => ({ ...prev, fb_id: e.target.value }))
                            }
                            placeholder="Nhập Facebook ID nhân viên"
                        />
                    )}
                    <Button className="ml-2" type="primary" onClick={handleFind}>
                        Thêm mới
                    </Button>
                </div>
                <div>
                    <div className="font-medium mb-3">Nhân viên đã chọn</div>
                    {uniqueArr.length > 0 ? (
                        uniqueArr.map((i, index) => (
                            <div
                                key={index}
                                className="mb-2 flex items-center justify-between cursor-pointer h-8"
                            >
                                <div className="flex w-full rounded-lg text-sm px-2 py-1 my-1 mr-2 bg-gray-100">
                                    <Avatar
                                        src={i.avatar}
                                        icon={<UserOutlined />}
                                        alt="avt"
                                        className="mr-2 size-6"
                                    />
                                    <div>{i.name || i.email || i.fb_id}</div>
                                </div>
                                <DeleteOutlined onClick={() => handleRemoveEmployee(i.id!)} />
                            </div>
                        ))
                    ) : (
                        <Empty description="Trống" />
                    )}
                </div>
            </div>
            <Divider className="m-0" />
        </Modal>
    );
}
