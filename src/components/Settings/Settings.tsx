"use client"
import { Storefront, UserSquare, UsersThree } from "@phosphor-icons/react"
import { Layout } from "antd"
import Link from "next/link"
import HeaderAction from "../HeaderAction/HeaderAction"
import { useRouter } from "next/navigation"

const { Content } = Layout
function Settings() {
    const router = useRouter()
    const shopId = localStorage.getItem('shopId')
    return (
        <Layout className="px-4">
            <HeaderAction
                title="Cấu hình"
                isShowSearch={true}
                inputPlaholder="Tìm kiếm cấu hình" />
            <Content className="bg-white rounded-lg overflow-auto overflow-x-hidden flex p-5 gap-5 w-full h-screen">
                <div className="w-full h-full p-5">
                    <div className="text-xl font-bold w-full">Cấu hình chung</div>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                        <div className="">
                            <div className="flex items-center">
                                <div className="p-2 mr-3 rounded-full bg-slate-100">
                                    <Storefront className="size-5 " />
                                </div>
                                <div className="text-[#101828] text-base font-semibold">Cửa hàng</div>
                            </div>
                            <Link href={`/shop/${shopId}/settings/general`}>
                                <div className="mt-3 text-sm text-[#0050b3] font-medium">Cài đặt chung</div>
                            </Link>
                        </div>
                        <div className="">
                            <div className="flex items-center">
                                <div className="p-2 mr-3 rounded-full bg-slate-100">
                                    <UsersThree className="size-5 " />
                                </div>
                                <div className="text-[#101828] text-base font-semibold">Nhân viên</div>
                            </div>
                            <Link href={`/shop/${shopId}/settings/personnel`}>
                                <div onClick={() => router.push('/general')} className="mt-3 text-sm text-[#0050b3] font-medium">Danh sách nhân viên</div>
                            </Link>
                        </div>
                        <div className="">
                            <div className="flex items-center">
                                <div className="p-2 mr-3 rounded-full bg-slate-100">
                                    <UserSquare className="size-5 " />
                                </div>
                                <div className="text-[#101828] text-base font-semibold">Khách hàng</div>
                            </div>
                            <Link href={`/shop/${shopId}/settings/customer`}>
                                <div className="mt-3 text-sm text-[#0050b3] font-medium">Cài đặt khách hàng</div>
                            </Link>
                        </div>
                    </div>

                </div>
            </Content>
        </Layout>
    )
}

export default Settings