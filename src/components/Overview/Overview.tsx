"use client";

import {
  UserOutlined,
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  LoginOutlined,
  SyncOutlined
} from "@ant-design/icons";
import { Avatar, Button, Card, Layout, Space, Tooltip } from "antd";
import { useRouter } from "next/navigation";
import HeaderAction from "../HeaderAction/HeaderAction";
import { useState } from "react";
import AddModel from "./components/ModelAdd";

const { Content } = Layout;
const shops = [
  {
    id: 1,
    name: "Shop 1",
    description: "Shop 1 description",
  },
  {
    id: 2,
    name: "Shop 1",
    description: "Shop 1 description",
  },
];

function Overview() {
  const [openModal,setOpenModal] = useState(false);
  const route = useRouter()
  const handleClickAccess = (shopId: number) => {
    route.push(`/shop/${shopId}/dashbroad`)
  }
  const handleOpenModel = () => {
    setOpenModal(true)
  }
  const handleOk = () => {
    setOpenModal(false);
  };

  const handleCancel = () => {
    setOpenModal(false);
  };
  return (
    <Layout className="w-full min-h-screen">
      <HeaderAction isShowSearch={false} title="Danh sách cửa hàng" />
      <Content className="p-8">
        <Space className="w-full justify-end" align="center">
          <Button type="primary" icon={<SyncOutlined />}>
            Tải lại
          </Button>
          <Button type="primary" onClick={handleOpenModel} icon={<PlusCircleOutlined />}>
            Thêm cửa hàng
          </Button>
          <AddModel open={openModal} onOk={handleOk} onCancel={handleCancel} />
        </Space>
        <Space className="gap-10 mt-10 justify-center w-full">
          {shops.map((shop) => {
            return (
              <Card
                key={shop.id}
                className="w-[300px] min-h-[250px]"
                title={
                  <div className="p-5 text-center">
                    <Avatar icon={<UserOutlined />} size={80} />
                    <h1 className="mt-4">{shop.name}</h1>
                  </div>
                }
                actions={[
                  <Tooltip key="edit" title="Cập nhật cửa hàng">
                    <EditOutlined />
                  </Tooltip>,
                  <Tooltip key="delete" title="Xóa cửa hàng">
                    <DeleteOutlined />
                  </Tooltip>,
                  <Tooltip key="leave" title="Rời khỏi cửa hàng">
                    <LoginOutlined />
                  </Tooltip>,
                ]}
              >
                <div className="text-center">
                  <p className="opacity-80 mb-4">{shop.description}</p>
                  <Button onClick={() => handleClickAccess(shop.id)} icon={<LoginOutlined />}>Truy cập</Button>
                </div>
              </Card>
            );
          })}
        </Space>
      </Content>
    </Layout>
  );
}

export default Overview;
