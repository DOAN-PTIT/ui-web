import { PlusOutlined } from "@ant-design/icons";
import { Col, Form, Input, Modal, Row, Table, Upload } from "antd";
import type { TableProps } from "antd";

interface CreateProductProps {
  open: boolean;
  callBack: () => void;
}

interface VariationProps {
  custom_id: string;
  image: string;
  barcode: string;
  sale_price: number;
  amount: number;
}

function CreateProduct(props: CreateProductProps) {
  const { open, callBack } = props;
  const columns: TableProps<VariationProps>["columns"] = [
    {
      title: "Image",
      dataIndex: "image",
      key: "IMAGE",
      fixed: "left",
      width: 125,
    },
    {
      title: "Ma ma",
      dataIndex: "custom_id",
      key: "CUSTOM ID",
      fixed: "left",
    },
    {
      title: "Ma vach",
      dataIndex: "barcode",
      key: "BARCODE",
    },
    {
      title: "Gia ban",
      dataIndex: "sale_price",
      key: "SALE PRICE",
    },
    {
      title: "So luong",
      dataIndex: "amount",
      key: "AMOUNT",
    },
  ];

  columns.push({
    title: "",
    dataIndex: "delete",
    key: "DELETE",
    fixed: "right",
  });

  const getData: () => TableProps<VariationProps>["dataSource"] = () => {
    return [];
  };
  return (
    <Modal
      width={1200}
      open={open}
      onCancel={() => callBack()}
      title="Thiet lap san pham"
      className="top-[20px] bottom-[20px]"
    >
      <div className="p-10 bg-gray-100 rounded-lg flex flex-col gap-8 h-[680px] overflow-auto">
        <Row justify="space-between">
          <Col span={11} className="text-center p-6 bg-white rounded-lg">
            <Upload>
              <div className="p-28 border border-slate-500 bg-gray-200 rounded-md border-dashed cursor-pointer opacity-80 mt-[40px]">
                <PlusOutlined className="mr-1" />
                Upload
              </div>
            </Upload>
          </Col>
          <Col span={11} className="text-center p-6 bg-white rounded-lg">
            <Form layout="vertical">
              <Form.Item label="Ma san pham" name="custom_id" required>
                <Input placeholder="Ma san pham" />
              </Form.Item>
              <Form.Item label="Ten san pham" name="product_name" required>
                <Input placeholder="Ten san pham" />
              </Form.Item>
              <Form.Item label="Mo ta" required>
                <Input.TextArea
                  placeholder="Mo ta"
                  style={{ height: 120, resize: "none" }}
                />
              </Form.Item>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Table
              scroll={{ x: 1200, y: 300 }}
              columns={columns}
              dataSource={getData()}
            />
          </Col>
        </Row>
      </div>
    </Modal>
  );
}

export default CreateProduct;
