'use client'

import ReportOrder from "@/components/ReportOrder";
import { marginStyle } from "@/styles/layoutStyle";

export default function SalePage() {
    return (
        <>
            <ReportOrder />
            {marginStyle("go_shop_container")}
        </>
    )
}