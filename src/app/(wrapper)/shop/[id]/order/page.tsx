"use client";

import Order from "@/components/Order/Order";
import { marginStyle } from "@/styles/layoutStyle";

export default function OrdePage() {
  return (
    <>
      <Order />
      {marginStyle("go_shop_container")}
    </>
  );
}
