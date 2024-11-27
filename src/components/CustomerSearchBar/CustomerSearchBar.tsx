import { AppDispatch, RootState } from "@/store";
import { connect } from "react-redux";

interface CustomerSearchBarProps extends ReturnType<typeof mapStateToProps>, ReturnType<typeof mapDispatchToProps> {}

const CustomerSearchBar = (props: CustomerSearchBarProps) => {
    return (
        <div></div>
    )
}

const mapStateToProps = (state: RootState) => {
    return {}
}

const mapDispatchToProps = (dispatch: AppDispatch) => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomerSearchBar);

