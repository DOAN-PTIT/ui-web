import { UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Divider, Input, Modal, Table } from "antd";

export default function CustomerDetail({ open, onCancel, onOk }: { open: boolean, onCancel: () => void, onOk: () => void }) {
    return (
        <Modal open={open} closable footer={false} onCancel={onCancel} className="modal-detail !w-5/6">
            <div className="flex p-4 justify-between">
                <div className="flex items-center">
                    <Avatar size={40} icon={<UserOutlined />} />
                    <div className="ml-2 text-base font-medium">Name</div>
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
            <div className="bg-gray-200 p-5 h-60 flex gap-4">
                <div className="w-1/3 ">
                    <div className="rounded-md bg-white h-full">
                        <div className="text-base font-medium px-4 py-3">Thông tin cá nhân</div>
                        <Divider className="m-0" />
                        <div className="p-4">
                            <div className="flex justify-between items-center text-sm mb-2">
                                <div className="w-2/3">Ngày sinh</div>
                                <Input />
                            </div>
                            <div className="flex justify-between items-center text-sm mb-2">
                                <div className="w-2/3">Giới tính</div>
                                <Input />
                            </div>
                            <div className="flex justify-between items-center text-sm mb-2">
                                <div className="w-2/3">Số điện thoại</div>
                                <div className="text-blue-800 font-medium"></div>
                            </div>
                            <div className="flex justify-between items-center text-sm mb-2">
                                <div className="w-2/3">Email</div>
                                <div className="text-blue-800 font-medium"></div>
                            </div>
                            
                        </div>
                    </div>
                </div>
                <Table className="w-2/3" />
            </div>
        </Modal>
    )
}