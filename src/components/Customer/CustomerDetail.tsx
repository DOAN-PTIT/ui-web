import { UserOutlined } from "@ant-design/icons";
import { Avatar, Modal } from "antd";

export default function CustomerDetail ({open}:{open:boolean}){
    return (
        <Modal open={open} footer={false} className="!w-3/4">
            <Avatar size={40} icon={<UserOutlined />}/>
        </Modal>
    )
}