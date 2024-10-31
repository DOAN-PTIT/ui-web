"use client";

import {
  UserOutlined,
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  LoginOutlined,
  SyncOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Image,
  Layout,
  Modal,
  Space,
  Tooltip,
} from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import HeaderAction from "../HeaderAction/HeaderAction";
import { useEffect, useState } from "react";
import AddModel from "./components/ModelAdd";
import axios from "axios";
import { getHostName } from "@/utils/tools";

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

interface FBShopProps {
  name: string;
  id: string;
  picture: {
    data: {
      width: number;
      url: string;
    };
  };
}

function Overview() {
  const [profile, setProfile] = useState<{ access_token: string }>();
  const [listFBPages, setListFBPages] = useState<FBShopProps[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [isLoadingFbPage, setIsLoadingFbPage] = useState(false);
  const [openIntegration, setOpenIntegration] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getUserInfo();
    getListShop();
  }, []);

  const route = useRouter();

  let accessToken: any
  if (useSearchParams().values().next().value) {
    accessToken = useSearchParams().values().next().value
  } else {
    if (typeof window !== 'undefined') {
      accessToken = localStorage.getItem('token')
    }
  }

  const getUserInfo = async () => {
    const url = `${getHostName()}/user/profile`;
    return await axios
      .get(url, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        setProfile(res.data);
      })
      .catch((error) => console.log(error));
  };

  const getListPage = async () => {
    setIsLoadingFbPage(true);
    const access_token = profile ? profile.access_token : "";
    const url = `https://graph.facebook.com/v21.0/me/accounts?fields=name,picture,category&access_token=${access_token}`;
    return await axios
      .get(url)
      .then((res) => {
        if (res.status == 200) {
          setListFBPages(res.data.data);
          setOpenIntegration(true);
        }
        console.log(res.data.data)
      })
      .catch((error) => console.log(error))
      .finally(() => setIsLoadingFbPage(false));
  };

  const getListShop = async () => {
    setIsLoading(true);
    const url = `${getHostName()}/shop/list-shop`;
    return await axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => console.log(res))
      .catch((error) => console.log(error))
      .finally(() => setIsLoading(false));
  };

  const handleClickAccess = (shopId: number) => {
    route.push(`/shop/${shopId}/dashbroad`);
  };

  const handleOpenModel = () => {
    setOpenModal(true);
  };

  const handleOk = async (param: { name: string; avatar: any }) => {
    const createShopFormData = new FormData();
    createShopFormData.append('name', param.name);      
    createShopFormData.append('avatar', param.avatar);
    
    const url = `${getHostName()}/user/create-shop`;

    // Log ra để kiểm tra
    console.log(createShopFormData)

    return await axios
    .post(url, createShopFormData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        // 'Content-Type': 'multipart/form-data',
      },
    })
    .then((res) => console.log(res))
    .catch((error) => console.log(error));
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
          <Button
            type="primary"
            onClick={handleOpenModel}
            icon={<PlusCircleOutlined />}
          >
            Thêm cửa hàng
          </Button>
          <Button
            type="primary"
            onClick={getListPage}
            loading={isLoadingFbPage}
            icon={<ThunderboltOutlined />}
          >
            Tich hop cua hang
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
                  <Button
                    onClick={() => handleClickAccess(shop.id)}
                    icon={<LoginOutlined />}
                  >
                    Truy cập
                  </Button>
                </div>
              </Card>
            );
          })}
        </Space>
        <Modal
          open={openIntegration}
          onCancel={() => setOpenIntegration(false)}
          title={<div className="font-bold mb-5 text-2xl">Kich hoat</div>}
          footer={[]}
          width={1200}
        >
          <Space className="gap-10">
            {listFBPages &&
              listFBPages.map((page) => {
                return (
                  <Card
                    key={page.id}
                    className="w-[300px] h-[150px]] hover:border-sky-500 transition-all ease-out cursor-pointer"
                  >
                    <div className="p-1 text-center">
                      <Image
                        src={page.picture.data.url}
                        width={page.picture.data.width}
                        alt=""
                        preview={false}
                        className="rounded-full"
                      />
                      <h1 className="mt-4 font-bold">{page.name}</h1>
                    </div>
                  </Card>
                );
              })}
          </Space>
        </Modal>
      </Content>
    </Layout>
  );
}

export default Overview;
