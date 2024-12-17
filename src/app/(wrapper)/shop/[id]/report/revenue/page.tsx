'use client'

import ReportRevenue from "@/components/ReportRevenue";
import { marginStyle } from "@/styles/layoutStyle";

export default function SalePage() {
    return (
        <>
            <ReportRevenue />
            {marginStyle("go_shop_container")}
        </>
    )
}