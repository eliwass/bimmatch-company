import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import debounce from "lodash.debounce";
import Dropdown from "react-bootstrap/Dropdown";
import Login from "../../components/login";
// import Notification from "../../components/notifications";
import { withAuth } from "../contexts/auth";
import { withTracking } from "../contexts/tracking";

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <button
    className="btn btn-link"
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
  </button>
));

const Header = ({
  tracking,
  className,
  auth,
  isLeftMenuOpen,
  handleLeftMenuOpenCallback,
}) => {
  const headerRef = useRef(null);
  const [displaySignIn, setDisplaySignIn] = useState(false);
  const [sticky, setSticky] = useState(false);

  const makeHeaderSticky = debounce(() => {
    const scroll = window.pageYOffset;
    if (scroll >= 30 && !sticky) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  }, 5);

  useEffect(() => {
    window.addEventListener("scroll", makeHeaderSticky);
    return () => {
      window.removeEventListener("scroll", makeHeaderSticky);
    };
  }, [makeHeaderSticky]);

  const displaySignInHandler = (bool) => {
    setDisplaySignIn(bool);
  };

  const logout = () => {
    displaySignInHandler(false);
    auth.apis.signOut();
    localStorage.clear();
  };

  return (
    <header
      className={className ? className : sticky ? "stick" : ""}
      ref={headerRef}
    >
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="menu-row">
              <div className="logo-wrap d-none d-lg-block">
                <a href="https://www.bimmatch.com/">
                  <img alt="logo" src="/images/bimmatch/logo-header.svg" />
                </a>
              </div>
              <div className="logo-wrap d-lg-none">
                <a href="https://www.bimmatch.com/">
                  <img
                    alt="logo"
                    src="/images/bimmatch/Logo_Header_Mobile.svg"
                  />
                </a>
              </div>
              <div className="menu-wrap">
                <div className="menu-right">
                  {!(auth && auth.isAuthenticated) && (
                    <>
                      <div className="button-wrap">
                        <button
                          className="btn btn-outline-secondary"
                          onClick={(e) => {
                            e.preventDefault();
                            displaySignInHandler(true);
                          }}
                        >
                          SIGN IN
                        </button>
                        <Login
                          show={displaySignIn}
                          handleClose={displaySignInHandler}
                        />
                      </div>
                    </>
                  )}
                  {auth && auth.isAuthenticated && (
                    <>
                      {/* <div className="button-wrap">
                        <Notification num={5} />
                      </div> */}
                      <div className="button-wrap">
                        <div className="profile">
                          <Dropdown drop="down">
                            <Dropdown.Toggle as={CustomToggle}>
                              <span className="name">
                                {auth.user.displayName === null
                                  ? localStorage.getItem("username") === null
                                    ? auth.user.email.split("@")[0]
                                    : localStorage.getItem("username")
                                  : auth.user.displayName}
                              </span>
                            </Dropdown.Toggle>
                            <Dropdown.Menu alignRight={true}>
                              {/* <Dropdown.Item href={`/my-projects`}>
                                My Projects
                              </Dropdown.Item> */}
                              <Dropdown.Item href={`/settings`}>
                                Settings
                              </Dropdown.Item>
                              <Dropdown.Item onClick={logout} href="/products">
                                Logout
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="menu-left">
                  <div
                    id="nav_list"
                    className="menu-mobile-icon"
                    onClick={(e) => handleLeftMenuOpenCallback(!isLeftMenuOpen)}
                  >
                    <div
                      id="toggle-icon"
                      className={isLeftMenuOpen ? "open" : ""}
                    >
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                  <div
                    className={`main-navigation pushmenu pushmenu-left ${
                      isLeftMenuOpen ? "pushmenu-open" : ""
                    }`}
                  >
                    <nav id="nav" className="nav">
                      <ul className="main-menu-list">
                        <li>
                          <Link
                            to="/products"
                            onClick={() => {
                              tracking && tracking.track("Products List");
                            }}
                          >
                            PRODUCTS &amp; MATERIALS
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/projects"
                            onClick={() => {
                              tracking && tracking.track("Projects List");
                            }}
                          >
                            MY PROJECTS
                          </Link>
                        </li>
                        {/* <li>
                          <Link
                            to="/"
                          onClick={() => {
                            tracking && tracking.track("Projects List");
                          }}
                          >
                            TEAM CHATS
                          </Link>
                        </li> */}
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default withTracking(withAuth(Header));
