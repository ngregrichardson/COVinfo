import React, { Component } from "react";
import moment from "moment";
import NewsStory from "./newsStory";
import { Scrollbars } from "react-custom-scrollbars";
import { connect } from "react-redux";
import { getName } from "country-list";
import ReactCountryFlag from "react-country-flag";
import Logo from "./logo";

class News extends Component {
  state = {
    global: { articles: [], loading: true },
    local: { articles: [], loading: true, title: "Local Coronavirus News" },
    coords: { latitude: null, longitude: null },
  };

  componentDidUpdate(oldProps) {
    const newProps = this.props;
    if (oldProps.authed !== newProps.authed) {
      this.setState({ local: { ...this.state.local, loading: true } });
      this.getLocalNews();
    }
  }

  getLocalNews = () => {
    if (this.props.authed && this.props.user) {
      let usr = this.props.user;
      this.handleGetNews(usr.country).then((articles) => {
        this.setState({
          local: {
            articles,
            loading: false,
            title: `Local Coronavirus News (${usr.country})`,
            country: usr.country,
          },
        });
      });
    } else {
      this.handleGetNews("United States of America").then((articles) => {
        this.setState({
          local: {
            articles,
            loading: false,
            title: `Local Coronavirus News (US)`,
          },
        });
      });
    }
  };

  componentDidMount() {
    document.title = "Dashboard | COVinfo";
    this.handleGetNews().then((articles) => {
      this.setState({
        global: { articles, loading: false },
      });
    });
    this.getLocalNews();
  }

  handleGetNews = (term = "") => {
    return new Promise((res, rej) => {
      term = " " + getName(term);
      fetch(
        `http://newsapi.org/v2/everything?q=coronavirus${term}&from=${moment()
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

  render() {
    let { global, local } = this.state;
    return (
      <div className="d-flex flex-column flex p-3">
        <div className="d-flex flex-row">
          <h3 className="flex ml-2">Global Coronavirus News</h3>
          <div className="flex ml-2 d-flex flex-row align-items-center mb-2">
            <h3 className="m-0">{local.title}</h3>
            <ReactCountryFlag countryCode={local.country} className="ml-1" />
          </div>
        </div>
        <div className="d-flex flex-row flex">
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
                this.state.global.articles.map((article) => {
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
                this.state.local.articles.map((article) => {
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
}

let mapStateToProps = (state, ownProps) => {
  return { ...ownProps, user: state.user, authed: state.authed };
};

export default connect(mapStateToProps)(News);
