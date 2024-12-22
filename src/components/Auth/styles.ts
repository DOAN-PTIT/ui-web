import { Grid } from "antd";

const { useBreakpoint } = Grid;

const screens = useBreakpoint();
const styles = {
    imageLogo: {
        width: "80px",
        height: "80px",
        borderRadius: "50%",
        margin: "0 auto",
        display: "block",
        marginBottom: "20px",
    },
    container: {
        background: "#f9fafb",
        margin: "0 auto",
        padding: screens.md ? "40px" : "60px 16px",
        width: "380px",
        border: "1px solid #f0f0f0",
        borderRadius: "8px",
    },
    footer: {
        marginTop: "24px",
        textAlign: "center" as "center",
        width: "100%",
    },
    forgotPassword: {
        float: "right" as "right",
    },
    header: {
        marginBottom: "40px",
    },
    section: {
        alignItems: "center",
        backgroundColor: "#fff",
        display: "flex",
        height: screens.sm ? "100vh" : "auto",
        padding: screens.md ? "64px 0" : "0px",
    },
    text: {
        color: "#8c8c8c",
    },
    title: {
        fontSize: screens.md ? "24px" : "20px",
        fontWeight: 700,
        marginTop: '24px!important',
        marginBottom: '16px',
    },
};

export default styles;