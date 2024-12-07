import {
  createProduct,
  getListProduct,
  getListProductFBShop,
} from "@/action/product.action";
import { createVariation } from "@/action/variation.action";
import { AppDispatch, RootState } from "@/store";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Image,
  Input,
  Layout,
  Modal,
  notification,
  Row,
  Select,
  Switch,
  Table,
  TableProps,
  Tooltip,
} from "antd";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { connect } from "react-redux";
import defaultImage from "../../assets/default.png";
import { ModalUpLoad } from "./ModalUpload";
import axios from "axios";

interface VariationProps {
  id: string;
  iamge: string;
  barcode: string;
  salePrice: number;
  amount: number;
  index?: number;
}

interface ProductDetailProps
  extends ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps> {
  typeView: string;
  modalVisiable: boolean;
  setModalVisiable: Dispatch<SetStateAction<boolean>>;
  product?: any;
}

function ProductDetail(props: ProductDetailProps) {
  const {
    createProduct,
    getListProduct,
    createVariation,
    currentShop,
    setModalVisiable,
    modalVisiable,
    currentUser,
  } = props;

  const [createProductParams, setCreateProductParams] = useState<any>({});
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [variationData, setVariationData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFacebookShop, setIsFacebookShop] = useState(false);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(false);
  const [listFacebookCatalog, setListFacebookCatalog] = useState<any[]>([]);
  const [selectedCatalog, setSelectedCatalog] = useState<any>();

  interface VariationParam {
    index: number;
    [key: string]: any;
  }

  const [createVariationParams, setCreateVariationParams] = useState<
    VariationParam[]
  >([]);

  useEffect(() => {
    if (currentShop.fb_shop_id) {
      setIsFacebookShop(true);
    }
  }, [currentShop.fb_shop_id]);

  const handleDeleteVariationColumn = (index: any) => {
    const indexSelectedColumn = variationData.findIndex(
      (item: any) => item.index === index
    );

    const newVariationData = [...variationData];
    newVariationData.splice(indexSelectedColumn, 1);
    setVariationData(newVariationData);
  };

  const columnsVariation: TableProps<VariationProps>["columns"] = [
    {
      key: "ID",
      dataIndex: "id",
      title: "Mẫu mã",
      width: 120,
      fixed: "left",
    },
    {
      key: "IMAGE",
      dataIndex: "image",
      title: "Hình ảnh",
      width: 120,
      fixed: "left",
    },
    {
      key: "BARCODE",
      dataIndex: "barcode",
      title: "Mã vạch",
    },
    {
      key: "SALE PRICE",
      dataIndex: "salePrice",
      title: "Giá bán",
    },
    {
      key: "AMOUNT",
      dataIndex: "amount",
      title: "Số lượng",
    },
  ];

  columnsVariation.push({
    key: "DELETE",
    title: "",
    width: 60,
    fixed: "right",
    render: (_, record) => {
      return (
        <Button
          icon={<DeleteOutlined />}
          danger
          style={{ border: "none", boxShadow: "none", background: "none" }}
          onClick={() => handleDeleteVariationColumn(record.index)}
        />
      );
    },
  });

  const getDataVariation: () => TableProps<VariationProps>["dataSource"] =
    () => {
      return variationData;
    };

  const handleCreateProduct = async () => {
    try {
      const res = await createProduct({
        ...createProductParams,
        shopId: currentShop.id,
      });

      if (res.payload) {
        const { id: product_id } = res.payload;

        const resultArr: any = [];
        for (const variation of createVariationParams) {
          delete variation.index;
          const result = await createVariation({
            ...variation,
            shop_id: currentShop.id,
            product_id,
          });

          if (result.payload) resultArr.push(result.payload);
        }

        const variations = resultArr.filter((item) => item.id);
        const product = res.payload;

        if (variations.length > 0 && selectedCatalog) {
          handleSyncProductToFacebook({ ...product, variations });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const renderTitleVariation = () => {
    return (
      <div className="flex justify-between">
        <Input.Search placeholder="Tìm kiếm mẫu mã" className="w-[180px]" />
        <Button
          icon={<PlusOutlined />}
          type="primary"
          onClick={handleAddVariationColumn}
        >
          Thêm mẫu mã
        </Button>
      </div>
    );
  };

  const handleAddVariationColumn = () => {
    const newVariationData = [...variationData];
    const newVariation = {
      id: <Input name="variation_code" />,
      image: (
        <>
          <Image
            alt=""
            onClick={() => setIsOpenModal(true)}
            src={defaultImage.src}
            preview={false}
            className="cursor-pointer"
          />
        </>
      ),
      barcode: <Input name="barcode" />,
      salePrice: <Input name="retail_price" />,
      amount: <Input name="amount" />,
    } as never;
    newVariationData.unshift(newVariation);

    setVariationData(newVariationData);
  };

  const getFBCatalog = async () => {
    setIsLoadingCatalog(true);
    try {
      const { access_token } = currentUser;
      const facebookShopId = currentShop.fb_shop_id;
      const url = `https://graph.facebook.com/v21.0/${facebookShopId}/product_catalogs?fields=name%2Cproduct_count&access_token=${access_token}`;
      return await axios
        .get(url)
        .then((res) => {
          setListFacebookCatalog(res.data.data);
          setIsLoadingCatalog(false);
        })
        .catch((error) => console.log(error));
    } catch (error) {
      setIsLoadingCatalog(false);
    }
  };

  const handleSyncProductToFacebook = async (product: any) => {
    try {
      const rq = product.variations.map((variation: any) => {
        return {
          method: "CREATE",
          data: {
            availability: "in stock",
            id: variation?.variation_code,
            title: product?.name || "",
            description: product?.description || "",
            image_link: variation?.image || "",
            price: `${variation?.retail_price || 0} VND`,
            condition: "new",
            link: "https://server-order-3jnp.onrender.com/",
            item_group_id: product?.product_code || "",
          },
        };
      });
      const url = `https://graph.facebook.com/v21.0/${selectedCatalog}/items_batch?access_token=${currentUser.access_token}`;
      await axios
        .post(url, {
          requests: rq,
          item_type: "PRODUCT_ITEM",
        })
        .then((res) => {
          setModalVisiable(false);
          getListProduct({ shopId: currentShop.id, page: currentPage });
        })
        .catch((error) => {
          console.log(error);
          setModalVisiable(false);
          notification.error({
            message: "Đã xảy ra lỗi khi đồng bộ sản phẩm",
            description: "Đồng bộ sản phẩm không thành công. Vui lòng thử lại",
          });
        });
    } catch (error) {}
  };

  const handleUpdateStateCreateVariation = (
    index: number,
    key: string,
    value: string | number
  ) => {
    if (!key || !value) return;

    const exitVariation = createVariationParams.find(
      (item) => item.index === index
    );
    const newVariation = {
      ...exitVariation,
      [key]: value,
      price_at_counter: 0,
      // image: defaultImage,
      index,
    };

    if (exitVariation) {
      setCreateVariationParams((prev) => {
        return prev.map((item) => {
          if (item.index === index) {
            return newVariation;
          }
          return item;
        });
      });
    } else {
      setCreateVariationParams((prev) => {
        return [...prev, newVariation];
      });
    }
  };

  const onInputChange = (key: string, value: any) => {
    setCreateProductParams((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleCancel = () => {
    setIsOpenModal(false);
  };

  const renderModalCatalog = () => {
    return (
      <Modal
        title="Chọn danh mục Facebook"
        open={listFacebookCatalog.length > 0}
        onCancel={() => {
          setListFacebookCatalog([]);
        }}
        footer={null}
      >
        <Select
          placeholder="Chọn danh mục"
          onChange={(value) => {
            setSelectedCatalog(value);
            setListFacebookCatalog([]);
          }}
          options={listFacebookCatalog.map((item) => ({
            label: item.name,
            value: item.id,
          }))}
        />
      </Modal>
    );
  };

  return (
    <Modal
      title="Thiết lập sản phẩm"
      open={modalVisiable}
      width={1200}
      styles={{
        content: { padding: 0 },
        header: { padding: 20 },
        footer: { padding: 20 },
      }}
      style={{ top: 40 }}
      onCancel={() => {
        setModalVisiable(false);
        setCreateVariationParams([]);
        setCreateProductParams({});
      }}
      onOk={handleCreateProduct}
    >
      <ModalUpLoad open={isOpenModal} onCancel={handleCancel} />
      <Layout className="p-5 h-[600px] overflow-y-scroll">
        <Row justify="space-between" className="mb-5">
          <Col span={12} className="bg-white rounded-lg shadow-sm">
            <Form layout="vertical" className="p-6">
              <Form.Item name="custom_id" label="Mã sản phẩm" required>
                <Input
                  placeholder="Mã sản phẩm"
                  name="custom_id"
                  onChange={(e) =>
                    onInputChange("product_code", e.target.value)
                  }
                />
              </Form.Item>
              <Form.Item name="product_name" label="Tên sản phẩm" required>
                <Input
                  placeholder="Tên sản phẩm"
                  name="product_name"
                  onChange={(e) => onInputChange("name", e.target.value)}
                />
              </Form.Item>
              <Form.Item name="product_note" label="Ghi chú">
                <Input.TextArea
                  placeholder="Ghi chú"
                  name="product_note"
                  onChange={(e) => onInputChange("description", e.target.value)}
                />
              </Form.Item>
            </Form>
          </Col>
          <Col span={11} className="h-fit">
            <Form
              layout="vertical"
              className="p-6 bg-white rounded-lg shadow-sm"
            >
              <Form.Item name="product_tag" label="Thẻ">
                <Select
                  options={[]}
                  placeholder="Thẻ"
                  onChange={(value) => onInputChange("product_tag", value)}
                />
              </Form.Item>
              <Form.Item label="Nhà cung cấp">
                <Select
                  options={[]}
                  placeholder="Nhà cung cấp"
                  onChange={(value) => onInputChange("supplier", value)}
                />
              </Form.Item>
            </Form>
            <div className="mt-4">
              <Tooltip
                className="flex gap-3 items-center"
                title={
                  !isFacebookShop &&
                  "Chức năng này chỉ dành cho những shop được đồng bộ từ Facebook"
                }
              >
                <Switch
                  disabled={!isFacebookShop}
                  loading={isLoadingCatalog}
                  checked={selectedCatalog ? true : false}
                  onChange={(e) => e && getFBCatalog()}
                />
                <p
                  className={`${
                    isFacebookShop ? "opacity-100" : "opacity-50"
                  } font-medium`}
                >
                  Đồng bộ sản phẩm này đến Facebook Shop
                </p>
              </Tooltip>
            </div>
          </Col>
        </Row>
        {renderModalCatalog()}
        <Table
          pagination={{
            size: "small",
            onChange: (page) => setCurrentPage(page),
          }}
          scroll={{ x: 1200, y: 500 }}
          className="shadow-sm"
          columns={columnsVariation}
          dataSource={getDataVariation()}
          title={renderTitleVariation}
          onRow={(record, rowIndex): any => {
            return {
              //current value
              onClick: (e: ChangeEvent<HTMLInputElement>) => {
                handleUpdateStateCreateVariation(
                  rowIndex as number,
                  e.target.name,
                  e.target.value
                );
              },
              // previous value
              onBlur: (e: ChangeEvent<HTMLInputElement>) => {
                handleUpdateStateCreateVariation(
                  rowIndex as number,
                  e.target.name,
                  e.target.value
                );
              },
            };
          }}
        />
      </Layout>
    </Modal>
  );
}

const mapStateToProps = (state: RootState) => {
  return {
    isLoading: state.productReducer.isLoading,
    listProduct: state.productReducer.listProduct,
    totalPage: state.productReducer.listProduct?.totalCount || 0,
    currentShop: state.shopReducer.shop,
    currentUser: state.userReducer.user,
    createProductState: state.productReducer.createProduct,
  };
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
    createProduct: (data: any) => dispatch(createProduct(data)),
    getListProduct: (data: { shopId: any; page: number }) =>
      dispatch(getListProduct(data)),
    getListProductFBShop: (data: any) => dispatch(getListProductFBShop(data)),
    createVariation: (data: any) => dispatch(createVariation(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetail);
