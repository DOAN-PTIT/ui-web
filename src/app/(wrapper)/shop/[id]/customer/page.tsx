"use client";

import Customer from "@/components/Customer/Customer";
import { marginStyle } from "@/styles/layoutStyle";

export default function CustomerPage() {
  return (
    <>
      <Customer />
      {marginStyle("go_shop_container")}
    </>
  );
}
