import { Layout } from "antd"
import Content from "./components/Content"
import Header from "./components/Header"
import Footer from "./components/Footer"

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