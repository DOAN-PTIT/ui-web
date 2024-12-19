import { AppDispatch, RootState } from "@/store";
import { Button, Form, Input, Modal, notification, Spin } from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { connect } from "react-redux";
import CustomDatePicker from "../CustomDatePicker";
import { createDebt, updateDebt } from "@/action/debt.action";
import { Debt } from "@/utils/type";
import SupplierSearchBar from "../SupplierSearchBar";
import moment from "moment";
import apiClient from "@/service/auth";
import { setIsLoading } from "@/reducer/product.reducer";

interface SupplierDetailProps
  extends ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps> {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  title: string;
  fetchDebts: () => Promise<void>;
  debt: Debt | null;
}

const DebtDetail = (props: SupplierDetailProps) => {
  const {
    open,
    setOpen,
    title,
    debt,
    createDebt,
    updateDebt,
    fetchDebts,
    currentShop,
  } = props;
  const [isCreate, setIsCreate] = useState(true);
  const [supplierId, setSupplierId] = useState();
  const [loading, setLoading] = useState(false);
  const [debtDetail, setDebtDetail] = useState<Debt | null>(null);

  useEffect(() => {
    if (debt) {
      setIsCreate(false);
      getDebtDetail();
    }
  }, [debt]);

  const getDebtDetail = async () => {
    setLoading(true);
    try {
      const url = `shop/${currentShop.id}/debt/${debt?.id}`;
      return await apiClient
        .get(url)
        .then((res) => {
          setLoading(false);
          if (res.data) {
            setDebtDetail(res.data);
          }
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const renderTitle = () => {
    return (
      <div className="p-4">
        <h2>{title}</h2>
      </div>
    );
  };

  const handleSelectSupplier = (value: any) => {
    setSupplierId(value);
  };

  const onSubmitted = async (values: any) => {
    setIsLoading(true);
    values.supplier_id = supplierId;
    values.money_must_pay = parseInt(values.money_must_pay);
    delete debtDetail?.id;
    delete debtDetail?.purchase_id;
    delete debtDetail?.shop_id;
    if (isCreate && !debt?.id) {
      await createDebt({ data: values, shop_id: currentShop.id }).then(
        (res) => {
          setOpen(false);
          setLoading(false);
          fetchDebts();
          notification.success({
            message: "Thành công",
            description: "Tạo mới công nợ thành công",
          })
        }
      );
    } else {
      await updateDebt({
        id: debt?.id,
        data: { ...debtDetail, ...values },
        shop_id: currentShop.id,
      }).then((res) => {
        fetchDebts();
        setOpen(false);
        notification.success({
          message: "Thành công",
          description: "Cập nhật công nợ thành công",
        })
        setLoading(false);
      });
    }
  };

  const renderContent = () => {
    return (
      <div className="p-4 bg-gray-200">
        <Form
          className="bg-white p-4 rounded-lg"
          layout="vertical"
          onFinish={onSubmitted}
          initialValues={
            debtDetail
              ? {
                  name: debtDetail.name,
                  supplier_id: debtDetail.supplier_id,
                  purchase_date: moment(debtDetail.purchase_date),
                  deal_date: moment(debtDetail.deal_date),
                  money_must_pay: debtDetail.money_must_pay,
                  description: debtDetail.description,
                }
              : {}
          }
        >
          <Form.Item
            label={<span className="font-medium">Tên công nợ</span>}
            name="name"
            rules={[
              {
                required: true,
                message: "Tên công nợ không được để trống",
              },
            ]}
          >
            <Input placeholder="Tên công nợ" name="name" />
          </Form.Item>
          <Form.Item
            label={<span className="font-medium">Tên nhà cung cấp</span>}
            name="supplier_id"
          >
            <SupplierSearchBar
              onChange={handleSelectSupplier}
              defaultSupplier={debtDetail?.supplier}
            />
          </Form.Item>
          <Form.Item
            label={<span className="font-medium">Ngày mua</span>}
            name="purchase_date"
          >
            <CustomDatePicker className="w-full" placeholder="Ngày mua" />
          </Form.Item>
          <Form.Item
            label={<span className="font-medium">Ngày phải trả</span>}
            name="deal_date"
          >
            <CustomDatePicker className="w-full" placeholder="Ngày phải trả" />
          </Form.Item>
          <Form.Item
            label={<span className="font-medium">Nợ cần trả</span>}
            name="money_must_pay"
            rules={[
              {
                required: true,
                message: "Nợ cần trả không được để trống",
              },
              {
                pattern: /^[0-9]+$/,
                min: 0,
              },
            ]}
          >
            <Input
              placeholder="Nợ cần trả"
              name="money_must_pay"
              type="number"
            />
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
            <Button htmlType="submit" type="primary">
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
      style={{ top: 30 }}
      title={renderTitle()}
    >
      {loading ? (
        <div className="w-full h-[620px] flex items-center justify-center">
          Chờ xíu bạn nhé... <Spin />
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
    createDebt: (params: any) => dispatch(createDebt(params)),
    updateDebt: (params: any) => dispatch(updateDebt(params)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DebtDetail);
