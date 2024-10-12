import { Layout } from "antd"
import Content from "./layout/Content"
import Header from "./layout/Header"
import Footer from "./layout/Footer"

function Welcome() {
    return (
        <>
            <Layout className="bg-slate-50">
                <Header />
                <Content />
                <Footer/>
            </Layout>

        </>
    )
}

export default Welcome