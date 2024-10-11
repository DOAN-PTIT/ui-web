"use client";
import { Button, Layout, Typography } from 'antd';
import Image from 'next/image';

import Link from 'next/link';


import React from 'react';
import Img from '/src/assets/favicon.png'
const { Header } = Layout;

export default function LandingHeader() {
    return (
        <Header className='bg-slate-50 block items-center justify-between 
        p-0 mx-[10px] mb-8 mt-3 sm:mx-0 sm:mb-0 sm:mt-0 lg:mx-[150px] md:mx-[100px] sm:flex sm:h-[92px]'>
            
            <div className='flex items-center '>
                <div className="logo">
                    <Link href={'/'}>
                        <Image src={Img} alt='' className='items-center w-10' />
                    </Link>
                </div>
                <div className='flex'>

                    <Typography className='ml-7 text-base font-medium '>Sản phẩm</Typography>


                    <Typography className='ml-7 text-base font-medium'>Giải pháp</Typography>


                    <Typography className='ml-7 text-base font-medium'>Tài liệu</Typography>

                </div>
            </div>

            <div className=''>
                <Link href="/sign-up">
                    <Button style={{ boxShadow: 'none' }} className="p-5 rounded-full text-sm font-medium border-1 
                    text-cyan-600 border-cyan-600 hover:text-cyan-400 hover:border-cyan-400 hover:bg-slate-100 transition-all duration-200">
                        Đăng ký
                    </Button>
                </Link>


                <Link href={'/'}>
                    <Button style={{ boxShadow: 'none' }} className='p-5 rounded-full text-sm font-medium ml-4 border-1 border-slate-100  text-cyan-600 hover:border-1 bg-slate-100 hover:text-cyan-400 hover:border-cyan-400 transition-all duration-200'>
                        Liên hệ
                    </Button>
                </Link>
            </div>
        </Header>
    );
};


