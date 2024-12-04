'use client';
import { SendOutlined } from '@ant-design/icons';
import { Button, Layout } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import Background from '@/assets/background.png';
import ImageEx from '@/assets/dashboard2.png'

const { Content } = Layout;

export default function LandingContent() {
    const handleLoginWithFacebook = () => {
        const fb_url = "http://localhost:8000/social/facebook"
        document.location = fb_url;
    };
    return (
        <Content>
            <Image className='h-[754px] object-cover w-auto' src={Background} alt="" />
            <div className=' bg-cover bg-center max-w-[76rem] mx-auto sm:w-[1300px]'>
                <div className=' absolute h-[1054px] top-24 sm:flex items-center justify-between sm:h-[720px]'>
                    <div className='sm:w-[706px] mr'>
                        <div className='flex item-center mx:3'>
                            <a className='mr-1 text-[16px] font-[500] text-[#6a6a6a]'>Một sản phẩm của </a>
                            <a className='text-[18px] font-[600] text-[#464646]'>PTIT TEAM</a>
                        </div>
                        <div className='flex item-center'>
                            <a className="mr-1 text-[64px] font-[650] bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent hover:from-cyan-500">
                                Goshop GOS
                            </a>
                        </div>
                        <div className='flex item-center'>
                            <a className="mr-1 mb-4 text-[64px] sm:leading-[5rem] font-[650] text-black hover:text-black">
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
                            {/* <Link href='/login'> */}
                            <Button onClick={handleLoginWithFacebook} className='px-[24px] py-[26px] border-1 border-slate-50 rounded-2xl text-xl font-medium border-1'>Đăng nhập với Facebook</Button>
                            {/* </Link> */}
                        </div>
                    </div>
                    <div className='w-[300px] ml-14 sm:w-[606px] sm:overflow-hidden'>
                        <Image
                            src={ImageEx}
                            alt=''
                            className='h-full object-cover'
                        />
                    </div>
                </div>
                <div className=' '>
                    <div>

                    </div>
                </div>
            </div>
            <div className='bg-cover bg-center relative bg-white'>
                <div className='flex sm:flex h-[720px] items-center justify-between sm:h-[720px] max-w-[76rem] mx-auto sm:w-[1300px]'>
                    <div className='w-[546px] mr-16'>
                        <div className='text-4xl font-bold '>Quản lý bán hàng đa kênh</div>
                        <div className='text-[#6a6a6a] text-lg font-[450] mt-3'>Quản lý hoạt động bán hàng trên nhiều kênh khác nhau từ một hệ thống</div>
                        <div className='flex mt-6'>
                            <img className='mr-4 self-start' src="https://pos.pancake.vn/static/img/CheckCircle.svg" alt="" />
                            <div>
                                <div className='text-lg font-semibold'>Tích hợp đa kênh</div>
                                <div className='text-[#6a6a6a] text-lg font-[450] mt-2'>Hỗ trợ tích hợp và quản lý đơn hàng từ các kênh bán hàng khác nhau như website, mạng xã hội, sàn thương mại điện tử và cửa hàng truyền thống.</div>
                            </div>
                        </div>
                        <div className='flex mt-4'>
                            <img className='mr-4 self-start' src="https://pos.pancake.vn/static/img/CheckCircle.svg" alt="" />
                            <div>
                                <div className='text-lg font-semibold'>Đồng bộ tồn kho</div>
                                <div className='text-[#6a6a6a] text-lg font-[450] mt-2'>Tự động cập nhật và đồng bộ số lượng tồn kho giữa các kênh bán hàng để tránh tình trạng hết hàng hoặc tồn kho quá nhiều.</div>
                            </div>
                        </div>
                        <div className='flex mt-4'>
                            <img className='mr-4 self-start' src="https://pos.pancake.vn/static/img/CheckCircle.svg" alt="" />
                            <div>
                                <div className='text-lg font-semibold'>
                                    Báo cáo tập trung</div>
                                <div className='text-[#6a6a6a] text-lg font-[450] mt-2'>Cung cấp báo cáo chi tiết về doanh số, lượng hàng bán ra, và hiệu quả kinh doanh từ từng kênh, giúp đưa ra quyết định kinh doanh chính xác.</div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <img src="https://pos.pancake.vn/static/img/SalesChanel.webp" alt="" className='w-[681px]' />
                    </div>
                </div>
            </div>
        </Content>
    );
}
