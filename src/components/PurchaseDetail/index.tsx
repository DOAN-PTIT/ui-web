import { AppDispatch, RootState } from "@/store";
import { Button, Col, Modal, Row, Select, Table, Input } from "antd";
import { Dispatch, SetStateAction, useState } from "react";
import { connect } from "react-redux";
import type { TableProps } from "antd";
import ProductSearchBar from "../ProductSearchBar/ProductSearchBar";
import CustomDatePicker from "../CustomDatePicker";
import { DeleteOutlined } from "@ant-design/icons";

interface PurchaseDetailProps
  extends ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps> {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  title: string;
}

const PurchaseDetail = (props: PurchaseDetailProps) => {
  const { open, setOpen, title } = props;
  const [selectedProduct, setSelectedProduct] = useState<any[]>([]);
  const columns: TableProps<any>["columns"] = [
    {
      title: "Mã sản phẩm",
      key: "product_code",
      dataIndex: "product_code",
    },
    {
      title: "Tên sản phẩm",
      key: "product_name",
      dataIndex: "product_name",
    },
    {
      title: "Số lượng",
      key: "quantity",
      dataIndex: "quantity",
      render: (text, record) => {
        return <Input value={text} />;
      },
    },
    {
      title: "Giá nhập",
      key: "imported_price",
      dataIndex: "imported_price",
      render: (text, record) => {
        return <Input value={text} />;
      },
    },
    {
      title: "Thành tiền",
      key: "total_price",
      dataIndex: "total_price",
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
          <Input placeholder="Phí vận chuyển" />
        </div>
        <div className="flex justify-between flex-col mb-2">
          <h1 className="font-medium mb-2">Chiết khấu</h1>
          <Input placeholder="Chiết khấu" />
        </div>
        <div className="flex justify-between flex-col mb-2">
          <h1 className="font-medium mb-2">Ngày tạo phiếu</h1>
          <CustomDatePicker className="w-full" placeholder="Ngày tạo phiếu" />
        </div>
        <div className="flex justify-between flex-col mb-2">
          <h1 className="font-medium mb-2">Ghi chú</h1>
          <Input.TextArea
            placeholder="Ghi chú phiếu nhập"
            style={{ height: 80, resize: "none" }}
          />
        </div>
      </div>
    );
  };
  const renderContent = () => {
    return (
      <Row
        className="p-4 h-full w-full overflow-hidden overflow-y-auto bg-gray-200"
        style={{ margin: 0 }}
        gutter={16}
      >
        <Col span={6} className="flex flex-col gap-4">
          <div className="p-3 bg-white rounded-lg">
            <h1 className="font-medium mb-3">Nhà cung cấp</h1>
            <Select placeholder="Chọn nhà cung cấp" className="w-full" />
          </div>
          <ul className="p-3 bg-white rounded-lg">
            <li className="flex justify-between items-center">
              <p className="font-medium">Tiền hàng</p>
              <p className="font-medium">0 đ</p>
            </li>
            <li className="flex justify-between items-center">
              <p className="font-medium">Phí vận chuyển</p>
              <p className="font-medium">0 đ</p>
            </li>
            <li className="flex justify-between items-center">
              <p className="font-medium">Chiết khấu</p>
              <p className="font-medium">0 đ</p>
            </li>
            <li className="flex justify-between items-center">
              <p className="font-medium">Tổng tiền</p>
              <p className="font-medium">0 đ</p>
            </li>
          </ul>
          {renderFormBoxPrice()}
        </Col>
        <Col span={18} className="flex flex-col gap-4">
          <ProductSearchBar
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
          />
          <Table
            summary={() => <div className="font-medium p-4">Tổng</div>}
            columns={columns}
            dataSource={[]}
            pagination={false}
          />
        </Col>
      </Row>
    );
  };
  const renderFooter = () => {
    return (
      <div className="p-3">
        <Button type="primary">Lưu</Button>
      </div>
    );
  };
  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
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
      footer={renderFooter()}
    >
      {renderContent()}
    </Modal>
  );
};

const mapStateToProps = (state: RootState) => {
  return {};
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseDetail);
