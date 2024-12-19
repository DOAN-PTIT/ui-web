"use client";

import Supplier from "@/components/Supplier";
import { marginStyle } from "@/styles/layoutStyle";

export default function SupplierPage() {
  return (
    <>
      <Supplier />
      {marginStyle("go_shop_container")}
    </>
  );
}
