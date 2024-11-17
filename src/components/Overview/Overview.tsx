"use client";

import apiClient from "@/service/auth";
import { getHostName } from "@/utils/tools";
import {
  DeleteOutlined,
  EditOutlined,
  LoginOutlined,
  PlusCircleOutlined,
  SyncOutlined,
  ThunderboltOutlined,
  UserOutlined
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
import axios from "axios";
import _ from "lodash";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import HeaderAction from "../HeaderAction/HeaderAction";
import AddModel from "./components/ModelAdd";

const { Content } = Layout;

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
export interface ListShop {
  avatar: string;
  createdAt: string;
  description: string;
  id: number;
  name: string;
  updatedAt: string;
}
function Overview() {
  const [profile, setProfile] = useState<{ access_token: string }>();
  const [listFBPages, setListFBPages] = useState<FBShopProps[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [isLoadingFbPage, setIsLoadingFbPage] = useState(false);
  const [openIntegration, setOpenIntegration] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dataListShop, setDataListShop] = useState<ListShop[]>([])
  useEffect(() => {
    getUserInfo();
    getListShop();
  }, []);

  const route = useRouter();
  const searchParams = useSearchParams()

  let accessToken: any
  if (useSearchParams().values().next().value) {
    accessToken = searchParams.get('access_token')
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken)
    }
  } else {
    if (typeof window !== 'undefined') {
      accessToken = localStorage.getItem('accessToken')
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
          let data = res.data.data;
          data = _.differenceBy(data, dataListShop || [], 'name')
          setListFBPages(data);
          setOpenIntegration(true);
        }
      })
      .catch((error) => console.log(error))
      .finally(() => setIsLoadingFbPage(false));
  };

  const getListShop = async () => {
    setIsLoading(true);
    const url = `/shop/list-shop`;
    return await apiClient
      .get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => setDataListShop(res.data))
      .catch((error) => console.log(error))
      .finally(() => setIsLoading(false));
  };

  const handleClickAccess = (shopId: number) => {
    localStorage.setItem('shopId', shopId.toString())
    route.push(`/shop/${shopId}/dashbroad`);
  };

  const handleOpenModel = () => {
    setOpenModal(true);
  };

  const handleOk = async (param: { name: string; avatar: any }) => {
    const createShopFormData = new FormData();
    createShopFormData.append('name', param.name);
    createShopFormData.append('avatar', param.avatar);

    const url = `/user/create-shop`;

    return await apiClient
      .post(url, createShopFormData, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          // 'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => console.log(res))
      .catch((error) => console.log(error));
  };

  const handleCreateShopFb = async (param: {name: string, avatar: string, fb_shop_id: string}) => {
    const url = `${getHostName()}/user/integrate-fb-shop`;

    return await axios.post(url, param, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    }).then(res => console.log(res))
      .catch(error => console.log(error))
  }

  const handleCancel = () => {
    setOpenModal(false);
  };

  return (
    <Layout className="w-full min-h-screen px-4">
      <HeaderAction isShowSearch={false} title="Danh sách cửa hàng" />
      <Content className="p-8">
        <Space className="w-full justify-end" align="center">
          <Button type="primary" onClick={getListShop} icon={<SyncOutlined />}>
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
            Tích hợp cửa hàng
          </Button>
          <AddModel open={openModal} onOk={handleOk} onCancel={handleCancel} />
        </Space>
        <Space className="gap-10 mt-10 justify-center w-full">
          {dataListShop?.map((shop) => {
            return (
              <Card
                key={shop.id}
                className="w-[300px] min-h-[250px]"
                title={
                  <div className="p-5 text-center">
                    <Avatar src={shop.avatar} icon={<UserOutlined />} size={80} />
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
                    onClick={() => handleCreateShopFb({name: page.name, avatar: page.picture.data.url, fb_shop_id: page.id})}
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
