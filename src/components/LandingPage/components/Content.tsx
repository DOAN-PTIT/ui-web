'use client';
import { SendOutlined } from '@ant-design/icons';
import { Button, Layout } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import Background from '/src/assets/background.png';
import ImageEx from '/src/assets/dashboard1.png'

const { Content } = Layout;

export default function LandingContent() {

    return (
        <Content>
            <div className='bg-cover bg-center relative'>
                <Image className='h-[700px] sm:h-auto object-cover w-full' src={Background} alt="" />
                <div className='absolute top-0 flex sm:flex h-[720px] items-center justify-between ml-[10px] sm:h-[720px] lg:ml-[150px] md:ml-[100px] sm:items-center sm:justify-between'>
                    <div className='block mr-[110px] w-[100px] lg:w-[542px] md:w-[400px] sm:w-[200px]'>
                        <div className='flex item-center'>
                            <a className='mr-1 text-[16px] font-[500] text-[#6a6a6a]'>Một sản phẩm của </a>

                            <a className='text-[18px] font-[600] text-[#464646]'>PTIT TEAM</a>
                        </div>
                        <div className='flex item-center'>
                            <a className="mr-1 text-[64px] font-[650] bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent hover:from-cyan-500">
                                Goshop GOS
                            </a>
                        </div>
                        <div className='flex item-center'>
                            <a className="mr-1 mb-4 text-[64px] leading-[5rem] font-[650] text-black hover:text-black">
                                Phần mềm <br /> quản lý bán hàng
                            </a>

                        </div>
                        <div className='flex item-center'>
                            <a className="mr-2 mb-8 max-w-[491px] text-[16px] font-[450] text-[#6a6a6a]">
                                Giải pháp quản lý bán hàng, kho hàng phù hợp với cả hai hình thức kinh doanh online và offline
                            </a>
                        </div>
                        <div className=''>
                            <Link href='/login'>
                                <Button className='px-[24px] py-[26px] mr-8 rounded-2xl text-xl font-medium border-1 bg-cyan-600 text-white'>Đăng nhập ngay <SendOutlined /></Button>
                            </Link>
                            <Link href='/login'>
                                <Button className='px-[24px] py-[26px] border-1 border-slate-50 rounded-2xl text-xl font-medium border-1'>Đăng nhập với Facebook</Button>
                            </Link>
                        </div>
                    </div>
                    <div className='block w-[100px] lg:w-[906px] md:w-[400px] sm:w-[200px] overflow-hidden'>
                        <Image
                            src={ImageEx}
                            alt=''
                            className='w-full h-full object-cover' // Cập nhật để cắt phần tràn của ảnh
                        />
                    </div>
                </div>
            </div>
            <div className='bg-cover bg-center relative bg-white'>
                <div className='flex sm:flex h-[720px] items-center justify-between ml-[10px] sm:h-[720px] lg:ml-[150px] md:ml-[100px] sm:items-center sm:justify-between'>aaaaaaaaa</div>
            </div>
        </Content>
    );
}
