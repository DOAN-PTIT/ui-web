"use client";

import Purchase from "@/components/Purchase";
import { marginStyle } from "@/styles/layoutStyle";

export default function PurchasePage() {
  return (
    <>
      <Purchase />
      {marginStyle("go_shop_container")}
    </>
  );
}
