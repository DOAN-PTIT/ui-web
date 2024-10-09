import { Layout } from "antd"
import Content from "./components/Content"
import Header from "./components/Header"

function Welcome() {
    return (
        <>
            <Layout className="bg-slate-50">
                <Header />
                <Content />
            </Layout>

        </>
    )
}

export default Welcome