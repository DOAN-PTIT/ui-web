"use client";

import Debt from "@/components/Debt";
import { marginStyle } from "@/styles/layoutStyle";

export default function DebtPage() {
  return (
    <>
      <Debt />
      {marginStyle("go_shop_container")}
    </>
  );
}
