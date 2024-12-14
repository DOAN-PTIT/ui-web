'use client'

import Sale from "@/components/Sale/Sale";
import { marginStyle } from "@/styles/layoutStyle";

export default function SalePage() {
    return (
        <>
            <Sale />
            {marginStyle("go_shop_container")}
        </>
    )
}