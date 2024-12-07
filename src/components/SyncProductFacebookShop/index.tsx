import { createProduct, getListProductFBShop } from "@/action/product.action";
import { createVariation } from "@/action/variation.action";
import { AppDispatch, RootState } from "@/store";
import { Button, Divider, Image, Modal, notification } from "antd";
import { Dispatch, SetStateAction, useState } from "react";
import { connect } from "react-redux";

interface SyncProductFacebookShopProps
  extends ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps> {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

function SyncProductFacebookShop(props: SyncProductFacebookShopProps) {
  const {
    getListProductFBShop,
    currentUser,
    currentShop,
    open,
    setOpen,
    createProduct,
    createVariation,
    productsFacebookShop,
  } = props;

  const [isSyncing, setIsSyncing] = useState(false);

  const fetchListProductFBShop = async () => {
    return await getListProductFBShop({
      access_token: currentUser.access_token,
      fb_shop_id: currentShop.fb_shop_id,
    });
  };

  const handleSyncProduct = async () => {
    setIsSyncing(true);
    await fetchListProductFBShop();
    const products = productsFacebookShop?.data[0]?.product_groups?.data;
    setTimeout(async () => {
      if (products.length > 0) {
        products.forEach((product: any) => {
          const firstProduct = product?.products?.data[0];
          createProduct({
            product_code: product?.retailer_id,
            name: firstProduct?.name,
            description: firstProduct?.description,
            shopId: currentShop.id,
          })
            .then(async (res) => {
              if (res.payload) {
                const { id: product_id } = res.payload;
                product?.products?.data.forEach(async (variation: any) => {
                  await createVariation({
                    retail_price: variation?.price,
                    amount: variation?.inventory,
                    barcode: variation?.id,
                    price_at_counter: variation?.sale_price || 0,
                    variation_code: variation?.id,
                    image_url_fb: variation?.image_url,
                    product_id,
                    shop_id: currentShop.id,
                  })
                    .then((res) => {})
                    .catch((error) => {});
                });
              }
            })
            .catch((error) => {});
        });
      } else {
        setIsSyncing(false);
        setOpen(false);
        notification.error({
          message: "Đồng bộ sản phẩm thất bại",
          description: "Vui lòng kiểm tra lại cài đặt của bạn",
        });
      }
    });
    setIsSyncing(false);
    setOpen(false);
  };

  const renderFooter = () => {
    return (
      <div className="flex gap-3 justify-end mt-5">
        <Button onClick={() => setOpen(false)}>Huỷ</Button>
        <Button type="primary" onClick={handleSyncProduct} loading={isSyncing}>
          Bắt đầu đồng bộ
        </Button>
      </div>
    );
  };

  const renderContent = () => {
    return (
      <div className="">
        <div>
          <Image
            preview={false}
            src="https://pos.pancake.vn/static/img/meta.svg"
          />
        </div>
        <div className="flex">
          <div className="w-2/3">
            <h1 className="text-[18px] font-medium mb-5">
              Đồng bộ sản phẩm từ Facebook Shop
            </h1>
            <ul style={{ listStyle: "initial" }} className="px-4">
              <li>Dễ dàng quản lý sản phẩm từ Facebook Shop</li>
              <li>Thuận tiện cho việc tạo đơn</li>
              <li>Giúp việc thống kê, báo cáo trở nên dẽ dàng</li>
            </ul>
          </div>
          <div className="w-1/3 flex">
            <Image
              preview={false}
              src="https://pos.pancake.vn/static/img/sync.webp"
            />
            <Image
              preview={false}
              src="https://pos.pancake.vn/static/img/sync1.webp"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <Modal
      title={
        <div className="">
          Đồng bộ <Divider />
        </div>
      }
      open={open}
      onCancel={() => setOpen(false)}
      width={650}
      footer={renderFooter()}
    >
      {renderContent()}
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
    productsFacebookShop: state.productReducer.productsFacebookShop,
  };
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
    getListProductFBShop: (data: any) => dispatch(getListProductFBShop(data)),
    createProduct: (data: any) => dispatch(createProduct(data)),
    createVariation: (data: any) => dispatch(createVariation(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SyncProductFacebookShop);
