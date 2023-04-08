import Navbar from "./navbar";
import "../css/home.css";
import Sidebar from "./sidebar";

const HomeScreen = () => {
    return (
        <div className="homeContainer h-100 row">
            <div className="col-7 h-100">
                <div className="cur-team h-100">
                    <span className="align-middle">My Team</span>
                </div>
            </div>
            <div className="col-5 h-100 d-flex flex-column justify-content-between">
                <div className="watchlist">
                    Watchlist
                </div>
                <div className="league align-bottom">
                    My League
                </div>
            </div>
        </div>
    );
}

export default function Home (props) {
    return (
        <div className="row h-100">
            <span className="col-2">
            <Sidebar selected="Home"></Sidebar>
            </span>
            <span className="col-10 right">
            <Navbar message="Hello, user!"></Navbar>
            <HomeScreen></HomeScreen>
            </span>
        </div>
    )
}