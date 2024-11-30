"use client";

import apiClient from "@/service/auth";
import { getHostName } from "@/utils/tools";
import {
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
  LoginOutlined,
  PlusCircleOutlined,
  SyncOutlined,
  ThunderboltOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Image,
  Layout,
  message,
  Modal,
  notification,
  Popconfirm,
  Space,
  Tooltip,
} from "antd";
import axios from "axios";
import _ from "lodash";
import { useRouter, useSearchParams } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import HeaderAction from "../HeaderAction/HeaderAction";
import AddModal from "./Modal/ModalAdd";
import { AppDispatch, RootState } from "@/store";
import { connect } from "react-redux";
import { getUserProfile } from "@/action/user.action";
import { getCurrentShop } from "@/action/shop.action";
import { LayoutStyled } from "@/styles/layoutStyle";

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

interface OverviewProps
  extends ReturnType<typeof mapStateToProps>,
  ReturnType<typeof mapDispatchToProps> { }

function Overview(props: OverviewProps) {
  const { getCurrentUser, currentUser } = props;

  const [listFBPages, setListFBPages] = useState<FBShopProps[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [isLoadingFbPage, setIsLoadingFbPage] = useState(false);
  const [openIntegration, setOpenIntegration] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dataListShop, setDataListShop] = useState<ListShop[]>([]);
  useEffect(() => {
    getListShop();
    getCurrentUser();
  }, []);

  const route = useRouter();
  const searchParams = useSearchParams();

  let accessToken: any;
  if (useSearchParams().values().next().value) {
    accessToken = searchParams.get("access_token");
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", accessToken);
    }
  } else {
    if (typeof window !== "undefined") {
      accessToken = localStorage.getItem("accessToken");
    }
  }

  const getListPage = async () => {
    setIsLoadingFbPage(true);
    const access_token = currentUser ? currentUser.access_token : "";
    const url = `https://graph.facebook.com/v21.0/me/accounts?fields=name,picture,category&access_token=${access_token}`;
    return await axios
      .get(url)
      .then((res) => {
        setIsLoadingFbPage(false);
        if (res.status == 200) {
          let data = res.data.data;
          data = _.differenceBy(data, dataListShop || [], "name");
          setListFBPages(data);
          setOpenIntegration(true);
        }
      })
      .catch((error) => {
        notification.error({
          message: "Lấy danh sách cửa hàng thất bại",
          description: error.response.data.message,
        });

        setIsLoadingFbPage(false);
      })
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
      .then((res) => {
        setDataListShop(res.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        notification.error({
          message: "Lấy danh sách cửa hàng thất bại",
          description: error.response.data.message,
        });
      })
  };

  const handleClickAccess = async (shopId: number) => {
    localStorage.setItem("shopId", shopId.toString());
    await props.getCurrentShop({ shopId });
    setTimeout(() => {
      route.push(`/shop/${shopId}/dashbroad`);
    }, 1000);
  };

  const handleOpenModel = () => {
    setOpenModal(true);
  };

  const handleOk = async (param: { name: string; avatar: any }) => {
    if (!param.name || !param.avatar) {
      message.error("Thiếu hình đại diện");
      return;
    }

    const createShopFormData = new FormData();
    createShopFormData.append("name", param.name);
    createShopFormData.append("avatar", param.avatar);

    console.log("FormData Preview:", Array.from(createShopFormData.entries()));

    const url = `/user/create-shop`;
    try {
      await apiClient
        .post(url, createShopFormData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        })
      setOpenModal(false)
      message.success("Thêm cửa hàng thành công!")
      getListShop()
    } catch (error) {
      console.log("Error:", error)
    }
    // return await apiClient
    //   .post(url, createShopFormData, {
    //     headers: {
    //       Authorization: `Bearer ${accessToken}`,
    //       "Content-Type": "multipart/form-data",
    //     },
    //   })
    //   .then(message.success("Thêm cửa hàng thành công!"))
    //   .then(() => setOpenModal(false))
    //   .then(() => getListShop())
    //   .catch((error) => console.log("Error:", error));
  };


  const handleCreateShopFb = async (param: { name: string, avatar: string, fb_shop_id: string }) => {
    const url = `${getHostName()}/user/integrate-fb-shop`;

    return await apiClient.post(url, param, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    }).then(res => console.log(res))
      .catch(error => console.log(error))
  }

  const handleCancel = () => {
    setOpenModal(false);
  };
  const handleDeleteShop = async (shopId: any) => {
    try {
      await apiClient.delete(`/shop/${shopId}`)
      message.success('Xóa cửa hàng thành công')
      window.location.reload() 
    } catch (error) {
      console.log(error)
      message.error('Xóa cửa hàng thất bại')

    }
  }
  return (
    <Layout className="w-full min-h-screen">
      <HeaderAction isShowSearch={false} title="Danh sách cửa hàng" />
      <LayoutStyled className="bg-slate-200">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <LoadingOutlined size={64} />
          </div>
        ) : (
          <Fragment>
            <Space className="w-full justify-end" align="center">
              <Button
                type="primary"
                onClick={getListShop}
                icon={<SyncOutlined />}
              >
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
              <AddModal
                open={openModal}
                onOk={handleOk}
                onCancel={handleCancel}
              />
            </Space>
            <Space className="grid grid-cols-2 xl:grid-cols-3 gap-7 mx-auto h-full mt-10 justify-center max-w-fit ">
              {dataListShop?.map((shop) => {
                return (
                  <Card
                    key={shop.id}
                    className="w-[300px] min-h-[250px]"
                    title={
                      <div className="p-5 text-center">
                        <Avatar
                          src={shop.avatar}
                          icon={<UserOutlined />}
                          size={80}
                        />
                        <h1 className="mt-4">{shop.name}</h1>
                      </div>
                    }
                    actions={[
                      <Tooltip key="edit" title="Cập nhật cửa hàng">
                        <EditOutlined />
                      </Tooltip>,
                      <Tooltip key="delete" title="Xóa cửa hàng">
                        <Popconfirm
                          title="Xóa cửa hàng"
                          description="Bạn chắc chắn muốn xóa?"
                          onConfirm={() => handleDeleteShop(shop.id)}
                          // onCancel={cancel}
                          okText="Xóa"
                          cancelText="Hủy"
                        >
                          <DeleteOutlined />

                        </Popconfirm>

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
                        onClick={() =>
                          handleCreateShopFb({
                            name: page.name,
                            avatar: page.picture.data.url,
                            fb_shop_id: page.id,
                          })
                        }
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
          </Fragment>
        )}
      </LayoutStyled>
    </Layout>
  );
}

const mapStateToProps = (state: RootState) => {
  return {
    currentUser: state.userReducer.user,
  };
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
    getCurrentUser: () => dispatch(getUserProfile()),
    getCurrentShop: (data: any) => dispatch(getCurrentShop(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Overview);
