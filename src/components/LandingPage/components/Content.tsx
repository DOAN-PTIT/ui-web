'use client';

import { Button, Layout } from 'antd';
import Link from 'next/link';
const { Content } = Layout;

export default function LandingContent() {
    return (
        <Content>
            <div className='bg-cover  bg-center h-screen' style={{ backgroundImage: `url('src/assets/favicon2.ico')` }}>
                <div className='flex sm:flex h-[720px] items-center justify-between  ml-[10px] sm:h-[720px] sm:ml-[150px] sm:items-center sm:justify-between'>
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
