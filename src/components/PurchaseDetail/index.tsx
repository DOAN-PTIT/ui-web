import { AppDispatch, RootState } from "@/store";
import {
  Button,
  Col,
  Modal,
  Row,
  Select,
  Table,
  Input,
  notification,
  Tag,
  Divider,
  Spin,
  InputNumber,
} from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { connect } from "react-redux";
import type { TableProps } from "antd";
import ProductSearchBar from "../ProductSearchBar/ProductSearchBar";
import CustomDatePicker from "../CustomDatePicker";
import { DeleteOutlined } from "@ant-design/icons";
import SupplierSearchBar from "../SupplierSearchBar";
import { Debt, Purchase, PurchaseItem } from "@/utils/type";
import {
  formatInputNumber,
  formatNumber,
} from "@/utils/tools";
import moment from "moment";
import { cloneDeep } from "lodash";
import { createPurchase, updatePurchase } from "@/action/purchase.action";
import { createDebt } from "@/action/debt.action";
import apiClient from "@/service/auth";
import CustomInputNumber from "@/container/CustomInputNumber";

interface PurchaseDetailProps
  extends ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps> {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  title: string;
  purchaseId?: number;
  setPurchaseId: Dispatch<SetStateAction<number | undefined>>;
  fetchPurchases: () => Promise<void>;
}

