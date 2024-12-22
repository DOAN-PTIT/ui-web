"use client";

import Customer from "@/components/Customer/Customer";
import { marginStyle } from "@/styles/layoutStyle";

export default function CustomerPage() {
  return (
    <div className="h-screen">
      <Customer />
      {marginStyle("go_shop_container")}
    </div>
  );
}
