import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { getData } from "country-list";
import { connect } from "react-redux";
import firebase from "firebase/app";
import { TwitterPicker } from "react-color";
import { LogOut } from "react-feather";
import { useHistory } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import Logo from "./logo";

function Settings(props) {
  const [username, setUsername] = useState(
    props.user ? props.user.username : ""
  );
  const [country, setCountry] = useState(props.user ? props.user.country : "");
  const [color, setColor] = useState(
    props.user ? props.user.username_color : "ffffff"
  );
  const [updatedValues, setUpdatedValues] = useState({});
  const [colorPicker, setColorPicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const countries = getData();
  const history = useHistory();
  const { addToast } = useToasts();

  useEffect(() => {
    if (props.user) {
      setLoading(false);
      if (props.user.username !== username) {
        setUsername(props.user.username);
      }
      if (props.user.country !== country) {
        setCountry(props.user.country);
      }
      if (props.user.username_color !== color) {
        setColor(props.user.username_color);
      }
    }
  }, [props.user, username, setUsername, country, setCountry, color, setColor]);

  let handleSaveUser = () => {
    firebase
      .firestore()
      .collection("users")
      .doc(props.user.user_id)
      .update(updatedValues)
      .then(() => {
        props.updateUser({ ...props.user, ...updatedValues });
        setUpdatedValues({});
        addToast("User saved.", {
          appearance: "success",
          autoDismiss: true,
        });
      })
      .catch((e) => {
        console.log(e);
        addToast("There was a problem saving the user.", {
          appearance: "error",
          autoDismiss: true,
        });
      });
  };

  let handleUpdateValue = (key, value) => {
    let temp = updatedValues;
    temp[key] = value;
    setUpdatedValues(temp);
  };

  let toggleColorPicker = () => {
    setColorPicker(!colorPicker);
  };

  let handleLogOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        history.push("/");
        addToast("Logged out.", {
          appearance: "success",
          autoDismiss: true,
        });
      })
      .catch((e) => {
        console.log(e);
        addToast("There was a problem logging out.", {
          appearance: "error",
          autoDismiss: true,
        });
      });
  };

  return (
    <div className="w-100 h-100 d-flex align-items-center justify-content-center offWhiteBackground position-relative">
      {loading ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.4)",
          }}
          className="d-flex align-items-center justify-content-center"
        >
          <Logo color={"lime"} size={100} className="spinning-logo" />
        </div>
      ) : null}
      <div className="bg-white d-flex flex-column align-items-center p-5 rounded boxShadow">
        <h3>Settings</h3>
        <div style={{ height: 1, width: "25%", backgroundColor: "gray" }} />
        <Form>
          <Form.Group controlId="settingsUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Username..."
              value={updatedValues.username || username}
              onChange={(e) => {
                setUsername(e.target.value);
                handleUpdateValue("username", e.target.value);
              }}
            />
          </Form.Group>
          <Form.Group controlId="settingsCountry">
            <Form.Label>Country</Form.Label>
            <Form.Control
              as="select"
              value={updatedValues.country || country}
              onChange={(e) => {
                setCountry(e.target.value);
                handleUpdateValue("country", e.target.value);
              }}
            >
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="settingsColor">
            <div className="d-flex flex-row align-items-center justify-content-center">
              <div
                className="rounded mr-2 position-relative"
                style={{
                  width: 30,
                  height: 30,
                  backgroundColor: `#${updatedValues.username_color || color}`,
                }}
              >
                <div
                  style={{ cursor: "pointer", width: 30, height: 30 }}
                  onClick={(e) => {
                    e.preventDefault();
                    toggleColorPicker();
                  }}
                />
                {colorPicker ? (
                  <div
                    style={{
                      position: "absolute",
                      left: "-20%",
                      top: "130%",
                    }}
                  >
                    <div
                      style={{
                        position: "fixed",
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                      }}
                      onClick={toggleColorPicker}
                    />
                    <TwitterPicker
                      color={`#${updatedValues.username_color || color}`}
                      onChangeComplete={(color) => {
                        setColor(color.hex.split("#")[1]);
                        handleUpdateValue(
                          "username_color",
                          color.hex.split("#")[1]
                        );
                        toggleColorPicker();
                      }}
                    />
                  </div>
                ) : null}
              </div>
              <h6 className="mb-0">Username Color</h6>
            </div>
          </Form.Group>
        </Form>
        <button
          className={`bg-white smLoginButton rounded-pill py-2 px-3 ${
            Object.keys(updatedValues).length === 0 ? "fullButton" : ""
          }`}
          onClick={handleSaveUser}
          disabled={Object.keys(updatedValues).length === 0}
        >
          Save User
        </button>
        <button
          className="bg-white smLoginButton rounded-pill py-2 px-3 text-danger mt-2"
          onClick={handleLogOut}
        >
          <LogOut /> Log Out
        </button>
      </div>
    </div>
  );
}

let mapStateToProps = (state, ownProps) => {
  return { ...ownProps, user: state.user };
};

let mapDispatchToProps = (dispatch) => {
  return { updateUser: (user) => dispatch({ type: "UPDATE_USER", user }) };
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
