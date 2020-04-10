import React, { useState } from "react";
import firebase from "firebase";
import { Facebook, GitHub } from "react-feather";
import { Form, Tab, Tabs } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { getData } from "country-list";
import { useToasts } from "react-toast-notifications";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [country, setCountry] = useState("US");
  const countries = getData();
  const { addToast } = useToasts();

  let history = useHistory();

  let validateEmail = (eml) => {
    let regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(String(eml).toLowerCase());
  };

  let createUserData = (uid) => {
    firebase
      .firestore()
      .collection("users")
      .doc(uid)
      .set({ username, country, username_color: "000000", user_id: uid })
      .then(() => {
        history.push("/");
        addToast("User created.", {
          appearance: "success",
          autoDismiss: true,
        });
      })
      .catch((e) => {
        console.log(e);
        addToast("There was a problem creating the user.", {
          appearance: "error",
          autoDismiss: true,
        });
      });
  };

  let handleRegisterWithEmail = () => {
    if (username.trim() === "") {
      return addToast("A valid username is required.", {
        appearance: "error",
        autoDismiss: true,
      });
    }
    if (email.trim() === "" || !validateEmail(email)) {
      return addToast("A valid email is required.", {
        appearance: "error",
        autoDismiss: true,
      });
    }
    if (password.trim() === "" || confirmPassword.trim() === "") {
      return addToast("A valid password is required.", {
        appearance: "error",
        autoDismiss: true,
      });
    }
    if (password === confirmPassword) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((user) => {
          createUserData(user.user.uid);
        })
        .catch((e) => {
          console.log(e);
          addToast("There was a problem creating the user.", {
            appearance: "error",
            autoDismiss: true,
          });
        });
    } else {
      return addToast("Passwords do not match", {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  let handleLoginWithFacebook = () => {
    if (username.trim() === "") {
      return addToast("A valid username is required.", {
        appearance: "error",
        autoDismiss: true,
      });
    }
    firebase
      .auth()
      .signInWithPopup(new firebase.auth.FacebookAuthProvider())
      .then()
      .then((user) => {
        createUserData(user.user.uid);
      })
      .catch((e) => {
        console.log(e);
        addToast("There was a problem creating the user.", {
          appearance: "error",
          autoDismiss: true,
        });
      });
  };

  let handleLoginWithGithub = () => {
    if (username.trim() === "") {
      return addToast("A valid username is required.", {
        appearance: "error",
        autoDismiss: true,
      });
    }
    firebase
      .auth()
      .signInWithPopup(new firebase.auth.GithubAuthProvider())
      .then()
      .then((user) => {
        createUserData(user.user.uid);
      })
      .catch((e) => {
        console.log(e);
        addToast("There was a problem creating the user.", {
          appearance: "error",
          autoDismiss: true,
        });
      });
  };

  return (
    <div className="w-100 h-100 d-flex align-items-center justify-content-center offWhiteBackground">
      <div className="bg-white d-flex flex-column align-items-center p-5 rounded boxShadow">
        <h3>Register</h3>
        <div
          style={{
            height: 1,
            width: "25%",
            backgroundColor: "gray",
            marginBottom: 15,
          }}
        />
        <Tabs defaultActiveKey="email" id={"registerTabs"}>
          <Tab eventKey="email" title="Email">
            <div className="d-flex flex-column align-items-center">
              <Form>
                <Form.Group controlId="emailUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Username..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="emailCountry">
                  <Form.Label>Country</Form.Label>
                  <Form.Control
                    as="select"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  >
                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="emailEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="emailPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="emailConfirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm Password..."
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </Form.Group>
              </Form>
              <button
                className="bg-white smLoginButton rounded-pill w-25 py-2"
                onClick={handleRegisterWithEmail}
              >
                Register
              </button>
            </div>
          </Tab>
          <Tab eventKey="facebook" title="Facebook">
            <div className="d-flex flex-column align-items-center">
              <Form>
                <Form.Group controlId="facebookUsername">
                  <Form.Label>Create Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Create Username..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="facebookCountry">
                  <Form.Label>Country</Form.Label>
                  <Form.Control
                    as="select"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  >
                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Form>
              <button
                className="bg-white smLoginButton rounded-pill w-25 py-2"
                onClick={handleLoginWithFacebook}
              >
                <Facebook /> Register
              </button>
            </div>
          </Tab>
          <Tab eventKey="github" title="Github">
            <div className="d-flex flex-column align-items-center">
              <Form>
                <Form.Group controlId="githubUsername">
                  <Form.Label>Create Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Create Username..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="githubCountry">
                  <Form.Label>Country</Form.Label>
                  <Form.Control
                    as="select"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  >
                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Form>
              <button
                className="bg-white smLoginButton rounded-pill w-25 py-2"
                onClick={handleLoginWithGithub}
              >
                <GitHub /> Register
              </button>
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}

export default Register;
