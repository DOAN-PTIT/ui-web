import { getListSupplier, updateSupplier } from "@/action/supplier.action";
import apiClient from "@/service/auth";
import { AppDispatch, RootState } from "@/store";
import { Supplier } from "@/utils/type";
import { Button, Form, Input, Modal, notification, Spin } from "antd";
import axios from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { connect } from "react-redux";

interface SupplierDetailProps
  extends ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps> {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  title: string;
  supplierId?: number;
  fetchSupplier?: () => Promise<any>;
}

const SupplierDetail = (props: SupplierDetailProps) => {
  const { open, setOpen, title, currentShop, supplierId, updateSupplier, fetchSupplier } =
    props;
  const [loading, setLoading] = useState(false);
  const [supplier, setSupplier] = useState<Supplier>({} as Supplier);
  const [isCreate, setIsCreate] = useState(true);

  useEffect(() => {
    if (supplierId) {
      getSupplier();
      setIsCreate(false);
    }
  }, [supplierId]);

  const renderTitle = () => {
    return (
      <div className="p-4">
        <h2>{title}</h2>
      </div>
    );
  };

  const getSupplier = async () => {
    try {
      setLoading(true);
      const url = `shop/${currentShop.id}/supplier/${supplierId}`;
      return await apiClient
        .get(url)
        .then((res) => {
          setLoading(false);
          setSupplier(res.data);
          return res.data;
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async (values: any) => {
    setLoading(true);
    try {
      const params = { shopId: currentShop.id, supplierId, data: values };
      return await updateSupplier(params).then(() => setLoading(false));
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateSupplier = async (values: any) => {
    try {
      const url = `shop/${currentShop.id}/supplier/create`;
      return await apiClient
        .post(url, values)
        .then((res) => {
          setLoading(false);
          notification.success({
            message: "Thành công",
            description: "Tạo nhà cung cấp thành công",
          });
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
          notification.error({
            message: "Có lỗi xảy ra",
            description: "Tạo nhà cung cấp thất bại",
          });
          setOpen(false);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmitted = async (values: any) => {
    setLoading(true);
    if (isCreate) {
      handleCreateSupplier(values);
    } else {
      handleUpdate(values);
    }
    setLoading(false);
    setOpen(false);
    if (fetchSupplier) {
      fetchSupplier();
    }
  };

  const renderContent = () => {
    return (
      <div className="p-4 bg-gray-200">
        <Form
          className="bg-white p-4 rounded-lg"
          layout="vertical"
          onFinish={onSubmitted}
          disabled={loading}
          initialValues={loading ? {} : supplier}
        >
          <Form.Item
            label={<span className="font-medium">Mã nhà cung cấp</span>}
            name="supplier_code"
          >
            <Input placeholder="Mã nhà cung cấp" name="supplier_code" />
          </Form.Item>
          <Form.Item
            label={<span className="font-medium">Tên nhà cung cấp</span>}
            name="name"
            rules={[
              {
                required: true,
                message: "Tên nhà cung cấp không được để trống",
              },
            ]}
          >
            <Input placeholder="Tên nhà cung cấp" name="name" />
          </Form.Item>
          <Form.Item
            label={<span className="font-medium">Số điện thoại</span>}
            name="phone_number"
            rules={[
              {
                pattern: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g,
                message: "Số điện thoại không hợp lệ",
              },
            ]}
          >
            <Input placeholder="Số điện thoại" name="phone_number" />
          </Form.Item>
          <Form.Item
            label={<span className="font-medium">Địa chỉ</span>}
            name="address"
          >
            <Input placeholder="Địa chỉ" name="address" />
          </Form.Item>
          <Form.Item
            label={<span className="font-medium">Mô tả</span>}
            name="description"
          >
            <Input.TextArea
              placeholder="Mô tả"
              style={{ height: 80, resize: "none" }}
            />
          </Form.Item>
          <Form.Item className="text-right">
            <Button htmlType="submit" type="primary" loading={loading}>
              Lưu
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  };
  return (
    <Modal
      open={open}
      footer={null}
      onCancel={() => setOpen(false)}
      styles={{
        body: {
          padding: 0,
        },
        content: {
          padding: 0,
        },
      }}
      title={renderTitle()}
    >
      {loading ? (
        <div className="flex h-[620px] w-full justify-center items-center">
          Đợi xíu bạn nhé... <Spin />
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
  return {
    updateSupplier: (params: any) => dispatch(updateSupplier(params)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SupplierDetail);
