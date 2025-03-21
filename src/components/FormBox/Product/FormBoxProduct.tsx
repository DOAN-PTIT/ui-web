import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  calcOrderDebt,
  calcPromotionEachProduct,
  calcTotalDiscountOrder,
  calcTotalDiscountProduct,
  calcTotalOrderPriceOriginal,
  formatNumber,
} from "@/utils/tools";
import { DeleteOutlined, LoadingOutlined } from "@ant-design/icons";
import {
  Button,
  Empty,
  Input,
  notification,
  Popover,
  Select,
  Spin,
  Tag,
  Tooltip,
} from "antd";
import ProductSearchBar from "@/components/ProductSearchBar/ProductSearchBar";
import Image from "next/image";
import { AppDispatch, RootState } from "@/store";
import { createOrder } from "@/reducer/order.reducer";
import { connect } from "react-redux";
import CustomInputNumber from "@/container/CustomInputNumber";

const currency = "VND";

interface FormBoxProductProps
  extends ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps> {
  setIsAtCounter: Dispatch<SetStateAction<boolean>>;
  isAtCounter: boolean;
  order?: any;
  findDiscountCanBeActice?: () => Promise<void>;
  promotionsCanBeActive?: any[];
}

function FormBoxProduct(props: FormBoxProductProps) {
  const {
    createOrder,
    orderParams,
    setIsAtCounter,
    isAtCounter,
    order,
    promotionsCanBeActive,
  } = props;

  const [selectedProduct, setSelectedProduct] = useState<[]>(
    order?.orderitems?.map((item: any) => item.variation) || []
  );
  const [note, setNote] = useState<{ note: string; variation_id: any }[]>([]);

  useEffect(() => {
    let totalProductDiscount = 0;
    const updatedOrderItems = selectedProduct.map((item: any) => {
      const { orderAmount, ...variation_info } = item;
      const noteItem = note?.find(
        (note) => note.variation_id === item.id
      )?.note;
      totalProductDiscount += calcPromotionEachProduct(
        item,
        orderAmount || 1
      );
      return {
        variation_id: item.id,
        quantity: orderAmount || 1,
        advance_promotion: item.promotion,
        note: noteItem,
        variation_info,
      };
    });

    createOrder({
      ...orderParams,
      orderitems: updatedOrderItems,
      total_cost: calcTotalOrderPriceOriginal({
        ...orderParams,
        orderitems: updatedOrderItems,
      }),
      total_discount: (orderParams.total_discount || 0) + (totalProductDiscount || 0),
      // total_discount: calcTotalDiscountOrder({
      //   ...orderParams,
      //   orderitems: updatedOrderItems,
      // }),
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
      setNote(
        (prevState: { note: string; variation_id: any }[] | undefined) => {
          return [
            ...(prevState || []),
            { note: noteItem, variation_id: variation_id },
          ];
        }
      );
    }
  };

  const renderPromotionCanBeActive = () => {
    return promotionsCanBeActive && promotionsCanBeActive.length > 0 ? (
      promotionsCanBeActive.map((promotion) => {
        return renderPromotionActive(promotion, "");
      })
    ) : (
      <Empty description="Không tìm thấy khuyến mãi phù hợp" />
    );
  };

  const renderPromotionActive = (promotion: any, color: string) => {
    const isDiscountPercent = promotion?.order_range?.is_discount_percent;
    const title = isDiscountPercent
      ? `Khuyến mãi ${
          promotion?.order_range?.discount
        }% trên tổng hoá đơn. Tối đa ${formatNumber(
          promotion?.order_range?.max_discount,
          currency
        )} đ`
      : `Khuyến mãi ${formatNumber(
          promotion?.order_range?.discount,
          currency
        )} trên tổng hoá đơn`;

    return (
      <Tooltip title={title}>
        <Tag
          className="cursor-pointer"
          onClick={() => handleActicePromotion(promotion)}
          color={color}
        >
          {promotion?.name}
        </Tag>
      </Tooltip>
    );
  };

  const handleActicePromotion = (promotion: any) => {
    const existPromotion =
      orderParams && (orderParams?.promotion?.id == promotion?.id || orderParams?.promotion_id == promotion?.id);

    let discountValueWithMax = 0;
    const promotionOrderRange = promotion?.order_range;
    if (promotionOrderRange) {
      const discount = promotionOrderRange?.discount || 0;
      console.log(discount);
      const isDiscountPercent = promotionOrderRange?.is_discount_percent || false;
      const maxDiscount = promotionOrderRange?.max_discount || 0;
      const totalOrder = calcTotalOrderPriceOriginal(orderParams);
      const discountValue = isDiscountPercent
        ? (totalOrder * discount) / 100
        : discount;
      discountValueWithMax = isDiscountPercent ? Math.min(discountValue, maxDiscount) : discountValue;
      if (!existPromotion) {
        createOrder({
          ...orderParams,
          total_discount: (orderParams.total_discount || 0) + discountValueWithMax,
          promotion,
          promotion_id: promotion?.id,
        });
      } else {
        console.log("asdasdssda");
        createOrder({
          ...orderParams,
          total_discount: orderParams.total_discount - discountValueWithMax,
          promotion: null,
          promotion_id: null,
        });
      }
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
            onChange={(value) => {
              setIsAtCounter(value);
              createOrder({
                ...orderParams,
                at_counter: value,
                delivery_cost: value ? 0 : orderParams.delivery_cost,
                shop_delivery_company_id: value ? null : orderParams.shop_delivery_company_id,
              });
            }}
            value={orderParams.at_counter || isAtCounter}
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
      <div className="bg-gray-100 p-5 rounded-lg">
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
                  <div className="flex justify-between">
                    <div className="w-1/5">
                      <Image
                        quality={100}
                        width={120}
                        height={120}
                        alt=""
                        src={variation.image}
                      />
                    </div>
                    <div className="w-4/5 flex flex-col justify-center">
                      <div className="flex gap-5">
                        <p className="w-4/5 flex h-fit">
                          <Tag className="bg-[#fff0f6] border-[#ffadd2] text-[#c41d7f] font-bold">
                            {variation.product?.product_code}
                          </Tag>
                          <Tag className="bg-[#d6ebcb] border-[#72ca45] text-[#52c41a] font-bold">
                            {variation?.variation_code}
                          </Tag>
                          <Tooltip title={variation.product?.name}>
                            <p className="truncate w-[300px] font-bold">
                              {variation.product?.name}
                            </p>
                          </Tooltip>
                        </p>
                      </div>
                      <div className="flex justify-end gap-4 items-center mt-12">
                        <span className="">
                          {formatNumber(
                            isAtCounter
                              ? variation.price_at_counter
                              : variation.retail_price
                          )}{" "}
                          ₫
                        </span>
                        x
                        <CustomInputNumber
                          type="quantity"
                          variant="filled"
                          onChange={(value) => {
                            const orderAmount = Math.max(1, value || 1);
                            onChangeAmountCurrentProduct(
                              variation,
                              orderAmount
                            );
                          }}
                          value={variation?.orderAmount}
                          className="w-[80px]"
                          defaultValue={1}
                          min={1}
                          disabled={orderParams?.status == 4 || orderParams?.status == -1}
                        />
                      </div>
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
                        {formatNumber(
                          calcPromotionEachProduct(
                            variation,
                            variation?.orderAmount || 1
                          ),
                          currency
                        )}{" "}
                        ₫
                      </a>
                    </div>
                    <Input
                      variant="filled"
                      className="w-[180px]"
                      placeholder="Ghi chú cho sản phẩm này"
                      onChange={(e) =>
                        onChangeNoteOrderItem(variation.id, e.target.value)
                      }
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
      {orderParams.orderitems?.length > 0 && (
        <div className="flex items-center gap-3">
          <Popover trigger={["click"]} content={renderPromotionCanBeActive()}>
            <Button onClick={props.findDiscountCanBeActice}>
              Chương trình khuyến mãi
            </Button>
          </Popover>
          {orderParams?.promotion && (
            <div className="flex gap-4">
              {renderPromotionActive(orderParams?.promotion, "blue")}
            </div>
          )}
        </div>
      )}
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
