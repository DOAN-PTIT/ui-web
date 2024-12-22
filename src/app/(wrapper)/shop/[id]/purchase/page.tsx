"use client";

import Purchase from "@/components/Purchase";
import { marginStyle } from "@/styles/layoutStyle";

export default function PurchasePage() {
  return (
    <div className="h-screen">
      <Purchase />
      {marginStyle("go_shop_container")}
    </div>
  );
}
