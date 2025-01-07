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
  Divider,
  Form,
  Image,
  Input,
  Layout,
  Modal,
  notification,
  Popover,
  Row,
  Select,
  Space,
  Spin,
  Switch,
  Table,
  TableProps,
  Tooltip,
} from "antd";
import {
  ChangeEvent,
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { connect } from "react-redux";
import defaultImage from "../../assets/default.png";

import axios from "axios";
import apiClient from "@/service/auth";
import UploadFile from "./UploadFile";
import { RcFile } from "antd/es/upload";
import { unionBy } from "lodash";
import CustomInputNumber from "@/container/CustomInputNumber";
import type { InputRef } from "antd";
import { fuzzySearch } from "@/utils/tools";

interface VariationProps {
  id: string;
  iamge: string;
  barcode: string;
  retail_price: number;
  amount: number;
  index?: number;
  price_at_counter?: number;
  last_imported_price?: number;
}

interface ProductDetailProps
  extends ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps> {
  typeView: string;
  modalVisiable: boolean;
  setModalVisiable: Dispatch<SetStateAction<boolean>>;
  selectedRowKeys?: any;
  setSelectedRowKeys?: Dispatch<SetStateAction<any>>;
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
    selectedRowKeys,
    setSelectedRowKeys,
    suppliers,
  } = props;

  const [createProductParams, setCreateProductParams] = useState<any>({});
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [variationData, setVariationData] = useState<VariationProps[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFacebookShop, setIsFacebookShop] = useState(false);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(false);
  const [listFacebookCatalog, setListFacebookCatalog] = useState<any[]>([]);
  const [selectedCatalog, setSelectedCatalog] = useState<any>();
  const [selectedProduct, setSelectedProduct] = useState<any>();
  const [selectedVariation, setSelectedVariation] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [deleteVariationIds, setDeleteVariationIds] = useState<any[]>([]);
  const [uploadImageLoading, setUploadImageLoading] = useState(false);
  const [categoryName, setCategoryName] = useState<string>("");
  const [listCategories, setListCategories] = useState<any[]>([]);

  interface VariationParam {
    index?: number;
    [key: string]: any;
  }

  const [createVariationParams, setCreateVariationParams] = useState<
    VariationParam[]
  >([]);

  useEffect(() => {
    if (currentShop.fb_shop_id) {
      setIsFacebookShop(true);
    }
    selectedRowKeys && handleGetProduct();
    getCategories();
  }, [currentShop.fb_shop_id, selectedRowKeys]);

  const handleDeleteVariationColumn = (index: any) => {
    const indexSelectedColumn = variationData.findIndex(
      (item: any) => item.index === index
    );

    const newVariationData = [...variationData];
    const deleteVariation = newVariationData[indexSelectedColumn];
    if (deleteVariation.id) {
      setDeleteVariationIds((prev) => {
        return [...prev, deleteVariation.id];
      });
    }
    newVariationData.splice(indexSelectedColumn, 1);
    setVariationData(newVariationData);
  };

  const inputRef = useRef<InputRef>(null);

  const handleGetProduct = async () => {
    setIsLoading(true);
    try {
      const url = `/shop/${currentShop.id}/product/${selectedRowKeys}`;
      await apiClient
        .get(url)
        .then((res) => {
          const data = res.data;
          const suppliers_products_ids =
            data.suppliers_products.length > 0
              ? data.suppliers_products.map((item: any) => item.supplier_id)
              : [];
          setSelectedProduct(data);
          setCreateProductParams({ suppliers_products_ids, ...data });
          setVariationData(data.variations);
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const columnsVariation: TableProps<VariationProps>["columns"] = [
    {
      key: "ID",
      dataIndex: "variation_code",
      title: "Mẫu mã",
      width: 120,
      fixed: "left",
      render: (text, record) => {
        return (
          <Input
            name="variation_code"
            defaultValue={text ? text : ""}
            value={record.id}
            onChange={(e) =>
              onInputVariationChange("variation_code", e.target.value)
            }
          />
        );
      },
    },
    {
      key: "IMAGE",
      dataIndex: "image",
      title: "Hình ảnh",
      width: 120,
      fixed: "left",
      render: (text, record) => {
        return (
          <div>
            <Popover content={<UploadFile onChange={handleUploadChange} />}>
              <Image
                alt=""
                src={text ? text : defaultImage}
                preview={false}
                className="cursor-pointer"
              />
            </Popover>
          </div>
        );
      },
    },
    {
      key: "BARCODE",
      dataIndex: "barcode",
      title: "Mã vạch",
      render: (text, record) => {
        return (
          <Input
            name="barcode"
            defaultValue={text}
            value={record.barcode}
            onChange={(e) => onInputVariationChange("barcode", e.target.value)}
          />
        );
      },
    },
    {
      key: "LAST IMPORT PRICE",
      dataIndex: "last_imported_price",
      title: "Giá nhập cuối",
      render: (text, record) => {
        return (
          <CustomInputNumber
            name="last_imported_price"
            defaultValue={text}
            value={record.last_imported_price}
            onChange={(value) =>
              onInputVariationChange("last_imported_price", value || 0)
            }
            type="price"
            className="w-full"
          />
        );
      },
    },
    {
      key: "SALE PRICE",
      dataIndex: "retail_price",
      title: "Giá bán",
      render: (text, record) => {
        return (
          <CustomInputNumber
            name="retail_price"
            defaultValue={text}
            value={record.retail_price}
            onChange={(value) =>
              onInputVariationChange("retail_price", value || 0)
            }
            type="price"
            className="w-full"
          />
        );
      },
    },
    {
      key: "PRICE AT COUNTER",
      dataIndex: "price_at_counter",
      title: "Giá bán tại quầy",
      render: (text, record) => {
        return (
          <CustomInputNumber
            name="price_at_counter"
            defaultValue={text}
            value={record.price_at_counter}
            onChange={(value) =>
              onInputVariationChange("price_at_counter", value || 0)
            }
            type="price"
            className="w-full"
          />
        );
      },
    },
    {
      key: "AMOUNT",
      dataIndex: "amount",
      title: "Số lượng",
      render: (text, record) => {
        return (
          <CustomInputNumber
            name="amount"
            defaultValue={text}
            value={record.amount}
            onChange={(value) => onInputVariationChange("amount", value)}
            type="quantity"
            className="w-full"
          />
        );
      },
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

  const handleUploadChange = async (file: RcFile | null) => {
    if (file) {
      setUploadImageLoading(true);
      const url = `cloudinary/upload-image`;
      return await apiClient
        .post(
          url,
          { image: file },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((res) => {
          setUploadImageLoading(false);
          if (res.data) {
            onInputVariationChange("image", res.data);
          }
        })
        .catch((error) => {
          console.log(error);
          setUploadImageLoading(false);
          notification.error({
            message: "Đã xảy ra lỗi khi tải ảnh",
            description: "Tải ảnh không thành công. Vui lòng thử lại",
          });
        });
    }
  };

  const getDataVariation: () => TableProps<VariationProps>["dataSource"] =
    () => {
      return variationData.map((item: any) => ({
        ...item,
        id: item.variation_code,
      }));
    };

  const handleCreateProduct = async () => {
    setIsLoading(true);
    try {
      return await createProduct({
        ...createProductParams,
        shopId: currentShop.id,
      })
        .then(async (res) => {
          if (res.payload) {
            const { id: product_id } = res.payload;

            const resultArr: any = [];
            for (const variation of variationData) {
              if (variation.index !== undefined) {
                if (variation.index !== undefined) {
                  delete variation.index;
                }
              }
              await createVariation({
                ...variation,
                shop_id: currentShop.id,
                product_id,
              })
                .then((result) => {
                  if (result.payload) {
                    resultArr.push(result.payload);
                    setModalVisiable(false);
                    notification.success({
                      message: "Tạo sản phẩm thành công",
                      description: "Tạo sản phẩm thành công",
                    });
                    setIsLoading(false);
                    getListProduct({
                      shopId: currentShop.id,
                      page: currentPage,
                    });
                  }
                })
                .catch(() => {
                  setModalVisiable(false);
                  getListProduct({ shopId: currentShop.id, page: currentPage });
                  notification.error({
                    message: "Đã xảy ra lỗi khi tạo mẫu mã",
                    description:
                      "Tạo mẫu mã không thành công. Vui lòng thử lại",
                  });
                });
            }

            const variations = resultArr.filter((item: { id: any }) => item.id);
            const product = res.payload;

            if (variations.length > 0 && selectedCatalog) {
              handleSyncProductToFacebook({ ...product, variations });
            }
          }
        })
        .catch(() => {
          setModalVisiable(false);
          setIsLoading(false);
          notification.error({
            message: "Đã xảy ra lỗi khi tạo sản phẩm",
            description: "Tạo sản phẩm không thành công. Vui lòng thử lại",
          });
        });
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  const handleUpdateProduct = async () => {
    delete createProductParams.suppliers_products;
    setIsLoading(true);
    try {
      const url = `/shop/${currentShop.id}/product/update`;

      if (selectedCatalog) {
        handleSyncProductToFacebook({
          ...createProductParams,
          variations: variationData,
        });
      }
      return await apiClient
        .post(url, {
          ...createProductParams,
          variations: variationData,
          delete_variation_ids: deleteVariationIds,
        })
        .then((res) => {
          setModalVisiable(false);
          getListProduct({ shopId: currentShop.id, page: currentPage });
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
          setModalVisiable(false);
          notification.error({
            message: "Đã xảy ra lỗi khi cập nhật sản phẩm",
            description: "Cập nhật sản phẩm không thành công. Vui lòng thử lại",
          });
        });
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
      variation_code: "",
      image:
        "https://res.cloudinary.com/dzu5qbyzq/image/upload/v1732203781/product_avatar_default.webp?fbclid=IwY2xjawGsjapleHRuA2FlbQIxMAABHf18-FMV5iWxBn5H4jGAUiRGvOAp6fOLYfNBFwGzJr3_hQfp7Kbutp1JbQ_aem_Kqm41MSZ_WUiveMINit8Iw",
      price_at_counter: "",
      barcode: "",
      retail_price: "",
      amount: "",
      last_imported_price: 0,
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

  const onInputVariationChange = (key: string, value: any) => {
    const newVariationData = [...variationData];
    const newVariation: any = newVariationData[selectedVariation];
    newVariation[key] = value;
    newVariationData[selectedVariation] = newVariation;
    setVariationData(newVariationData);
  };

  const handleCancel = () => {
    setIsOpenModal(false);
  };

  const handleAddCategories = async () => {
    if (categoryName) {
      const url = `/shop/${currentShop.id}/category/create`;
      return await apiClient
        .post(url, {
          name: categoryName,
          description: "",
          product_code: createProductParams?.product_code,
        })
        .then((res) => {
          if (res.data) {
            setCreateProductParams((prev: any) => ({
              ...prev,
              categories_id: res.data.id,
            }));
            setCategoryName("");
            inputRef.current?.focus();
          }
        });
    }
  };

  const getCategories = async () => {
    const url = `/shop/${currentShop.id}/categories`;
    return await apiClient.get(url).then((res) => {
      setListCategories(res.data);
    });
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

  const renderFooter = () => {
    return (
      <div className="flex justify-end">
        <Button
          type="primary"
          onClick={() => {
            if (selectedRowKeys) {
              handleUpdateProduct();
            } else {
              handleCreateProduct();
            }
          }}
          className="mr-2"
          loading={isLoading}
          disabled={isLoading}
        >
          Lưu
        </Button>
        <Button
          onClick={() => {
            setModalVisiable(false);
            setCreateVariationParams([]);
            setCreateProductParams({});
            setVariationData([]);
            setSelectedRowKeys && setSelectedRowKeys(null);
          }}
        >
          Hủy
        </Button>
      </div>
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
        setVariationData([]);
        setSelectedRowKeys && setSelectedRowKeys(null);
      }}
      footer={renderFooter()}
    >
      <Layout className="p-5 h-[600px] overflow-y-scroll">
        {isLoading ? (
          <div className="flex items-center justify-center gap-4 h-full w-full">
            <div>Chờ chút bạn nhé....</div>
            <Spin />
          </div>
        ) : (
          <Fragment>
            <Row justify="space-between" className="mb-5">
              <Col span={12} className="bg-white rounded-lg shadow-sm">
                <Form
                  layout="vertical"
                  className="p-6"
                  initialValues={{
                    custom_id: selectedProduct && selectedProduct?.product_code,
                    product_name: selectedProduct && selectedProduct?.name,
                    product_note:
                      selectedProduct && selectedProduct?.description,
                  }}
                >
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
                      onChange={(e) =>
                        onInputChange("description", e.target.value)
                      }
                    />
                  </Form.Item>
                </Form>
              </Col>
              <Col span={11} className="h-fit">
                <Form
                  layout="vertical"
                  className="p-6 bg-white rounded-lg shadow-sm"
                >
                  <Form.Item name="categories_id" label="Danh mục">
                    <Select
                      showSearch
                      filterOption={(input, option) =>
                        fuzzySearch(input, option?.children)
                      }
                      placeholder="Danh mục"
                      onChange={(value) =>
                        onInputChange("categories_id", value)
                      }
                      value={createProductParams.categories_id}
                      defaultValue={createProductParams.categories_id}
                      dropdownRender={(menu) => (
                        <>
                          {menu}
                          <Divider style={{ margin: "8px 0" }} />
                          <Space style={{ padding: "0 8px 4px" }}>
                            <Input
                              placeholder="Thêm danh mục"
                              ref={inputRef}
                              value={categoryName}
                              onChange={(e) => setCategoryName(e.target.value)}
                              onKeyDown={(e) => e.stopPropagation()}
                            />
                            <Button
                              type="text"
                              icon={<PlusOutlined />}
                              onClick={handleAddCategories}
                            >
                              Thêm danh mục
                            </Button>
                          </Space>
                        </>
                      )}
                    >
                      {listCategories.map((category) => {
                        return (
                          <Select.Option key={category.id} value={category.id}>
                            {category.name}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                  <Form.Item label="Nhà cung cấp">
                    <Select
                      placeholder="Nhà cung cấp"
                      onChange={(value) =>
                        onInputChange("suppliers_products_ids", value)
                      }
                      mode="multiple"
                      value={createProductParams.suppliers_products_ids}
                    >
                      {suppliers.map((supplier) => {
                        return (
                          <Select.Option key={supplier.id} value={supplier.id}>
                            {supplier.name}
                          </Select.Option>
                        );
                      })}
                    </Select>
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
                    setSelectedVariation(rowIndex);
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
          </Fragment>
        )}
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
    suppliers: state.shopReducer.shop.suppliers,
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
