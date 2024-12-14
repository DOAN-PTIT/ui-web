'use client';

import Promotion from "@/components/Promotion";
import { marginStyle } from "@/styles/layoutStyle";

export default function PromotionPage() {
  return (
    <>
      <Promotion />
      {marginStyle("go_shop_container")}
    </>
  );
}