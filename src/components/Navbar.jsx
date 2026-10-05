function Navbar({ activePage, setActivePage }) {

    function changePage(page) {
        setActivePage(page);
    }

    return (
        <nav className="navbar">

            <h2
                onClick={() => changePage("home")}
                style={{ cursor: "pointer" }}
            >
                🎧 EchoSphere
            </h2>

            <div className="nav-links">

                <a
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        changePage("home");
                    }}
                    className={activePage === "home" ? "active" : ""}
                >
                    Home
                </a>

                <a
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        changePage("search");
                    }}
                    className={activePage === "search" ? "active" : ""}
                >
                    Search
                </a>

                <a
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        changePage("library");
                    }}
                    className={activePage === "library" ? "active" : ""}
                >
                    Library
                </a>

            </div>

        </nav>
    );
}

export default Navbar;
