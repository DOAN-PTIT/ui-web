import { useEffect, useState } from "react";
import { formatNumber } from "@/utils/tools";
import {
  EuroOutlined,
  NumberOutlined,
  ProductOutlined,
} from "@ant-design/icons";
import { Avatar, Empty, Input, Select, Tag } from "antd";

const products = [
  {
    id: 1,
    name: "Product 1",
    variation: {
      variation_id: 123,
    },
    image: "link image",
    salePrice: 5000000,
    promotion: 100000,
  },
  {
    id: 2,
    name: "Product 1",
    variation: {
      variation_id: 123,
    },
    image: "link image",
    salePrice: 5000000,
    promotion: 100000,
  },
];
const currency = "VND";
function FormBoxProduct() {
  const [listProduct, setListProduct] = useState([] as any);

  useEffect(() => {
    setListProduct(products);
  }, [products]);

  const handlePriceChange = (value: string) => {
    console.log(value);
  };

  const handleQuantityChange = (value: string) => {
    console.log(value);
  };

  return (
    <main className="flex flex-col gap-4 p-4 rounded-xl shadow-md bg-white w-full">
      <div className="flex justify-between">
        <h1 className="font-bold text-xl">San Pham</h1>
        <div>
          <Select
            defaultValue="online"
            defaultActiveFirstOption
            className="w-[130px]"
          >
            <Select.Option key="online">Online</Select.Option>
            <Select.Option key="counter">Ban tai quay</Select.Option>
          </Select>
        </div>
      </div>
      <Input placeholder="Nhap ten san pham/ mau ma" />
      <div className="bg-slate-100 p-5 rounded-lg">
        <div className="gap-6 font-medium text-md mb-4">
            <span className="mr-5">So loai SP: 12</span>
            <span>So luong SP: 10</span>
        </div>
        {listProduct.length > 0 ? (
          <div className="flex flex-col gap-3">
            {listProduct.map((product: any) => {
              return (
                <div key={product.id} className="bg-white p-3 rounded-md">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-5">
                      <Avatar icon={<ProductOutlined />} size={64} />
                      <p>
                        <Tag className="bg-[#fff0f6] border-[#ffadd2] text-[#c41d7f] font-bold">
                          {product.id}
                        </Tag>
                        <Tag className="bg-[#d6ebcb] border-[#72ca45] text-[#52c41a] font-bold">
                          {product.variation.variation_id}
                        </Tag>
                        <span>{product.name}</span>
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <Input
                        type="number"
                        prefix={<EuroOutlined />}
                        onChange={(e) => handlePriceChange(e.target.value)}
                        addonAfter={<span>₫</span>}
                      />
                      x
                      <Input
                        type="number"
                        prefix={<NumberOutlined />}
                        onChange={(e) => handleQuantityChange(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between ml-[50%] items-center mt-3 w-1/2">
                    <div>KM: <a className="font-medium text-blue-500">{formatNumber(product.promotion, currency)} ₫</a></div>
                    <div className="font-medium text-blue-500">{formatNumber(product.salePrice, currency)} ₫</div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-lg p-5 border">
            <Empty description="Gio hang trong" />
          </div>
        )}
      </div>
    </main>
  );
}

export default FormBoxProduct;
