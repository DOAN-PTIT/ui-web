import moment from "moment";
import { AppDispatch, RootState } from "@/store";
import { Gift, ShoppingCart } from "@phosphor-icons/react";
import {
  Button,
  Card,
  Col,
  Collapse,
  DatePicker,
  Divider,
  Input,
  Layout,
  Modal,
  notification,
  Radio,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Tag,
} from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import type { CollapseProps, TableProps } from "antd";
import ProductSearchBar from "../ProductSearchBar/ProductSearchBar";
import { DeleteOutlined } from "@ant-design/icons";
import { formatNumber } from "@/utils/tools";
import apiClient from "@/service/auth";
import { connect } from "react-redux";
import CustomDatePicker from "../CustomDatePicker";
import CustomInputNumber from "@/container/CustomInputNumber";

interface PromotionDetailProps
  extends ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps> {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  selectedRowKey?: number;
}

const PromotionDetail = (props: PromotionDetailProps) => {
  const { open, setOpen, currentShop, selectedRowKey } = props;

  const [typePromotion, setTypePromotion] = useState(0);
  const [modalTitle, setModalTitle] = useState(
    "Thêm mới chương trình khuyến mãi"
  );
  const [selectedProduct, setSelectedProduct] = useState<any[]>([]);
  const [promotionParams, setPromotionParams] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedProduct.length > 0) {
      setPromotionParams((prevState: any) => {
        return {
          ...prevState,
          promotion_items: selectedProduct.map((variation) => {
            return {
              variation: variation,
              discount: 0,
              is_discount_percent: false,
              max_discount: 0,
            };
          }),
        };
      });
    }
  }, [selectedProduct]);

  useEffect(() => {
    if (selectedRowKey) {
      getPromotionDetail();
    }
  }, [selectedRowKey]);

  const getPromotionDetail = async () => {
    setLoading(true);
    try {
      const url = `shop/${currentShop.id}/promotion/${selectedRowKey}`;
      return await apiClient
        .get(url)
        .then((res) => {
          setPromotionParams(res.data);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          notification.error({
            message: "Lỗi",
            description: error?.response?.data?.message || "Lỗi không xác định",
          });
        });
    } catch (error) {}
  };

  const promotionType = [
    {
      key: 1,
      label: "Khuyến mãi chung",
      icon: <Gift size={22} color="#34df37" weight="fill" />,
      description: () => {
        return (
          <ul>
            <li>Sản phẩm A, B được giảm 10%</li>
            <li className="mt-3">
              Sản phâm A, B có mẫu mã A1, B2 được giam 100.000 đ
            </li>
          </ul>
        );
      },
    },
    {
      key: 2,
      label: "Khuyến mãi theo giá đơn hàng",
      icon: <ShoppingCart size={22} color="#df3434" weight="fill" />,
      description: () => {
        return (
          <ul>
            <li>Đơn hàng từ 1.000.000 đ trở lên được giảm 10.000 đ</li>
            <li className="mt-3">
              Đơn hàng từ 2.000.000 đ trở lên được giảm 20%
            </li>
          </ul>
        );
      },
    },
  ];

  const handleCreatePromotion = async () => {
    setLoading(true);
    try {
      const url = `/shop/${currentShop.id}/promotion/create`;
      return apiClient
        .post(url, promotionParams)
        .then((res) => {
          setLoading(false);
          notification.success({
            message: "Tạo khuyến mãi thành công",
          });
          setOpen(false);
        })
        .catch((error) => {
          setLoading(false);
          const message =
            error?.response?.data?.message || "Lỗi không xác định";
          notification.error({
            message: "Tạo khuyến mãi thất bại",
            description: message,
          });
        });
    } catch (error) {
      console.log(error);
    }
  };

  const renderChooseTypePromotion = () => {
    return (
      <Space
        size={"large"}
        className="w-full bg-gray-300 p-4"
        direction="horizontal"
      >
        {promotionType.map((type) => {
          return (
            <div className="flex p-5 border bg-white border-gray-200 rounded-lg flex-col justify-between gap-4 w-[350px] h-[250px]">
              <div>
                <div className="flex gap-3">
                  <p>{type.icon}</p>
                  <p className="font-bold">{type.label}</p>
                </div>
                <div className="my-4">{type.description()}</div>
              </div>
              <div className="text-right">
                <Button
                  type="primary"
                  onClick={() => {
                    setTypePromotion(type.key);
                    setModalTitle(
                      `Thêm mới chương trình khuyến mãi: ${type.label}`
                    );
                  }}
                >
                  Tạo mới
                </Button>
              </div>
            </div>
          );
        })}
      </Space>
    );
  };

  const renderCommonsPromotionContent = () => {
    const itemsCollapse: CollapseProps["items"] = [
      {
        key: "order",
        label: <div className="font-medium">Theo đơn hàng</div>,
        children: (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <p>Tại quầy/ Online</p>
              <Select
                defaultValue={1}
                className="w-1/4"
                value={promotionParams?.condition?.order_type}
                onChange={(value) => {
                  setPromotionParams((prevState: any) => {
                    return {
                      ...prevState,
                      condition: {
                        ...prevState.condition,
                        order_type: value,
                      },
                    };
                  });
                }}
              >
                <Select.Option value={1}>Tất cả</Select.Option>
                <Select.Option value={2}>Tại quầy</Select.Option>
                <Select.Option value={3}>Online</Select.Option>
              </Select>
            </div>
            <div className="flex justify-between">
              <p>Tổng số lượng sản phẩm</p>
              <Input
                className="w-1/4"
                value={promotionParams?.condition?.order_quantity}
                placeholder="Tổng số lượng sản phẩm trong đơn hàng"
                onChange={(e) => {
                  setPromotionParams((prevState: any) => {
                    return {
                      ...prevState,
                      condition: {
                        ...prevState.condition,
                        order_quantity: e.target.value,
                      },
                    };
                  });
                }}
              />
            </div>
          </div>
        ),
        className: "bg-white rounded-lg",
      },
    ];

    return (
      <Layout.Content className="bg-gray-300 p-5 max-h-[600px] overflow-hidden overflow-y-scroll">
        <Row>
          <Col span={8}>
            <div className="font-bold">Thông tin cơ bán</div>
          </Col>
          <Col
            span={16}
            className="px-5 py-4 bg-white flex flex-col gap-4 rounded-lg"
          >
            <div className="flex justify-between">
              <p className="w-1/2 font-medium">Tên chương trình khuyến mãi</p>
              <Input
                className="w-1/2"
                placeholder="Nhập tên chương trình khuyến mãi"
                onChange={(e) => setPromotionParams({ name: e.target.value })}
                value={promotionParams?.name}
              />
            </div>
            <div className="flex justify-between">
              <p className="w-1/2 font-medium">Thời gian khuyến mãi</p>
              <CustomDatePicker.RangePicker
                className="w-1/2"
                value={[
                    moment(promotionParams?.start_date),
                    moment(promotionParams?.due_date),
                ]}
                showTime
                showHour
                showMinute
                format={"DD/MM/YYYY HH:mm"}
                onChange={(e: any) => {
                  setPromotionParams((prevState: any) => {
                    return {
                      ...prevState,
                      start_date: moment(e[0]).format("YYYY-MM-DD HH:mm"),
                      due_date: moment(e[1]).format("YYYY-MM-DD HH:mm"),
                    };
                  });
                }}
              />
            </div>
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col span={8}>
            <div className="font-bold">Điều kiện áp dụng</div>
          </Col>
          <Col span={16}>
            <Collapse items={itemsCollapse} />
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col span={8}>
            <div className="font-bold">Phạm vi áp dụng</div>
          </Col>
          <Col
            className="px-5 py-4 bg-white flex flex-col gap-4 rounded-lg"
            span={16}
          >
            {promotionParams.type == 1
              ? renderCommonsPromotionTable()
              : renderPromotionsByOrderPrice()}
          </Col>
        </Row>
      </Layout.Content>
    );
  };

  const renderFooter = () => {
    return (
      <div className="p-3">
        <Button type="primary" onClick={handleCreatePromotion}>
          Tạo
        </Button>
      </div>
    );
  };

  const renderCommonsPromotionTable = () => {
    const columns: TableProps["columns"] = [
      {
        key: "product_name",
        dataIndex: "product_name",
        title: "Tên sản phẩm",
        width: "20%",
        ellipsis: true,
      },
      {
        key: "retail_price",
        dataIndex: "retail_price",
        title: "Giá bán",
      },
      {
        key: "discount",
        dataIndex: "discount",
        title: "Giảm giá",
        width: "30%",
        render: (value, record: any, index: number) => {
          const { discount, max_discount, is_discount_percent } = value;
          const addonBefore = is_discount_percent && "Tối đa";
          return (
            <div>
              {is_discount_percent && (
                <CustomInputNumber
                  type="percent"
                  variant="filled"
                  value={discount}
                  className="mb-3 w-full"
                  onChange={(e) =>
                    setPromotionParams((prevState: any) => {
                      return {
                        ...prevState,
                        promotion_items: prevState.promotion_items.map(
                          (item: any, idx: number) => {
                            if (idx === index) {
                              return {
                                ...item,
                                discount: e || 0,
                              };
                            }
                            return item;
                          }
                        ),
                      };
                    })
                  }
                />
              )}
              <CustomInputNumber
                variant="filled"
                type="price"
                className="w-full"
                value={is_discount_percent ? max_discount : discount}
                onChange={(e) =>
                  setPromotionParams((prevState: any) => {
                    return {
                      ...prevState,
                      promotion_items: prevState.promotion_items.map(
                        (item: any, idx: number) => {
                          if (idx === index) {
                            const field = is_discount_percent
                              ? "max_discount"
                              : "discount";
                            return {
                              ...item,
                              [field]: e || 0,
                            };
                          }
                          return item;
                        }
                      ),
                    };
                  })
                }
              />
            </div>
          );
        },
      },
      {
        key: "is_discount_percent",
        dataIndex: "is_discount_percent",
        title: "Loại",
        render: (_: any, record: any, index: number) => {
          return (
            <Radio.Group
              defaultValue={false}
              onChange={(e) =>
                setPromotionParams((prevState: any) => {
                  return {
                    ...prevState,
                    promotion_items: prevState.promotion_items.map(
                      (item: any, idx: number) => {
                        if (idx === index) {
                          return {
                            ...item,
                            is_discount_percent: e.target.value,
                          };
                        }
                        return item;
                      }
                    ),
                  };
                })
              }
            >
              <Radio value={false}>đ</Radio>
              <Radio value={true}>%</Radio>
            </Radio.Group>
          );
        },
      },
      {
        key: "delete",
        dataIndex: "delete",
        width: "8%",
      },
    ];

    const dataSource =
      promotionParams.promotion_items
        ? promotionParams.promotion_items.map((item: any) => {
            return {
              key: item.variation.id,
              product_name: (
                <div>
                  <p className="text-ellipsis overflow-hidden">
                    {item.variation.product.name}
                  </p>
                  <Tag className="bg-red-100 text-red-500 border-red-600">
                    {item.variation.variation_code || item.variation.id}
                  </Tag>
                </div>
              ),
              retail_price: `${formatNumber(
                item.variation.retail_price,
                "VND"
              )} đ`,
              discount: {
                discount: item.discount,
                max_discount: item.max_discount,
                is_discount_percent: item.is_discount_percent,
              },
              is_discount_percent: item.is_discount_percent,
              delete: <DeleteOutlined />,
            };
          })
        : [];

    return (
      <div>
        <div className="flex mb-4">
          <div className="w-1/2 mr-5 font-medium">Áp dụng cho sản phẩm</div>
          <ProductSearchBar
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
          />
        </div>
        <Table dataSource={dataSource} columns={columns} pagination={false} />
      </div>
    );
  };

  const renderPromotionsByOrderPrice = () => {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="font-medium">Loại giảm giá: </p>
          <Radio.Group
            defaultValue={false}
            value={promotionParams?.order_range?.is_discount_percent}
            onChange={(e) =>
              onChangeOrderRange("is_discount_percent", e.target.value)
            }
          >
            <Radio value={false}>Tiền mặt</Radio>
            <Radio value={true}>Phần trăm</Radio>
          </Radio.Group>
        </div>
        <div className="flex items-center justify-between">
          <p className="font-medium">Giá trị tối thiểu: </p>
          <CustomInputNumber
            value={promotionParams?.order_range?.min_value}
            className="w-1/2"
            onChange={(e) => onChangeOrderRange("min_value", e || 0)}
            type="price"
          />
        </div>
        <div className="flex items-center justify-between">
          <p className="font-medium">Giá trị tối đa: </p>
          <CustomInputNumber
            type="price"
            value={promotionParams?.order_range?.max_value}
            className="w-1/2"
            onChange={(e) => onChangeOrderRange("max_value", e || 0)}
          />
        </div>
        <div className="flex items-center justify-between">
          <p className="font-medium">Chiết khấu: </p>
          <CustomInputNumber
            type={
              promotionParams?.order_range?.is_discount_percent ? "percent" : "price"
            }
            className="w-1/2"
            value={promotionParams?.order_range?.discount}
            onChange={(e) => onChangeOrderRange("discount", e || 0)}
          />
        </div>
        <div className="flex items-center justify-between">
          <p className="font-medium">Giảm tối đa: </p>
          <CustomInputNumber
            type="price"
            value={promotionParams?.order_range?.max_discount}
            className="w-1/2"
            onChange={(e) => onChangeOrderRange("max_discount", e || 0)}
          />
        </div>
      </div>
    );
  };

  const onChangeOrderRange = (key: string, value: any) => {
    setPromotionParams((prevState: any) => {
      return {
        ...prevState,
        order_range: {
          ...prevState.order_range,
          [key]: value,
        },
      };
    });
  };

  const renderContent = () => {
    if (promotionParams) {
      return renderCommonsPromotionContent();
    }

    return renderChooseTypePromotion();
  };

  return (
    <Modal
      width={1200}
      title={<div className="px-5 py-3">{modalTitle}</div>}
      open={open}
      footer={typePromotion ? renderFooter() : null}
      styles={{
        content: {
          padding: "0px",
        },
      }}
      onCancel={() => setOpen(false)}
    >
      {loading ? (
        <div className="flex items-center justify-center h-[600px]">
          <span className="mr-3 font-medium text-[18px]">Chờ chút xíu bạn nhé...</span> <Spin />
        </div>
      ) : (
        renderContent()
      )}
    </Modal>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    currentShop: state.shopReducer.shop,
  };
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(PromotionDetail);
