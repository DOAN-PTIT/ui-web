'use client'

import { Divider, Layout } from "antd"
import Image from 'next/image';
import Img from '@/assets/favicon.png'
import Link from "next/link";
import { EnvironmentOutlined, PhoneOutlined } from "@ant-design/icons";

const { Footer } = Layout
export default function LandingFooter() {
    return (
        <>
            <Footer className="bg-cyan-500 p-0 ">
                <div className="max-w-[76rem] mx-auto sm:w-[1300px] pb-[16px]">
                    <div className='flex justify-between py-[40px]'>
                        <div className="items-start sm:h-[204px]">
                            <Link className="flex items-center mb-6" href={'/'}>
                                <Image src={Img} alt='' className='w-10' />
                                <div className="text-[25px] font-[650] text-white hover:text-white">OS</div>
                            </Link>
                            <div className="flex text-white text-sm">
                                <EnvironmentOutlined className="mx-2" />
                                <div className=" hover:text-white">KM10, Đường Nguyễn Trãi, Hà Đông, Hà Nội</div>
                            </div>
                            <div className="flex text-white mt-3">
                                <PhoneOutlined className="mx-2" />
                                <div className="hover:text-white">1900 8198</div>
                            </div>
                        </div>
                        <div className="flex flex-row gap-10 mt-[60px] text-sm text-white">
                            <div className="flex flex-col gap-2">
                                <div className="hover:text-white mb-[32px] font-semibold">Sản phẩm</div>
                                <div className="hover:text-white">Trang chủ</div>
                                <div className="hover:text-white">Giải pháp</div>
                                <div className="hover:text-white">Tài liệu</div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="hover:text-white mb-[32px] font-semibold">Công ty</div>
                                <div className="hover:text-white">Chính sách bảo mật</div>
                                <div className="hover:text-white">Facebook</div>
                                <div className="hover:text-white">Liên hệ</div>
                            </div>
                        </div>


                    </div>
                    <Divider className="bg-white opacity-70 m-0"></Divider>
                    <div className="mt-6">
                        <div className='flex items-end mx:3 text-white'>
                            <div className='mr-1 text-[12px] font-[500] '>Một sản phẩm của </div>
                            <div className='mr-1 text-[12px] font-[600] '>PTIT TEAM |</div>
                            <div className='mr-1 text-[12px] font-[500] '>Copyright</div>
                            <div className='mr-1 text-[15px] font-[600] '>&#169;</div>
                            <div className='mr-1 text-[12px] font-[500] '>2024</div>
                            <div className='mr-1 text-[12px] font-[500] '>PTIT TEAM</div>


                        </div>
                    </div>
                </div>

            </Footer>
        </>
    )
}