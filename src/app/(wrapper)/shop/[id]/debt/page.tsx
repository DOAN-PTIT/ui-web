"use client";

import Debt from "@/components/Debt";
import { marginStyle } from "@/styles/layoutStyle";

export default function DebtPage() {
  return (
    <div className="h-screen">
      <Debt />
      {marginStyle("go_shop_container")}
    </div>
  );
}
