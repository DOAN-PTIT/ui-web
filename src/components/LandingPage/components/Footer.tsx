'use client'

import { Layout } from "antd"
import Image from 'next/image';
import Img from '/src/assets/favicon.png'
import Link from "next/link";
import { EnvironmentOutlined, PhoneOutlined } from "@ant-design/icons";

const { Footer } = Layout
export default function LandingFooter() {
    return (
        <>
            <Footer className="bg-cyan-500 p-0">
                <div className='flex justify-between py-[40px] mx-[10px] mb-8 mt-3 sm:mx-0 sm:mb-0 sm:mt-0 lg:mx-[150px] md:mx-[100px] sm:flex sm:h-[361px]'>
                    <div className="items-start sm:h-[204px]">
                        <Link href={'/'}>
                            <Image src={Img} alt='' className='items-center w-10 mb-6' />
                        </Link>
                        <div className="text-white">
                            <EnvironmentOutlined className="mx-1"/>
                            <a className="text-sm text-white">KM10, Đường Nguyễn Trãi, Hà Đông, Hà Nội</a>
                        </div>
                        <div className="text-white">
                            <PhoneOutlined className="mx-1" />
                            <a className="text-sm text-white">1900 8198</a>
                        </div>
                    </div>

                </div>

            </Footer>
        </>
    )
}