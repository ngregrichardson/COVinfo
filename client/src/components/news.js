import React, { useEffect, useState } from "react";
import moment from "moment";
import NewsStory from "./newsStory";
import { Scrollbars } from "react-custom-scrollbars";
import { connect } from "react-redux";
import { getName } from "country-list";
import ReactCountryFlag from "react-country-flag";
import Logo from "./logo";
import { useMediaQuery } from "react-responsive";
import { useToasts } from "react-toast-notifications";
import { Tab, Tabs } from "react-bootstrap";

function News(props) {
  const [global, setGlobal] = useState({ articles: [], loading: true });
  const [local, setLocal] = useState({
    articles: [],
    loading: true,
    title: "Local Coronavirus News",
  });
  const [authed, setAuthed] = useState(props.authed);
  const { addToast } = useToasts();
  const isSmallDevice = useMediaQuery({
    query: "(max-device-width: 1024px)",
  });

  useEffect(() => {
    if (props.authed !== authed) {
      setAuthed(props.authed);
      setLocal({ ...local, loading: true });
    }
  }, [props.authed]);

  let handleGetNews = (term = "") => {
    return new Promise((res, rej) => {
      term = " " + getName(term);
      fetch(
        `https://newsapi.org/v2/everything?q=coronavirus${term}&from=${moment()
          .subtract(14, "days")
          .format(
            "YYYY-MM-DD"
          )}&sortBy=relevancy&language=en&apiKey=a24bf4b7cea34b6c88e899238f856cfa`
      )
        .then((d) => d.json())
        .then((json) => {
          if (json.status !== "error") {
            res(json.articles);
          } else {
            rej("There was a problem getting the news.");
          }
        })
        .catch((e) => {
          rej("There was a problem getting the news.");
        });
    });
  };

  let getLocalNews = () => {
    if (authed && props.user) {
      let usr = props.user;
      handleGetNews(usr.country)
        .then((articles) => {
          setLocal({
            articles,
            loading: false,
            title: `Local Coronavirus News (${usr.country})`,
            country: usr.country,
          });
        })
        .catch((e) =>
          addToast(e, {
            appearance: "error",
            autoDismiss: true,
          })
        );
    } else {
      handleGetNews("United States of America")
        .then((articles) => {
          setLocal({
            articles,
            loading: false,
            title: `Local Coronavirus News (US)`,
            country: "US",
          });
        })
        .catch((e) =>
          addToast(e, {
            appearance: "error",
            autoDismiss: true,
          })
        );
    }
  };

  useEffect(() => {
    document.title = "Dashboard | COVinfo";
    handleGetNews().then((articles) => {
      setGlobal({ articles, loading: false });
    });
    getLocalNews();
  }, []);

  if (isSmallDevice) {
    return (
      <div className={"d-flex flex-column flex pt-3 pl-1"}>
        <Tabs defaultActiveKey="global" id={"newsTabs"}>
          <Tab eventKey="global" title="Global" className={"mb-4 h-100"}>
            <div className="d-flex flex-column h-100">
              <div
                className={`pt-1 pl-1 flex d-flex flex-column align-items-center ${
                  local.loading ? "justify-content-center" : ""
                }`}
              >
                <Scrollbars
                  renderView={(props) => (
                    <div
                      {...props}
                      className={`pr-2 flex d-flex flex-column align-items-center ${
                        global.loading ? "justify-content-center" : ""
                      }`}
                    />
                  )}
                >
                  {global.loading ? (
                    <Logo color={"lime"} size={100} className="spinning-logo" />
                  ) : (
                    global.articles.map((article) => {
                      if (article.title && article.title.trim() !== "") {
                        return (
                          <NewsStory
                            article={article}
                            key={
                              article.publishedAt +
                              article.title +
                              `${Math.random() * 5}`
                            }
                          />
                        );
                      }
                      return null;
                    })
                  )}
                </Scrollbars>
              </div>
            </div>
          </Tab>
          <Tab
            eventKey="local"
            title={
              <>
                Local
                <ReactCountryFlag
                  countryCode={local.country || ""}
                  className="ml-1"
                />
              </>
            }
            className={"mb-4 h-100"}
          >
            <div className="d-flex flex-column h-100">
              <div
                className={`pt-1 pl-1 flex d-flex flex-column align-items-center ${
                  local.loading ? "justify-content-center" : ""
                }`}
              >
                <Scrollbars
                  renderView={(props) => (
                    <div
                      {...props}
                      className={`pr-2 flex d-flex flex-column align-items-center ${
                        local.loading ? "justify-content-center" : ""
                      }`}
                    />
                  )}
                >
                  {local.loading ? (
                    <Logo color={"lime"} size={100} className="spinning-logo" />
                  ) : (
                    local.articles.map((article) => {
                      if (article.title && article.title.trim() !== "") {
                        return (
                          <NewsStory
                            article={article}
                            key={
                              article.publishedAt +
                              article.title +
                              `${Math.random() * 5}`
                            }
                          />
                        );
                      }
                      return null;
                    })
                  )}
                </Scrollbars>
              </div>
            </div>
          </Tab>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="d-flex flex-row flex p-3">
      <div className="d-flex flex-column flex">
        <h3 className="ml-2">Global Coronavirus News</h3>
        <div
          className={`p-1 flex d-flex flex-column align-items-center ${
            local.loading ? "justify-content-center" : ""
          }`}
        >
          <Scrollbars
            renderView={(props) => (
              <div
                {...props}
                className={`pr-3 flex d-flex flex-column align-items-center ${
                  global.loading ? "justify-content-center" : ""
                }`}
              />
            )}
          >
            {global.loading ? (
              <Logo color={"lime"} size={100} className="spinning-logo" />
            ) : (
              global.articles.map((article) => {
                if (article.title && article.title.trim() !== "") {
                  return (
                    <NewsStory
                      article={article}
                      key={
                        article.publishedAt +
                        article.title +
                        `${Math.random() * 5}`
                      }
                    />
                  );
                }
                return null;
              })
            )}
          </Scrollbars>
        </div>
      </div>
      <div className="d-flex flex-column flex">
        <div className="ml-2 d-flex flex-row align-items-center mb-2">
          <h3 className="m-0">{local.title}</h3>
          <ReactCountryFlag
            countryCode={local.country || ""}
            className="ml-1"
          />
        </div>
        <div
          className={`p-1 flex d-flex flex-column align-items-center ${
            local.loading ? "justify-content-center" : ""
          }`}
        >
          <Scrollbars
            renderView={(props) => (
              <div
                {...props}
                className={`pr-3 flex d-flex flex-column align-items-center ${
                  local.loading ? "justify-content-center" : ""
                }`}
              />
            )}
          >
            {local.loading ? (
              <Logo color={"lime"} size={100} className="spinning-logo" />
            ) : (
              local.articles.map((article) => {
                if (article.title && article.title.trim() !== "") {
                  return (
                    <NewsStory
                      article={article}
                      key={
                        article.publishedAt +
                        article.title +
                        `${Math.random() * 5}`
                      }
                    />
                  );
                }
                return null;
              })
            )}
          </Scrollbars>
        </div>
      </div>
    </div>
  );
}

let mapStateToProps = (state, ownProps) => {
  return { ...ownProps, user: state.user, authed: state.authed };
};

export default connect(mapStateToProps)(News);
