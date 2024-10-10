'use client';
import Background from '/src/assets/background.png';
import { Button, Layout } from 'antd';
import Link from 'next/link';
import Image from 'next/image';

const { Content } = Layout;

export default function LandingContent() {

    return (
        <Content>
            <div className='bg-cover  bg-center relative'>
                <Image className='h-auto object-cover w-full'src={Background} alt="" />
                <div className='absolute top-0  flex sm:flex h-[720px] items-center justify-between ml-[10px] sm:h-[720px] lg:ml-[150px] md:ml-[100px] sm:items-center sm:justify-between'>
                    <Link href='/login'>
                        <Button className='p-6 rounded-5 text-sm font-medium border-1'>Đăng nhập</Button>
                    </Link>
                    {/* <Link href='/login'>
                        <Button>Đăng nhập với Facebook</Button>
                    </Link> */}
                </div>
            </div>
        </Content>
    );
}
