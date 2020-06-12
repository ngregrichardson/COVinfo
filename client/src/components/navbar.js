import React, { useEffect, useState } from "react";
import { Navbar, Nav, Modal, Button } from "react-bootstrap";
import {
  MessageSquare,
  Globe,
  FileText,
  Music,
  Image,
  Settings,
  LogIn,
  Menu,
  X,
} from "react-feather";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import Logo from "./logo";
import { useMediaQuery } from "react-responsive";
import SlidingPane from "react-sliding-pane";
import { withRouter } from "react-router-dom";

function NavBar(props) {
  const [aboutModalShown, setAboutModalShown] = useState(false);
  const [open, setOpen] = useState(false);
  const isSmallDevice = useMediaQuery({
    query: "(max-device-width: 1024px)",
  });

  useEffect(() => {
    if (isSmallDevice) {
      return props.history.listen(() => {
        setOpen(false);
      });
    }
  });

  let _renderNavbar = () => (
    <>
      <Navbar bg="dark" className="flex-column p-0">
        {isSmallDevice ? null : (
          <Navbar.Brand
            className="mr-0 text-white h6 px-3 d-flex flex-column align-items-center bg-transparent border-0 hover-spinner cursor-pointer"
            onClick={() => setAboutModalShown(true)}
          >
            <Logo color={"lime"} size={50} />
            COVinfo
          </Navbar.Brand>
        )}
        <Navbar.Collapse id="basic-navbar-nav" className="flex-column w-100">
          <Nav className="flex-column w-100 flex">
            <NavLink
              to={"/"}
              exact
              activeClassName={"current"}
              className="text-center py-3 w-100 nav-item"
            >
              <FileText size={35} />
            </NavLink>
            <NavLink
              to={"/map"}
              activeClassName={"current"}
              className="text-center py-3 w-100 nav-item"
            >
              <Globe size={35} />
            </NavLink>
            <NavLink
              to={"/chat"}
              activeClassName={"current"}
              className="text-center py-3 w-100 nav-item"
            >
              <MessageSquare size={35} />
            </NavLink>
            <NavLink
              to={"/music"}
              activeClassName={"current"}
              className="text-center py-3 w-100 nav-item"
            >
              <Music size={35} />
            </NavLink>
            <NavLink
              to={"/memes"}
              activeClassName={"current"}
              className="text-center py-3 w-100 nav-item"
            >
              <Image size={35} />
            </NavLink>
            <div className="flex" />
            {props.authed ? (
              <NavLink
                to={"/settings"}
                activeClassName={"current"}
                className="text-center py-3 w-100 nav-item"
              >
                <Settings size={35} />
              </NavLink>
            ) : (
              <NavLink
                to={"/login"}
                activeClassName={"current"}
                className="text-center py-3 w-100 nav-item"
              >
                <LogIn size={35} />
              </NavLink>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );

  let _renderAboutModal = () => (
    <Modal show={aboutModalShown} onHide={() => setAboutModalShown(false)}>
      <Modal.Header closeButton>
        <Modal.Title>About COVinfo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        COVinfo was designed and built during the 2020 Corona pandemic and an
        entry in{" "}
        <a
          href="https://hackquarantine.devpost.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Hack Quarantine
        </a>
        . The goal of COVinfo is to provide a one-stop-shop dashboard for
        important information regarding Corona, whether that includes up-to-date
        news, globally and locally, a visual representation of the global spread
        of Corona, or some materials to keep you distracted and staying healthy
        during these difficult times. COVinfo was built by{" "}
        <a
          href="https://ngregrichardson.dev"
          target="_blank"
          rel="noopener noreferrer"
        >
          Noah Richardson
        </a>{" "}
        and{" "}
        <a
          href="http://mayajohn.info"
          target="_blank"
          rel="noopener noreferrer"
        >
          Maya John
        </a>{" "}
        and is completely open sourced on{" "}
        <a
          href="https://github.com/ngregrichardson/COVinfo"
          target="_blank"
          rel="noopener noreferrer"
        >
          Github
        </a>
        .
      </Modal.Body>
      <Modal.Body>
        <strong>Built with:</strong>
        <br />
        Front-End:{" "}
        <a
          href="https://reactjs.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          React
        </a>
        <br />
        Back-End:{" "}
        <a
          href="https://expressjs.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Express
        </a>
        <br />
        Maps:{" "}
        <a
          href="https://www.mapbox.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Mapbox
        </a>
        <br />
        Data Sources:{" "}
        <a
          href="https://newsapi.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          News API
        </a>
        ,{" "}
        <a
          href="https://corona.lmao.ninja/"
          target="_blank"
          rel="noopener noreferrer"
        >
          NovelCOVID
        </a>
        ,{" "}
        <a
          href="https://datahub.io/core/geo-countries"
          target="_blank"
          rel="noopener noreferrer"
        >
          DataHub
        </a>
      </Modal.Body>
    </Modal>
  );

  let _renderToggle = () => (
    <Button
      className="align-self-start ml-2 mt-2"
      style={{
        zIndex: 50,
        marginBottom: open ? 12 : 8,
        border: open ? "none" : "solid 2px rgba(255, 255, 255, 0.5)",
        backgroundColor: "transparent",
      }}
      onClick={() => setOpen(!open)}
    >
      {open ? (
        <X className="text-white-50" />
      ) : (
        <Menu className="text-white-50" />
      )}
    </Button>
  );

  return isSmallDevice ? (
    <>
      <SlidingPane
        isOpen={open}
        from={"left"}
        width={"25%"}
        onRequestClose={() => setOpen(!open)}
        className="bg-dark navbarZIndex"
        overlayClassName="navbarOverlayZIndex"
        closeIcon={<div />}
      >
        {_renderNavbar()}
      </SlidingPane>
      <div
        style={{
          zIndex: 50,
          backgroundColor: "#343a40",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {_renderToggle()}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
          className="mr-2"
        >
          <h3 className="text-white mb-0 mr-1">COVinfo</h3>
          <Button
            style={{
              backgroundColor: "transparent",
              borderColor: "transparent",
              padding: 0,
            }}
            onClick={() => setAboutModalShown(true)}
          >
            <Logo color={"lime"} size={45} />
          </Button>
        </div>
      </div>
      {_renderAboutModal()}
    </>
  ) : (
    <>
      {_renderNavbar()}
      {_renderAboutModal()}
    </>
  );
}

let mapStateToProps = (state, ownProps) => {
  return { ...ownProps, user: state.user, authed: state.authed };
};

export default connect(mapStateToProps)(withRouter(NavBar));
