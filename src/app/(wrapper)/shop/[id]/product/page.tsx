"use client";

import Product from "@/components/Product/Product";
import { marginStyle } from "@/styles/layoutStyle";

export default function ProductPage() {
  return (
    <div className="h-screen">
      <Product />
      {marginStyle("go_shop_container")}
    </div>
  );
}
