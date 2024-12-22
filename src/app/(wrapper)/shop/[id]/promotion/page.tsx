'use client';

import Promotion from "@/components/Promotion";
import { marginStyle } from "@/styles/layoutStyle";

export default function PromotionPage() {
  return (
    <div className="h-screen">
      <Promotion />
      {marginStyle("go_shop_container")}
    </div>
  );
}