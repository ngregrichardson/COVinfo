import React, { Component } from "react";
import moment from "moment";
import { geolocated } from "react-geolocated";
import Geocode from "react-geocode";
import HashLoader from "react-spinners/HashLoader";
import NewsStory from "./newsStory";
import { Scrollbars } from "react-custom-scrollbars";
class News extends Component {
  state = {
    global: { articles: [], loading: true },
    local: { articles: [], loading: true },
    coords: { latitude: null, longitude: null },
  };

  componentDidMount() {
    document.title = "Dashboard | COVInfo";
    this.handleGetNews().then((articles) => {
      this.setState({
        global: { articles, loading: false },
      });
    });
    if (this.props.isGeolocationAvailable && this.props.isGeolocationEnabled) {
      this.handleGetNews().then((articles) => {
        setTimeout(() => {
          let { coords } = this.props;
          if (coords !== null) {
            Geocode.fromLatLng(coords.latitude, coords.longitude).then(
              (response) => {
                const state = response.results[0].address_components.filter(
                  (add) => add.types.includes("administrative_area_level_1")
                )[0].long_name;
                this.handleGetNews(state).then((articles) => {
                  this.setState({
                    local: { articles, loading: false },
                  });
                });
              },
              (error) => {
                console.error(error);
              }
            );

            this.setState({
              local: { articles, loading: false },
            });
          }
        }, 1000);
      });
    }
  }

  handleGetNews = (term = "") => {
    return new Promise((res, rej) => {
      term = " " + term;
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
          <h3 className="flex ml-2">Local Coronavirus News</h3>
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
                      <NewsStory article={article} key={article.publishedAt} />
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
                      <NewsStory article={article} key={article.publishedAt} />
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

export default geolocated({
  positionOptions: {
    enableHighAccuracy: false,
  },
  userDecisionTimeout: null,
})(News);
