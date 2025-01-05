import CustomInputNumber from "@/container/CustomInputNumber";
import { createOrder } from "@/reducer/order.reducer";
import { AppDispatch, RootState } from "@/store";
import { calcTotalOrderPrice } from "@/utils/tools";
import { Input, Select } from "antd";
import Image from "next/image";
import { useState } from "react";
import { connect } from "react-redux";

interface ShopParterProps
  extends ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps> {
      order?: any
    }

function FormBoxShopPartner(props: ShopParterProps) {
  const { currentShop, orderParams, createOrder, order } = props;
  const { shop_delivery_company } = currentShop;

  const handleSelectPartner = (value: any) => {
    const partner: any = shop_delivery_company.find(
      (item: any) => item.id === value
    );
    createOrder({
      ...orderParams,
      shop_delivery_company_id: partner?.id,
      delivery_cost: partner?.price || 0,
    });
  };

  return (
    <main className="p-5 rounded-lg shadow-sm bg-white w-full">
      <div className="mb-5 text-xl font-bold">ĐVVC</div>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <p className="">Đơn vị vận chuyển</p>
          <Select
            className="w-1/2"
            variant="filled"
            placeholder="Chọn đơn vị vận chuyển"
            onSelect={handleSelectPartner}
            value={order?.shop_delivery_company_id || orderParams?.shop_delivery_company_id}
          >
            {shop_delivery_company.map((partner: any) => {
                const delivery_company = partner.delivery_company;
              return (
                <Select.Option key={partner.id} value={partner.id}>
                  <div className="flex items-center">
                  <Image src={delivery_company.image} width={18} height={18} alt={delivery_company.name} /> 
                  <p className="ml-4">{delivery_company.name}</p>
                  </div>
                </Select.Option>
              );
            })}
          </Select>
        </div>
        <div className="flex">
          <p className="w-1/2">Phí vận chuyển</p>
          <CustomInputNumber
            className="w-1/2"
            value={orderParams?.delivery_cost || order?.delivery_cost}
            onChange={(value) =>
              createOrder({
                ...orderParams,
                delivery_cost: value,
              })
            }
            type="price"
            variant="filled"
            placeholder="Phí vận chuyển"
          />
        </div>
      </div>
    </main>
  );
}

const mapStateToProps = (state: RootState) => {
  return {
    currentShop: state.shopReducer.shop,
    orderParams: state.orderReducer.createOrder,
  };
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
    createOrder: (order: any) => dispatch(createOrder(order)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormBoxShopPartner);
