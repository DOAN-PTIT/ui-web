"use client";

import Supplier from "@/components/Supplier";
import { marginStyle } from "@/styles/layoutStyle";

export default function SupplierPage() {
  return (
    <div className="h-screen">
      <Supplier />
      {marginStyle("go_shop_container")}
    </div>
  );
}
