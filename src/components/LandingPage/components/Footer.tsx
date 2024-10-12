'use client'

import { Divider, Layout } from "antd"
import Image from 'next/image';
import Img from '/src/assets/favicon.png'
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
                                <a className="text-[25px] font-[650] text-white hover:text-white">OS</a>
                            </Link>
                            <div className="text-white text-sm">
                                <EnvironmentOutlined className="mx-2" />
                                <a className="hover:text-white">KM10, Đường Nguyễn Trãi, Hà Đông, Hà Nội</a>
                            </div>
                            <div className="text-white mt-3">
                                <PhoneOutlined className="mx-2" />
                                <a className="hover:text-white">1900 8198</a>
                            </div>
                        </div>
                        <div className="flex flex-row gap-10 mt-[60px] text-sm text-white">
                            <div className="flex flex-col gap-2">
                                <a className="hover:text-white mb-[32px] font-semibold">Sản phẩm</a>
                                <a className="hover:text-white">Trang chủ</a>
                                <a className="hover:text-white">Giải pháp</a>
                                <a className="hover:text-white">Tài liệu</a>
                            </div>
                            <div className="flex flex-col gap-2">
                                <a className="hover:text-white mb-[32px] font-semibold">Công ty</a>
                                <a className="hover:text-white">Chính sách bảo mật</a>
                                <a className="hover:text-white">Facebook</a>
                                <a className="hover:text-white">Liên hệ</a>
                            </div>
                        </div>


                    </div>
                    <Divider className="bg-white opacity-70 m-0"></Divider>
                    <div className="mt-6">
                        <div className='flex items-end mx:3 text-white'>
                            <a className='mr-1 text-[12px] font-[500] '>Một sản phẩm của </a>
                            <a className='mr-1 text-[12px] font-[600] '>PTIT TEAM |</a>
                            <a className='mr-1 text-[12px] font-[500] '>Copyright</a>
                            <a className='mr-1 text-[15px] font-[600] '>&#169;</a>
                            <a className='mr-1 text-[12px] font-[500] '>2024</a>
                            <a className='mr-1 text-[12px] font-[500] '>PTIT TEAM</a>


                        </div>
                    </div>
                </div>

            </Footer>
        </>
    )
}