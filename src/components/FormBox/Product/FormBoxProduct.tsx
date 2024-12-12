import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { formatNumber } from "@/utils/tools";
import { DeleteOutlined } from "@ant-design/icons";
import { Button, Empty, Input, notification, Select, Tag } from "antd";
import ProductSearchBar from "@/components/ProductSearchBar/ProductSearchBar";
import Image from "next/image";
import { AppDispatch, RootState } from "@/store";
import { createOrder } from "@/reducer/order.reducer";
import { connect } from "react-redux";

const currency = "VND";

interface FormBoxProductProps
  extends ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps> {
      setIsAtCounter: Dispatch<SetStateAction<boolean>>,
      isAtCounter: boolean,
      order?: any
    }

function FormBoxProduct(props: FormBoxProductProps) {
  const { createOrder, orderParams, setIsAtCounter, isAtCounter, order } = props;

  const [selectedProduct, setSelectedProduct] = useState<[]>(order?.orderitems?.map((item:any) => item.variation) || []);
  const [note, setNote] = useState<{ note: string; variation_id: any }[]>([]);

  // useEffect(() => {
  //   if (order) {
  //     const variations = order?.orderitems?.map((item:any) => item.variation) || [];
  //     setSelectedProduct(variations);
  //   }
  // }, [])

  useEffect(() => {
    createOrder({
      ...orderParams,
      orderitems: selectedProduct.map((item: any) => {
        const { orderAmount, ...variation_info } = item;
        const noteItem = note?.find(
          (note) => note.variation_id === item.id
        )?.note;

        return {
          variation_id: item.id,
          quantity: orderAmount || 1,
          advance_promotion: item.promotion,
          note: noteItem,
          variation_info,
        };
      }),
    });
  }, [note, selectedProduct]);

  const onChangeAmountCurrentProduct = (
    currVariation: any,
    amountChange: number
  ) => {
    const newVariation = {
      ...currVariation,
      orderAmount: amountChange,
    };
    setSelectedProduct((prevState: any) => {
      return prevState.map((variation: any) => {
        if (variation.id === currVariation.id) {
          return newVariation;
        }
        return variation;
      });
    });
  };

  const handleDeleteProduct = (index: number) => {
      setSelectedProduct((prevState: any) => {
        if (prevState.length === 1) {
          notification.warning({
            message: "Không thể xóa",
            description: "Phải có ít nhất 1 sản phẩm trong đơn hàng",
          });
          return prevState;
        }
        return prevState.filter((_: any, i: number) => i !== index);
      });
  };

  const onChangeNoteOrderItem = (variation_id: any, noteItem: string) => {
    const index = note?.findIndex((item) => item.variation_id === variation_id);
    if (index !== -1) {
      setNote((prevState: any) => {
        return prevState.map((item: any, i: number) => {
          if (i === index) {
            return {
              ...item,
              note: noteItem,
            };
          }
          return item;
        });
      });
    } else {
      setNote((prevState: { note: string; variation_id: any }[] | undefined) => {
        return [...(prevState || []), { note: noteItem, variation_id: variation_id }];
      });
    }
  };

  return (
    <main className="flex flex-col gap-4 p-4 rounded-xl shadow-sm bg-white w-full">
      <div className="flex justify-between">
        <h1 className="font-bold text-xl">Sản phẩm</h1>
        <div>
          <Select
            defaultValue={false}
            defaultActiveFirstOption
            className="w-[130px]"
            onChange={(value) => setIsAtCounter(value)}
            value={isAtCounter}
          >
            <Select.Option value={false}>Online</Select.Option>
            <Select.Option value={true}>Bán tại quầy</Select.Option>
          </Select>
        </div>
      </div>
      <ProductSearchBar
        setSelectedProduct={setSelectedProduct}
        selectedProduct={selectedProduct}
      />
      <div className="bg-slate-100 p-5 rounded-lg">
        <div className="gap-6 font-medium text-md mb-4">
          <span className="mr-5">
            Số lượng sản phẩm: {selectedProduct?.length}
          </span>
        </div>
        {selectedProduct?.length > 0 ? (
          <div className="flex flex-col gap-3">
            {selectedProduct?.map((variation: any, index: number) => {
              return (
                <div
                  key={variation?.id}
                  className={`bg-white p-3 rounded-md relative`}
                >
                  <div className={`absolute right-2 top-2`}>
                    <Button
                      onClick={() => handleDeleteProduct(index)}
                      className="text-[12px]"
                      danger
                      icon={<DeleteOutlined />}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-5">
                      <Image
                        quality={100}
                        width={80}
                        height={80}
                        alt=""
                        src={variation.image}
                      />
                      <p>
                        <Tag className="bg-[#fff0f6] border-[#ffadd2] text-[#c41d7f] font-bold">
                          {variation.product?.id}
                        </Tag>
                        <Tag className="bg-[#d6ebcb] border-[#72ca45] text-[#52c41a] font-bold">
                          {variation?.variation_code}
                        </Tag>
                        <span className="font-bold">
                          {variation.product?.name}
                        </span>
                      </p>
                    </div>
                    <div className="flex gap-4 items-center mt-12">
                      <span className="text-green-500 font-medium">
                        {formatNumber(variation.retail_price)} ₫
                      </span>
                      x
                      <Input
                        type="number"
                        variant="filled"
                        onChange={(e) => {
                          const orderAmount = Math.max(
                            1,
                            parseInt(e.target.value)
                          );
                          onChangeAmountCurrentProduct(variation, orderAmount);
                        }}
                        value={variation?.orderAmount}
                        className="w-[80px]"
                        defaultValue={1}
                      />
                    </div>
                  </div>
                  <div className="flex flex-row-reverse justify-between items-center mt-3">
                    <div className="font-bold text-blue-500">
                      {formatNumber(
                        variation?.retail_price * (variation?.orderAmount || 1),
                        currency
                      )}{" "}
                      ₫
                    </div>
                    <div>
                      KM:{" "}
                      <a className="font-medium text-blue-500">
                        {formatNumber(variation?.promotion, currency)} ₫
                      </a>
                    </div>
                    <Input
                      variant="filled"
                      className="w-[180px]"
                      placeholder="Ghi chú cho sản phẩm này"
                      onChange={(e) => onChangeNoteOrderItem(variation.id, e.target.value)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-lg p-5 border bg-white">
            <Empty description="Giỏ hàng trống" />
          </div>
        )}
      </div>
    </main>
  );
}

const mapStateToProps = (state: RootState) => {
  return {
    orderParams: state.orderReducer.createOrder,
  };
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
    createOrder: (order: any) => dispatch(createOrder(order)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormBoxProduct);
