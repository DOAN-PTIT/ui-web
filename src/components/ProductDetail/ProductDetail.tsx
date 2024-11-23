import {
  getListProductFBShop,
  createProduct,
  getListProduct,
} from "@/action/product.action";
import { createVariation } from "@/action/variation.action";
import { AppDispatch, RootState } from "@/store";
import { formatNumber } from "@/utils/tools";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  TableProps,
  Button,
  Modal,
  Layout,
  Row,
  Col,
  Form,
  Select,
  Table,
  Input,
  Dropdown,
  Image
} from "antd";
import { useState, ChangeEvent, Dispatch, SetStateAction } from "react";
import { connect } from "react-redux";
import defaultImage from "../../assets/default.png";

interface VariationProps {
  id: string;
  iamge: string;
  barcode: string;
  salePrice: number;
  amount: number;
  index?: number;
}

interface ProductDetailProps extends ReturnType<typeof mapStateToProps>, ReturnType<typeof mapDispatchToProps> {
    typeView: string;
    modalVisiable: boolean;
    setModalVisiable: Dispatch<SetStateAction<boolean>>,
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
    } = props;

  const [createProductParams, setCreateProductParams] = useState<any>({});
  const [variationData, setVariationData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  interface VariationParam {
    index: number;
    [key: string]: any;
  }

  const [createVariationParams, setCreateVariationParams] = useState<
    VariationParam[]
  >([]);

  const handleDeleteVariationColumn = (index: any) => {
    const indexSelectedColumn = variationData.findIndex(
      (item) => item.index === index
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
    await createProduct({
      ...createProductParams,
      shopId: currentShop.id,
    }).then((res) => {
      if (res.payload) {
        const { id: product_id } = res.payload;
        createVariationParams.forEach(async (variation) => {
          delete variation.index;
          await createVariation({
            ...variation,
            shop_id: currentShop.id,
            product_id,
          }).then((res) => {
            if (res.payload) {
              setModalVisiable(false);
              getListProduct({ shopId: currentShop.id, page: currentPage });
            }
          });
        });
      }
    });
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
      onCancel={() => setModalVisiable(false)}
      onOk={handleCreateProduct}
    >
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
          <Col span={11} className="bg-white rounded-lg h-fit shadow-sm">
            <Form layout="vertical" className="p-6">
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
          </Col>
        </Row>
        <Table
          pagination={{
            size: "small",
            onChange: (page) => setCurrentPage(page),
          }}
          scroll={{ x: 1200, y: 800 }}
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
