"use client";

import { Layout, Menu } from "antd";
import { useState } from "react";
import Image from 'next/image'; // Correct Next.js import
import Logo from '@/assets/favicon.png'; // Ensure this path is correct
import Link from "next/link";
import HeaderAction from "../HeaderAction/HeaderAction";
import Title from "../Custom/TitleH";
import TitleH from "../Custom/TitleH";
import TitleA from "../Custom/TitleA";

const { Header, Content, Sider } = Layout;

function Settings() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Layout className="bg-[#f2f4f7]">
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
                className="bg-[#f2f4f7]"
                style={{ minHeight: "100vh" }}
            >
                {/* Logo container */}
                <div
                    className="flex items-center justify-center m-1"
                    style={{ padding: collapsed ? "0 10px" : "0 20px" }}>
                    <Link href={'/'} className="flex items-center justify-center">
                        <Image
                            src={Logo}
                            alt="Logo"
                            width={40}
                            height={40}
                            className="items-center mr-2"
                        />
                        {collapsed ? '' : <div className="text-base font-semibold text-black hover:text-black">Goshop GOS</div>}


                    </Link>
                </div>

                {/* <Menu className="bg-[#eaecf0]" defaultSelectedKeys={['1']} mode="inline" /> */}
            </Sider>

            <Content className="bg-[#f2f4f7]">
                <HeaderAction
                    title="Thiết lập tài khoản"
                    isShowSearch={false}

                />

                <div className="rounded-xl bg-[#eaecf0]">
                    <div className="flex items-center mx-5 mt-4" />
                    {/* <div className="flex items-center  h-[100px] rounded-xl bg-white">
                        Content
                    </div> */}
                    <div className="items-center grid grid-cols-3 gap-4 mx-5 mt-4">

                        <div className="col-span-1 rounded-xl bg-white">
                            <div className="">
                                <TitleH title='hehehe' />
                                <TitleA title='sdfdsf'/>
                            </div>
                        </div>
                        <div className="col-span-2 rounded-xl bg-white">04</div>

                    </div>
                    <div className="flex items-center mx-5 mt-4" />

                </div>
            </Content>
        </Layout>
    );
}

export default Settings;
