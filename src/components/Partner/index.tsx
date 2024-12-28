import {
  Breadcrumb,
  Button,
  Card,
  Divider,
  Empty,
  Input,
  Layout,
  Modal,
  notification,
  Popover,
  Row,
  Space,
  Spin,
} from "antd";
import HeaderAction from "../HeaderAction/HeaderAction";
import { RootState } from "@/store";
import { connect } from "react-redux";
import { LayoutStyled } from "@/styles/layoutStyle";
import { useEffect, useState } from "react";
import apiClient from "@/service/auth";
import Image from "next/image";
import Link from "next/link";
import { SettingOutlined } from "@ant-design/icons";

interface PartnerProps extends ReturnType<typeof mapStateToProps> {}

const Partner = (props: PartnerProps) => {
  const { currentShop } = props;

  const [partersNonActive, setPartersNonActive] = useState([]);
  const [partersActive, setPartersActive] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedParter, setSelectedParter] = useState<any>();
  const [price, setPrice] = useState<any>(0);

  useEffect(() => {
    getListShopParter();
  }, [currentShop.id]);

  const getActiveParter = async () => {
    const url = `/shop/${currentShop.id}/shop-partner/active`;
    return await apiClient
      .get(url)
      .then((res) => {
        setPartersActive(res.data);
      })
      .catch((err) => console.log(err));
  };

  const getNonActiveParter = async () => {
    const url = `/shop/${currentShop.id}/shop-partner/non-active`;
    return await apiClient
      .get(url)
      .then((res) => {
        setPartersNonActive(res.data);
      })
      .catch((err) => console.log(err));
  };

  const getListShopParter = async () => {
    setLoading(true);
    return await Promise.all([getActiveParter(), getNonActiveParter()])
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handleActiveParter = async (parterId: number) => {
    const url = `/shop/${currentShop.id}/shop-partner/${parterId}/active`;
    return await apiClient
      .post(url, { price })
      .then(() => {
        notification.success({
          message: "Kích hoạt đơn vị vận chuyển thành công",
        });
        getListShopParter();
        setVisible(false);
      })
      .catch(() => {
        notification.error({
          message: "Kích hoạt đơn vị vận chuyển thất bại",
        });
      });
  };

  const showModalActive = () => {
    return (
      <Modal
        open={visible}
        closable={false}
        title={
          <p className="mb-4">
            Kích hoạt đơn vị vận chuyển: {selectedParter.name}
          </p>
        }
        footer={[
          <Button
            type="primary"
            onClick={() => handleActiveParter(selectedParter.id)}
          >
            Kích hoạt
          </Button>,
          <Button onClick={() => setVisible(false)}>Quay lại</Button>,
        ]}
      >
        <div>
          <div className="flex gap-3 mb-4">
            <Image
              src={selectedParter.image}
              alt={selectedParter.name}
              width={100}
              height={100}
            />
            <p className="text-xl font-medium">{selectedParter.name}</p>
          </div>
          <div className="w-full h-[1px] bg-slate-200 my-2"></div>
          <div className="flex justify-between mt-4 mb-3">
            <p className="font-medium w-1/3 items-center">Phí vận chuyển</p>
            <Input
              placeholder="Nhập phí vận chuyển"
              value={price}
              onChange={(e: any) => setPrice(e.target.value)}
              type="number"
              min={0}
            />
          </div>
        </div>
      </Modal>
    );
  };

  const limkHomePartner = (partner: any) => {
    switch (partner.name) {
      case "Giao Hàng Tiết Kiệm":
        return "https://ghtk.vn/";
      case "Viettel Post":
        return "https://id.viettelpost.vn/Account/Login?ReturnUrl=%2Fconnect%2Fauthorize%2Fcallback%3Fclient_id%3Dvtp.web%26secret%3Dvtp-web%26scope%3Dopenid%2520profile%2520se-public-api%2520offline_access%26response_type%3Did_token%2520token%26state%3Dabc%26redirect_uri%3Dhttps%253A%252F%252Fviettelpost.vn%252Fstart%252Flogin%26nonce%3D1gmgj2fxy7k4gxoehsz9r";
      case "Vietnam Post":
        return "https://www.vnpost.vn/";
      case "SPX Express":
        return "https://spx.vn/";
      case "J&T":
        return "https://jtexpress.vn/vi";
      case "Ninja Van":
        return "https://ninjavan.vn/";
      case "Giao Hàng Nhanh":
        return "https://ghn.vn/";
      case "TikiNOW":
        return "https://tiki.vn/hoi-vien-tikinow";
      case "Tiki FFM":
        return "https://account.tiki.vn/login?username=";
      default:
        return null;
    }
  };

  const renderNonActiveParter = () => {
    const nonExistPartner = partersNonActive.filter((item: any) => {
      const existInActive = partersActive.find(
        (active: any) => active.delivery_company.id === item.id
      );
      return !existInActive;
    });
    return (
      <div className="grid grid-cols-4 gap-5">
        {nonExistPartner.map((partner: any) => {
          return (
            <div className="p-4 border border-solid  border-gray-100 rounded-md bg-slate-200">
              <div className="flex h-1/2 mb-4">
                <Image
                  src={partner.image}
                  alt={partner.name}
                  width={48}
                  height={48}
                />
                <div className=" mb-4 ml-4">
                  <p className="font-medium">{partner.name}</p>
                  <Link
                    className="text-sky-600 font-medium"
                    href={limkHomePartner(partner) || ""}
                    target="_blank"
                  >
                    Trang chủ
                  </Link>
                </div>
              </div>
              <div className="w-full">
                <Button
                  className="w-full"
                  onClick={() => {
                    setPrice(0);
                    setSelectedParter(partner);
                    setVisible(true);
                  }}
                >
                  Kết nối
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const handleUpdatePrice = async (id: any) => {
    const url = `/shop/${currentShop.id}/shop-partner/${id}/update-price`;
    return await apiClient
      .post(url, { price })
      .then(() => {
        notification.success({
          message: "Cập nhật phí vận chuyển thành công",
        });
        getListShopParter();
        setVisible(false);
      })
      .catch(() => {
        notification.error({
          message: "Cập nhật phí vận chuyển thất bại",
        });
      });
  };

  const handleNonActiveParter = async (id: number) => {
    const url = `/shop/${currentShop.id}/shop-partner/${id}/non-active`;
    return await apiClient
      .post(url)
      .then(() => {
        notification.success({
          message: "Huỷ kết nối đơn vị vận chuyển thành công",
        });
        getListShopParter();
      })
      .catch(() => {
        notification.error({
          message: "Huỷ kết nối đơn vị vận chuyển thất bại",
        });
      });
  };

  const renderActiveParter = () => {
    return (
      <div className="grid grid-cols-4 gap-5">
        {partersActive.map((partner: any) => {
          const deliveryCompany = partner.delivery_company;
          return (
            <div className="p-4 border border-solid  border-yellow-300 rounded-md bg-yellow-200">
              <div className="flex h-1/2 mb-4 justify-between">
                <div className="flex">
                  <Image
                    src={deliveryCompany.image}
                    alt={deliveryCompany.name}
                    width={48}
                    height={48}
                  />
                  <div className=" mb-4 ml-4">
                    <p className="font-medium">{deliveryCompany.name}</p>
                    <Link
                      className="text-sky-600 font-medium"
                      href={limkHomePartner(deliveryCompany) || ""}
                      target="_blank"
                    >
                      Trang chủ
                    </Link>
                  </div>
                </div>
                <Popover
                  content={() => (
                    <div className="w-[364px]">
                      <div className="flex">
                        <p className="font-medium w-1/2">Phí vận chuyển</p>
                        <Input
                          type="number"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="w-1/2"
                        />
                      </div>
                      <div className="text-right mt-3">
                        <Button type="primary" onClick={() =>  handleUpdatePrice(partner.id)}>
                          Lưu
                        </Button>
                      </div>
                    </div>
                  )}
                  trigger={["click"]}
                >
                  <div className="ml-5 text-sky-600 cursor-pointer" onClick={() => setPrice(partner.price)}>
                    <SettingOutlined />
                  </div>
                </Popover>
              </div>
              <div className="w-full">
                <Button className="w-full" onClick={() => handleNonActiveParter(partner.id)}>
                  Huỷ kết nối
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Layout>
      <HeaderAction title="Đơn vị vận chuyển" isShowSearch={false} />
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item href={`/shop/${currentShop.id}/settings`}>
          Cấu hình
        </Breadcrumb.Item>
        <Breadcrumb.Item href={`/shop/${currentShop.id}/settings`}>
          Cửa hàng
        </Breadcrumb.Item>
        <Breadcrumb.Item className="mt-3 text-sm text-[#0050b3] font-medium">
          Đơn vị vận chuyển
        </Breadcrumb.Item>
      </Breadcrumb>
      <LayoutStyled className="bg-white">
        {loading ? (
          <div className="w-full flex items-center justify-center h-[500px] font-medium">
            Đợi chút bạn nhé.... <Spin size="small" />
          </div>
        ) : (
          <Layout.Content>
            <Row className="flex-col">
              <div className="font-[600] text-xl mb-5">Được đề xuất</div>
              {partersNonActive.length > 0 ? (
                renderNonActiveParter()
              ) : (
                <div className="h-full w-full">
                  Không có đơn vị vận chuyển nào được đề xuất
                </div>
              )}
            </Row>
            <Divider />
            <Row className="flex-col">
              <div className="font-[600] text-xl mb-5">
                Đơn vị vận chuyển đã kết nối
              </div>
              {partersActive.length > 0 ? (
                renderActiveParter()
              ) : (
                <div className="h-full w-full">
                  <Empty description="Không có đơn vị vận chuyển nào được kết nối" />
                </div>
              )}
            </Row>
          </Layout.Content>
        )}
      </LayoutStyled>
      {visible && showModalActive()}
    </Layout>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    currentShop: state.shopReducer.shop,
  };
};

export default connect(mapStateToProps, {})(Partner);
