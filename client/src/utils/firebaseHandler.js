import firebase from "firebase/app";
import rootStore from "../stores/rootStore";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/analytics";
import "firebase/performance";

let initFirebase = () => {
  firebase.initializeApp({
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID,
  });
  firebase.analytics();
  firebase.performance();
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      firebase
        .firestore()
        .collection("users")
        .doc(user.uid)
        .get()
        .then((userData) => {
          if (userData.exists) {
            rootStore.dispatch({
              type: "UPDATE_USER",
              user: userData.data(),
            });
          } else {
            createBasicUser(user);
          }
        })
        .catch((e) => {
          createBasicUser(user);
        });
    } else {
      rootStore.dispatch({
        type: "CLEAR_USER",
      });
    }
  });
};

let createBasicUser = (user) => {
  let userData = {
    username: user.displayName,
    country: "US",
    username_color: "000000",
    user_id: user.uid,
  };
  firebase
    .firestore()
    .collection("users")
    .doc(user.uid)
    .set(userData)
    .then(() =>
      rootStore.dispatch({
        type: "UPDATE_USER",
        user: userData,
      })
    );
};

export { initFirebase };
