import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import {
  Monitor,
  MessageSquare,
  Globe,
  ShoppingCart,
  Music,
  Image,
  Settings,
    LogIn
} from "react-feather";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import Logo from "./logo";

function NavBar(props) {
  return (
    <Navbar bg="dark" className="flex-column p-0">
      <Navbar.Brand className="mr-0 text-white h6 px-3 d-flex flex-column align-items-center">
        <Logo color={"lime"} size={50} />
        COVInfo
      </Navbar.Brand>
      <Navbar.Collapse id="basic-navbar-nav" className="flex-column w-100">
        <Nav className="flex-column w-100 flex">
          <NavLink
            to={"/"}
            exact
            activeClassName={"current"}
            className="text-center py-3 w-100 nav-item"
          >
            <Monitor size={35} />
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
          <NavLink
            to={"/shop"}
            activeClassName={"current"}
            className="text-center py-3 w-100 nav-item"
          >
            <ShoppingCart size={35} />
          </NavLink>
          <div className="flex" />
          {props.authed ? <NavLink
              to={"/settings"}
              activeClassName={"current"}
              className="text-center py-3 w-100 nav-item"
          >
            <Settings size={35} />
          </NavLink> : <NavLink
              to={"/login"}
              activeClassName={"current"}
              className="text-center py-3 w-100 nav-item"
          >
            <LogIn size={35} />
          </NavLink>}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

let mapStateToProps = (state, ownProps) => {
  return { ...ownProps, user: state.user, authed: state.authed };
};

export default connect(mapStateToProps)(NavBar);
