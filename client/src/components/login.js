import React, { useState } from "react";
import firebase from "firebase";
import { Facebook, GitHub } from "react-feather";
import { Form } from "react-bootstrap";
import { useHistory } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  let history = useHistory();

  let handleLoginWithEmail = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        history.push("/");
      })
      .catch((e) => console.log(e));
  };

  let handleLoginWithFacebook = () => {
    firebase
      .auth()
      .signInWithPopup(new firebase.auth.FacebookAuthProvider())
      .then()
      .then((user) => {
        history.push("/");
      })
      .catch((e) => console.log(e));
  };

  let handleLoginWithGithub = () => {
    firebase
      .auth()
      .signInWithPopup(new firebase.auth.GithubAuthProvider())
      .then()
      .then((user) => {
        history.push("/");
      })
      .catch((e) => console.log(e));
  };

  return (
    <div className="w-100 h-100 d-flex align-items-center justify-content-center offWhiteBackground">
      <div className="bg-white d-flex flex-column align-items-center p-5 rounded boxShadow">
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
        <span className="mb-2">or use your email</span>
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
          className="bg-white smLoginButton rounded-pill w-25 py-2"
          onClick={handleLoginWithEmail}
        >
          Log in
        </button>
      </div>
    </div>
  );
}

export default Login;
