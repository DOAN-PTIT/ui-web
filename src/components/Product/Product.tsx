"use client";

import {
  Button,
  Col,
  Form,
  Input,
  Layout,
  Modal,
  Row,
  Select,
  Table,
  Dropdown,
  Image,
} from "antd";
import HeaderAction from "../HeaderAction/HeaderAction";
import ActionTools from "../ActionTools/ActionTools";
import type { TableProps } from "antd";
import { ChangeEvent, useEffect, useState } from "react";
import {
  DeleteOutlined,
  PlusOutlined,
  ProductOutlined,
} from "@ant-design/icons";
import { AppDispatch, RootState } from "@/store";
import {
  createProduct,
  getListProduct,
  getListProductFBShop,
} from "@/action/product.action";
import { connect } from "react-redux";
import { formatNumber } from "@/utils/tools";
import defaultImage from "../../assets/default.png";
import apiClient from "@/service/auth";

interface ProductType {
  id: string;
  name: string;
  totalAmount: any;
  salePrice: any;
  importedPrice: any;
  note: string;
  totalVariation: any;
}

interface VariationProps {
  id: string;
  iamge: string;
  barcode: string;
  salePrice: number;
  amount: number;
}

interface ProductProps
  extends ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps> {}

function Product(props: ProductProps) {
  const {
    getListProduct,
    getListProductFBShop,
    listProduct,
    currentShop,
    currentUser,
    createProduct
  } = props;

  const [modalVisiable, setModalVisiable] = useState(false);
  const [createProductParams, setCreateProductParams] = useState<any>({});
  const [variationData, setVariationData] = useState([]);
  interface VariationParam {
    index: number;
    [key: string]: any;
  }

  const [createVariationParams, setCreateVariationParams] = useState<
    VariationParam[]
  >([]);

  useEffect(() => {
    getListProduct({ shopId: currentShop.id, page: 1 });
  }, [currentShop.id]);

  const columns: TableProps<ProductType>["columns"] = [
    {
      key: "ID",
      dataIndex: "id",
      title: "ID",
      fixed: "left",
      width: 120,
    },
    {
      key: "PRODUCT NAME",
      dataIndex: "name",
      title: "Ten san pham",
      fixed: "left",
    },
    {
      key: "TOTAL AMOUNT",
      dataIndex: "totalAmount",
      title: "Tổng số lượng",
    },
    {
      key: "TOTAL VARIATION",
      dataIndex: "totalVariation",
      title: "Tổng số mẫu mã",
    },
    {
      key: "SALE  PRICE",
      dataIndex: "salePrice",
      title: "Giá bán",
    },
    {
      key: "IMPORTED PRICE",
      dataIndex: "importedPrice",
      title: "Giá nhập",
    },
    {
      key: "NOTE",
      dataIndex: "note",
      title: "Ghi chú",
    },
  ];

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
    render: () => {
      return (
        <Button
          icon={<DeleteOutlined />}
          danger
          style={{ border: "none", boxShadow: "none", background: "none" }}
        />
      );
    },
  });

  const callBackSyncFBCatalog = () => {
    return getListProductFBShop({
      access_token: currentUser.access_token,
      fb_shop_id: currentShop.fb_shop_id,
    });
  };

  const getData: () => TableProps<ProductType>["dataSource"] = () => {
    return listProduct?.products
      ? listProduct?.products.map((product) => ({
          id: product.product_code || product.id,
          name: product.name,
          totalAmount: 0,
          salePrice: formatNumber(1231289, "VND"),
          importedPrice: formatNumber(3213912, "VND"),
          note: product.description,
          totalVariation: 0,
        }))
      : [];
  };

  const getDataVariation: () => TableProps<VariationProps>["dataSource"] =
    () => {
      return [...variationData];
    };

  const callBack = () => {
    setModalVisiable(true);
    setVariationData([]);
  };

  const handleCreateProduct = async () => {
    const { createProduct } = props;
    console.log(createVariationParams);
    await createProduct({ ...createProductParams, shopId: currentShop.id });
    if(createVariationParams.length > 0) {
      await handleCreateVariations();
    }
  };

  const handleCreateVariations = async () => {
    const url = `/shop/${currentShop.id}/8/create-variations`;
    return await apiClient
      .post(url, createVariationParams )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const reloadCallBack = async () => {
    const { getListProduct } = props;
    return await getListProduct({ shopId: currentShop.id, page: 1 });
  };

  const onInputChange = (key: string, value: any) => {
    setCreateProductParams((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleAddVariationColumn = () => {
    const newVariationData = [...variationData];
    const newVariation = {
      id: <Input name="variation_code" />,
      image: (
        <Dropdown menu={{ items: [{ label: "Chỉnh sửa", key: "edit-image" }] }}>
          <Image alt="" src={defaultImage.src} preview={false} />
        </Dropdown>
      ),
      barcode: <Input name="barcode" />,
      salePrice: <Input name="retail_price" />,
      amount: <Input name="amount" />,
    } as never;
    newVariationData.unshift(newVariation);

    setVariationData(newVariationData);
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

  const handleUpdateStateCreateVariation = (index: number, key: string, value: string | number) => {
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
  } 

  return (
    <Layout>
      <HeaderAction
        title="Sản phẩm"
        isShowSearch={true}
        inputPlaholder="Tìm kiếm sản phẩm"
      />
      <Layout.Content className="p-5 h-screen">
        <ActionTools
          callBack={callBack}
          reloadCallBack={reloadCallBack}
          hasSyncFBCatalog={currentShop.fb_shop_id ? true : false}
          callBackSyncFBCatalog={callBackSyncFBCatalog}
        />
        <Table
          columns={columns}
          dataSource={getData()}
          pagination={{
            total: props.totalPage ? props.totalPage : 0,
            pageSize: 30,
            defaultCurrent: 1,
            defaultPageSize: 30,
            pageSizeOptions: [10, 20, 30, 50, 100],
            size: "small",
          }}
          scroll={{ x: 2500, y: 500 }}
          size="small"
          loading={props.isLoading}
        />
      </Layout.Content>
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
        onCancel={() => setModalVisiable(false)}
        onOk={handleCreateProduct}
      >
        <Layout className="p-5 h-[600px] overflow-y-scroll">
          <Row justify="space-between" className="mb-5">
            <Col span={12} className="bg-white rounded-lg shadow-sm">
              <Form layout="vertical" className="p-6">
                <Form.Item name="custom_id" label="Ma san pham" required>
                  <Input
                    placeholder="Ma san pham"
                    name="custom_id"
                    onChange={(e) =>
                      onInputChange("product_code", e.target.value)
                    }
                  />
                </Form.Item>
                <Form.Item name="product_name" label="Ten san pham" required>
                  <Input
                    placeholder="Ten san pham"
                    name="product_name"
                    onChange={(e) => onInputChange("name", e.target.value)}
                  />
                </Form.Item>
                <Form.Item name="product_note" label="Ghi chu">
                  <Input.TextArea
                    placeholder="Ghi chu"
                    name="product_note"
                    onChange={(e) =>
                      onInputChange("description", e.target.value)
                    }
                  />
                </Form.Item>
              </Form>
            </Col>
            <Col span={11} className="bg-white rounded-lg h-fit shadow-sm">
              <Form layout="vertical" className="p-6">
                <Form.Item name="product_tag" label="The">
                  <Select
                    options={[]}
                    placeholder="The"
                    onChange={(value) => onInputChange("product_tag", value)}
                  />
                </Form.Item>
                <Form.Item label="Nha cung cap">
                  <Select
                    options={[]}
                    placeholder="Nha cung cap"
                    onChange={(value) => onInputChange("supplier", value)}
                  />
                </Form.Item>
              </Form>
            </Col>
          </Row>
          <Table
            pagination={{ size: "small" }}
            scroll={{ x: 1200, y: 800 }}
            className="shadow-sm"
            columns={columnsVariation}
            dataSource={getDataVariation()}
            title={renderTitleVariation}
            onRow={(record, rowIndex): any => {
              return {
                //current value
                onClick: (e: ChangeEvent<HTMLInputElement>) => {
                  handleUpdateStateCreateVariation(rowIndex as number, e.target.name, e.target.value);
                },
                // previous value
                onBlur: (e: ChangeEvent<HTMLInputElement>) => {
                  handleUpdateStateCreateVariation(rowIndex as number, e.target.name, e.target.value);
                },
              };
            }}
          />
        </Layout>
      </Modal>
    </Layout>
  );
}

const mapStateToProps = (state: RootState) => {
  return {
    isLoading: state.productReducer.isLoading,
    listProduct: state.productReducer.listProduct,
    totalPage: state.productReducer.listProduct?.totalCount || 0,
    currentShop: state.shopReducer.shop,
    currentUser: state.userReducer.user,
    createProduct: state.productReducer.createProduct,
  };
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
    createProduct: (data: any) => dispatch(createProduct(data)),
    getListProduct: (data: { shopId: any; page: number }) =>
      dispatch(getListProduct(data)),
    getListProductFBShop: (data: any) => dispatch(getListProductFBShop(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Product);
