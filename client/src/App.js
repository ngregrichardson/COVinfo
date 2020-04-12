import React from "react";
import Navbar from "./components/navbar";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Map from "./components/map";
import News from "./components/news";
import Chat from "./components/chat";
import Login from "./components/login";
import { Provider } from "react-redux";
import rootStore from "./stores/rootStore";
import Register from "./components/register";
import Settings from "./components/settings";
import Music from "./components/music";
import Memes from "./components/memes";
import { ToastProvider } from "react-toast-notifications";

function App() {
  return (
    <Provider store={rootStore}>
      <ToastProvider autoDismissTimeout={3000}>
        <Router>
          <div className="d-flex flex-row h-100">
            <Navbar />
            <Switch>
              <Route path="/map">
                <Map />
              </Route>
              <Route path="/chat">
                <Chat />
              </Route>
              <Route path="/music">
                <Music />
              </Route>
              <Route path="/memes">
                <Memes />
              </Route>
              <Route path="/login">
                <Login />
              </Route>
              <Route path="/register">
                <Register />
              </Route>
              <Route path="/settings">
                <Settings />
              </Route>
              <Route path="/">
                <News />
              </Route>
            </Switch>
          </div>
        </Router>
      </ToastProvider>
    </Provider>
  );
}

export default App;
