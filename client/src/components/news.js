import React, { Component } from "react";
import moment from "moment";
import HashLoader from "react-spinners/HashLoader";
import NewsStory from "./newsStory";
import { Scrollbars } from "react-custom-scrollbars";
import {connect} from 'react-redux';
import { getName } from "country-list";


class News extends Component {
  state = {
    global: { articles: [], loading: true },
    local: { articles: [], loading: true, title: 'Local Coronavirus News' },
    coords: { latitude: null, longitude: null },
  };

  componentDidUpdate(oldProps) {
    const newProps = this.props;
    if(oldProps.authed !== newProps.authed) {
      this.setState({local: {...this.state.local, loading: true}})
      this.getLocalNews();
    }
  }

  getLocalNews = () => {
    if (this.props.authed) {
      this.handleGetNews(this.props.user.country).then((articles) => {
        this.setState({
          local: { articles, loading: false, title: `Local Coronavirus News (${this.props.user.country})` },
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
          <h3 className="flex ml-2">{local.title}</h3>
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
                <HashLoader size={75} />
              ) : (
                this.state.global.articles.map((article) => {
                  if (article.title && article.title.trim() !== "") {
                    return (
                      <NewsStory article={article} key={article.publishedAt + article.title + `${Math.random() * 5}`} />
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
                <HashLoader size={75} />
              ) : (
                this.state.local.articles.map((article) => {
                  if (article.title && article.title.trim() !== "") {
                    return (
                      <NewsStory article={article} key={article.publishedAt + article.title + `${Math.random() * 5}`} />
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
  return{...ownProps, user: state.user, authed: state.authed}
};

export default connect(mapStateToProps)(News);