const PurchaseDetail = (props: PurchaseDetailProps) => {
  const {
    open,
    setOpen,
    title,
    purchaseId,
    createPurchase,
    updatePurchase,
    currentUser,
    currentShop,
    setPurchaseId,
    createDebt,
    fetchPurchases,
  } = props;

  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any[]>([]);
  const [purchase, setPurchase] = useState<Purchase>({
    created_at: moment().format("DD/MM/YYYY"),
    items: [] as PurchaseItem[],
    shipping_fee: 0,
    discount: 0,
  } as Purchase);
  const [searchProductResult, setSearchProductResult] = useState<any[]>([]);
  const [supplierId, setSupplierId] = useState<number | undefined>(undefined);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (purchaseId) {
      getPurchaseDetail();
    }
  }, [purchaseId]);

  const columns: TableProps<any>["columns"] = [
    {
      title: "Mã mẫu mã",
      key: "variation_code",
      dataIndex: "variation_code",
      width: "20%",
    },
    {
      title: "Tên sản phẩm",
      key: "product_name",
      dataIndex: "product_name",
      width: "20%",
    },
    {
      title: "Số lượng",
      key: "quantity",
      dataIndex: "quantity",
      width: "10%",
      render: (text, record) => {
        return (
          <CustomInputNumber
            value={text}
            onChange={(value) =>
              onChangeInputItem(value, "quantity", record.key)
            }
            type="quantity"
            min={1}
          />
        );
      },
    },
    {
      title: "Giá nhập",
      key: "imported_price",
      dataIndex: "imported_price",
      width: "25%",
      render: (text, record) => {
        return (
          <CustomInputNumber
            value={text}
            onChange={(value) =>
              onChangeInputItem(value, "imported_price", record.key)
            }
            placeholder="Giá nhập"
            type="price"
            className="w-full"
          />
        );
      },
    },
    {
      title: "Thành tiền",
      key: "total_price",
      dataIndex: "total_price",
      align: "right",
      width: "25%",
      render: ({ price, quantity }) => {
        const total = price * quantity;
        return <span className="font-medium">{formatNumber(total)} đ</span>;
      },
    },
  ];

  columns.push({
    title: "",
    key: "delete",
    dataIndex: "delete",
    width: "1%",
    render: (text, record) => {
      return <DeleteOutlined className="text-red-400" />;
    },
  });

  const getPurchaseDetail = async () => {
    const url = `shop/${currentShop.id}/purchase/${purchaseId}`;
    setLoading(true);
    return await apiClient
      .get(url)
      .then((res) => {
        const data = res.data;
        if (data.status == 1 || data.status == 2) {
          setDisabled(true);
        }
        setPurchase(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const onChangeInputItem = (value: any, key: string, vId: number) => {
    let clontItems: any[] = cloneDeep(purchase.items) || [];
    const index = clontItems.findIndex((item) => item.variation.id == vId);
    clontItems[index][key] = value;
    setPurchase((prevState) => {
      return {
        ...prevState,
        items: clontItems,
      };
    });
  };

  const handleSelectProduct = (value: any) => {
    const index = selectedProduct.findIndex((item) => item.id == value.id);
    const variation = searchProductResult.find((item) => item.id == value);
    let clontItems: PurchaseItem[] = cloneDeep(purchase.items) || [];
    if (index === -1) {
      clontItems.push({
        variation: variation,
        quantity: 1,
        imported_price: variation.last_imported_price || 0,
      });
    } else {
      notification.warning({
        message: "Sản phẩm đã tồn tại",
        description: "Vui lòng chọn sản phẩm khác",
      });
    }

    setPurchase((prevState) => {
      return {
        ...prevState,
        items: clontItems,
      };
    });
  };

  const calcTotalProductPrice = () => {
    let total = 0;
    purchase.items?.forEach((item) => {
      total += item.quantity * item.imported_price;
    });
    return total;
  };

  const getData = () => {
    return purchase.items?.length > 0
      ? purchase.items.map((item: any) => ({
          key: item.variation.id,
          variation_code: item.variation.variation_code,
          product_name: (
            <div>
              <p>{item.variation?.product?.name}</p>
              <Tag color="green">{item.variation.product.product_code}</Tag>
            </div>
          ),
          quantity: item.quantity || 1,
          imported_price: item.imported_price || 0,
          total_price: { price: item.imported_price, quantity: item.quantity },
        }))
      : [];
  };

  const onChangeInput = (value: any, key: string) => {
    setPurchase({
      ...purchase,
      [key]: value,
    });
  };

  const handleCreatePurchase = async () => {
    const params = {
      shop_id: props.currentShop.id,
      data: {
        ...purchase,
        product_fee: calcTotalProductPrice(),
        total_price: calcTotalPrice(),
        shipping_fee: parseInt(purchase.shipping_fee.toString()),
        discount: parseInt(purchase.discount.toString()),
        created_at: moment(purchase.created_at),
        supplier_id: supplierId,
        shop_user_id: currentUser.id,
      },
    };
    setLoading(true);
    if (purchase && !purchaseId) {
      await createPurchase(params)
        .then((res) => {
          if (res.payload) {
            const data = res.payload;
            const debtParams: Debt = {
              name: `Nợ hàng #${data.id}`,
              money_must_pay: data.total_price,
              status: 0,
              supplier_id: data.supplier_id,
              purchase_id: data.id,
              shop_id: currentShop.id,
            };
            createDebt({ data: debtParams, shop_id: currentShop.id }).then(
              () => {
                setLoading(false);
                setOpen(false);
                notification.success({
                  message: "Thành công",
                  description: "Tạo phiếu nhập hàng thành công",
                });
                fetchPurchases();
              }
            );
          }
        })
        .catch((error) => {
          console.log(error);
          notification.error({
            message: "Thất bại",
            description: "Tạo phiếu nhập hàng thất bại",
          });
        });
    } else {
      await updatePurchase({ ...params, id: purchaseId })
        .then((res) => {
          setLoading(false);
          setOpen(false);
          if (res) {
            notification.success({
              message: "Thành công",
              description: "Cập nhật phiếu nhập hàng thành công",
            });
            setOpen(false);
            fetchPurchases();
          }
        })
        .catch((error) => {
          console.log(error);
          notification.error({
            message: "Thất bại",
            description: "Cập nhật phiếu nhập hàng thất bại",
          });
        });
    }
  };

  const calcTotalPrice = () => {
    let total = 0;
    total =
      parseInt(calcTotalProductPrice().toString()) +
      parseInt(purchase.shipping_fee.toString()) -
      parseInt((purchase.discount || 0).toString());
    return total;
  };

  const renderTitle = () => {
    return (
      <div className="p-4">
        <h2>{title}</h2>
      </div>
    );
  };

  const renderFormBoxPrice = () => {
    return (
      <div className="p-3 bg-white rounded-lg">
        <div className="flex justify-between flex-col mb-2">
          <h1 className="font-medium mb-2">Phí vận chuyển</h1>
          <CustomInputNumber
            value={purchase.shipping_fee}
            onChange={(value) => onChangeInput(value, "shipping_fee")}
            placeholder="Phí vận chuyển"
            type="price"
            className="w-full"
          />
        </div>
        <div className="flex justify-between flex-col mb-2">
          <h1 className="font-medium mb-2">Chiết khấu</h1>
          <CustomInputNumber
            value={purchase.discount}
            onChange={(value) => onChangeInput(value, "discount")}
            placeholder="Chiết khấu"
            type="price"
            className="w-full"
          />
        </div>
        <div className="flex justify-between flex-col mb-2">
          <h1 className="font-medium mb-2">Ngày tạo phiếu</h1>
          <CustomDatePicker
            className="w-full"
            placeholder="Ngày tạo phiếu"
            value={moment(purchase.created_at) || moment()}
            onChange={(date, dateString) => onChangeInput(date, "created_at")}
            allowClear={false}
            format={"DD/MM/YYYY"}
          />
        </div>
        <div className="flex justify-between flex-col mb-2">
          <h1 className="font-medium mb-2">Ghi chú</h1>
          <Input.TextArea
            placeholder="Ghi chú phiếu nhập"
            style={{ height: 80, resize: "none" }}
            onChange={(e) => onChangeInput(e.target.value, "description")}
            value={purchase.description}
          />
        </div>
      </div>
    );
  };

  const renderContent = () => {
    const totalPrice = calcTotalPrice();
    return (
      <Row
        className="p-4 h-full w-full overflow-hidden overflow-y-auto bg-gray-200"
        style={{ margin: 0 }}
        gutter={16}
      >
        <Col span={6} className="flex flex-col gap-4">
          <div className="p-3 bg-white rounded-lg">
            <h1 className="font-medium mb-3">Nhà cung cấp</h1>
            <SupplierSearchBar
              defaultSupplier={purchase.supplier}
              onChange={(e: any) => setSupplierId(e)}
            />
          </div>
          <ul className="p-3 bg-white rounded-lg">
            <li className="flex justify-between items-center">
              <p className="font-medium">Tiền hàng</p>
              <p className="font-medium">
                {formatNumber(calcTotalProductPrice())} đ
              </p>
            </li>
            <li className="flex justify-between items-center">
              <p className="font-medium">Phí vận chuyển</p>
              <p className="font-medium">
                {formatNumber(purchase.shipping_fee)} đ
              </p>
            </li>
            <li className="flex justify-between items-center">
              <p className="font-medium">Chiết khấu</p>
              <p className="font-medium text-red-400">
                {formatNumber(purchase.discount)} đ
              </p>
            </li>
            <li>
              <Divider />
            </li>
            <li className="flex justify-between items-center">
              <p className="font-medium">Tổng tiền</p>
              <p className="font-medium text-green-500">
                {formatNumber(totalPrice)} đ
              </p>
            </li>
          </ul>
          {renderFormBoxPrice()}
        </Col>
        <Col span={18} className="flex flex-col gap-4">
          <ProductSearchBar
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            onSelectedProduct={handleSelectProduct}
            setSearchProductResultProps={setSearchProductResult}
          />
          <Table
            summary={(data) => {
              let total = calcTotalProductPrice();
              return (
                <Table.Summary.Row className="bg-gray-100">
                  <Table.Summary.Cell
                    colSpan={1}
                    index={0}
                    className="font-medium"
                  >
                    Số lượng sản phẩm
                  </Table.Summary.Cell>
                  <Table.Summary.Cell
                    className="text-right font-bold"
                    index={3}
                    colSpan={2}
                  >
                    {data.reduce((acc, item) => {
                      return acc + parseInt(item.quantity);
                    }, 0)}{" "}
                    (sp)
                  </Table.Summary.Cell>
                  <Table.Summary.Cell
                    index={1}
                    colSpan={1}
                    className="font-medium"
                  >
                    Tổng cộng
                  </Table.Summary.Cell>
                  <Table.Summary.Cell
                    index={2}
                    className="text-right"
                    colSpan={2}
                  >
                    <span className="font-bold text-right mr-[45px]">
                      {formatNumber(total)} đ
                    </span>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              );
            }}
            columns={columns}
            dataSource={getData()}
            pagination={false}
          />
        </Col>
      </Row>
    );
  };
  const renderFooter = () => {
    return (
      <div className="p-3">
        <Button
          type="primary"
          onClick={handleCreatePurchase}
          className="font-medium p-5 text-[16px] mr-[10px]"
          loading={loading}
          disabled={disabled}
        >
          Lưu
        </Button>
      </div>
    );
  };
  return (
    <Modal
      open={open}
      onCancel={() => {
        setOpen(false);
        setPurchase({
          items: [] as PurchaseItem[],
          shipping_fee: 0,
          discount: 0,
        } as Purchase);
        setPurchaseId(undefined);
      }}
      width={"90%"}
      styles={{
        content: {
          padding: 0,
          height: "75vh",
        },
        body: {
          height: "100%",
        },
        footer: {
          height: "10%",
          margin: 0,
          backgroundColor: "white",
        },
        wrapper: {
          overflow: "hidden",
        },
      }}
      style={{ top: 50, bottom: 50, height: "100%" }}
      title={renderTitle()}
      footer={loading ? null : renderFooter()}
    >
      {loading ? (
        <div className="h-[75vh] w-[1200px] flex items-center justify-center">
          Chớ xíu bạn nhé... <Spin />
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
    currentUser: state.userReducer.user,
  };
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
    createPurchase: (params: any) => dispatch(createPurchase(params)),
    updatePurchase: (params: any) => dispatch(updatePurchase(params)),
    createDebt: (params: any) => dispatch(createDebt(params)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseDetail);
