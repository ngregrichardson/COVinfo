import React, { useState } from "react";
import firebase from "firebase";
import { Facebook, GitHub } from "react-feather";
import { Form } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { useToasts } from "react-toast-notifications";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();
  const { addToast } = useToasts();

  let handleNavigateToRegister = () => {
    history.push("/register");
  };

  let handleLoginWithEmail = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        history.push("/");
        addToast("Logged in.", {
          appearance: "success",
          autoDismiss: true,
        });
      })
      .catch((e) => {
        console.log(e);
        addToast("There was a problem logging in.", {
          appearance: "error",
          autoDismiss: true,
        });
      });
  };

  let handleLoginWithFacebook = () => {
    firebase
      .auth()
      .signInWithPopup(new firebase.auth.FacebookAuthProvider())
      .then()
      .then((user) => {
        history.push("/");
        addToast("Logged in.", {
          appearance: "success",
          autoDismiss: true,
        });
      })
      .catch((e) => {
        console.log(e);
        addToast("There was a problem logging in.", {
          appearance: "error",
          autoDismiss: true,
        });
      });
  };

  let handleLoginWithGithub = () => {
    firebase
      .auth()
      .signInWithPopup(new firebase.auth.GithubAuthProvider())
      .then()
      .then((user) => {
        history.push("/");
        addToast("Logged in.", {
          appearance: "success",
          autoDismiss: true,
        });
      })
      .catch((e) => {
        console.log(e);
        addToast("There was a problem logging in.", {
          appearance: "error",
          autoDismiss: true,
        });
      });
  };

  return (
    <div className="w-100 h-100 d-flex align-items-center justify-content-center offWhiteBackground">
      <div className="bg-white d-flex flex-column align-items-center form-padding rounded boxShadow">
        <h3>Log in</h3>
        <div style={{ height: 1, width: "25%", backgroundColor: "gray" }} />
        <div className="d-flex flex-row align-items-center justify-content-center p-3">
          <button
            className="smLoginButton bg-white rounded-circle p-2 d-flex align-items-center justify-content-center mx-2"
            onClick={handleLoginWithFacebook}
          >
            <Facebook />
          </button>
          <button
            className="smLoginButton bg-white rounded-circle p-2 d-flex align-items-center justify-content-center mx-2"
            onClick={handleLoginWithGithub}
          >
            <GitHub />
          </button>
        </div>
        <span className="mb-2 text-muted">or use your email</span>
        <Form>
          <Form.Group controlId="formGroupEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formGroupPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <button className="bg-transparent border-0 float-right align-self-end mb-3">
            Forgot Password?
          </button>
        </Form>
        <button
          className="bg-white smLoginButton rounded-pill py-2 px-3"
          onClick={handleLoginWithEmail}
        >
          Log in
        </button>
        <button
          className="bg-white smLoginButton rounded-pill py-2 px-3 mt-3"
          onClick={handleNavigateToRegister}
        >
          Register
        </button>
      </div>
    </div>
  );
}

export default Login;
