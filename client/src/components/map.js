import React, { useCallback, useEffect, useState } from "react";
import ReactMapGl, { Source, Layer } from "react-map-gl";
import { connect } from "react-redux";
import ReactCountryFlag from "react-country-flag";
import Logo from "./logo";
import { useToasts } from "react-toast-notifications";
import { useMediaQuery } from "react-responsive";

const dataLayer = {
  id: "data",
  type: "fill",
  paint: {
    "fill-color": {
      property: "cases",
      stops: [
        [0, "#abdda4"],
        [10, "#e6f598"],
        [100, "#ffffbf"],
        [1000, "#fee08b"],
        [10000, "#fdae61"],
        [100000, "#f46d43"],
        [1000000, "#d53e4f"],
      ],
    },
    "fill-opacity": 0.8,
  },
};

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function Map(props) {
  const [viewport, setViewport] = useState({
    width: "100%",
    height: "100%",
    latitude: 39.9526,
    longitude: -75.1652,
    zoom: 5,
  });
  const [geoData, setGeoData] = useState(null);
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [loading, setLoading] = useState(true);
  const isSmallDevice = useMediaQuery({
    query: "(max-device-width: 1024px)",
  });
  const { addToast } = useToasts();

  let _onHover = (event) => {
    const { features } = event;
    const hovered = features && features.find((f) => f.layer.id === "data");
    setHoveredFeature(hovered);
  };

  window.onresize = () => {
    setViewport({ ...viewport, width: "100%", height: "100%" });
  };

  let _renderTooltip = () => {
    return hoveredFeature ? (
      <div className={isSmallDevice ? "small-map-tooltip" : "map-tooltip"}>
        <div className="d-flex flex-row align-items-center">
          <div className="font-weight-bold">
            {hoveredFeature.properties.ADMIN}
          </div>
          {hoveredFeature.properties.iso2 ? (
            <ReactCountryFlag
              countryCode={hoveredFeature.properties.iso2}
              className="ml-1"
            />
          ) : null}
        </div>
        <div style={{ width: "100%", height: 1, backgroundColor: "#fff" }} />
        {hoveredFeature.properties.cases !== undefined ? (
          <div>
            Total Cases: {numberWithCommas(hoveredFeature.properties.cases)}
          </div>
        ) : null}
        {hoveredFeature.properties.deaths !== undefined ? (
          <div>
            Deaths: {numberWithCommas(hoveredFeature.properties.deaths)}
          </div>
        ) : null}
        {hoveredFeature.properties.recovered !== undefined ? (
          <div>
            Recoveries: {numberWithCommas(hoveredFeature.properties.recovered)}
          </div>
        ) : null}
        {hoveredFeature.properties.tests !== undefined ? (
          <div>Tests: {numberWithCommas(hoveredFeature.properties.tests)}</div>
        ) : null}
        {hoveredFeature.properties.casesToday === undefined ||
        hoveredFeature.properties.casesToday === 0 ? null : (
          <div>
            Cases Today:{" "}
            {numberWithCommas(hoveredFeature.properties.casesToday)}
          </div>
        )}
        <div style={{ color: "gray", fontSize: "0.8em" }}>
          Data Provided by{" "}
          <a
            href="https://github.com/NovelCOVID/API"
            target="_blank"
            rel="noopener noreferrer"
          >
            NovelCOVID
          </a>
        </div>
      </div>
    ) : null;
  };

  let getInitialMapData = useCallback(() => {
    fetch("https://covinfo.tech/mapData")
      .then((response) => response.json())
      .then(({ geoJson, coronaJson }) => {
        if (!coronaJson.message) {
          coronaJson.forEach((country) => {
            let currFeature = geoJson.features.find(
              (feature) =>
                feature.properties.ISO_A3 === country.countryInfo.iso3
            );
            if (currFeature) {
              currFeature.properties = {
                ...currFeature.properties,
                cases: country.cases,
                deaths: country.deaths,
                recovered: country.recovered,
                casesToday: country.todayCases,
                tests: country.tests,
                iso2: country.countryInfo.iso2,
              };
              if (props.authed && props.user) {
                if (
                  props.user.country === country.countryInfo.iso2 ||
                  props.user.country === country.countryInfo.iso3
                ) {
                  setViewport({
                    ...viewport,
                    latitude: country.countryInfo.lat,
                    longitude: country.countryInfo.long,
                  });
                }
              }
            }
          });
          setGeoData(geoJson);
          setTimeout(() => setLoading(false), 1000);
        } else {
          setLoading(false);
          addToast("There was a problem loading the data", {
            appearance: "error",
            autoDismiss: true,
          });
        }
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
        addToast("There was a problem loading the data", {
          appearance: "error",
          autoDismiss: true,
        });
      });
  }, [addToast, props.authed, props.user]);

  useEffect(() => {
    document.title = "Map | COVinfo";
    getInitialMapData();
  }, [getInitialMapData]);

  return (
    <div style={{ flex: 1, position: "relative" }}>
      {loading ? (
        <div className="map-loading">
          <Logo color={"lime"} size={100} className="spinning-logo" />
        </div>
      ) : null}
      <ReactMapGl
        mapboxApiAccessToken={
          "pk.eyJ1IjoibmdyZWdyaWNoYXJkc29uIiwiYSI6ImNrOHY0dGdsdjA2NjYzZnNmMWVzZW53OGQifQ.OLl9xQNCBOTHwVRlz-06lA"
        }
        {...viewport}
        onViewportChange={setViewport}
        mapStyle="mapbox://styles/mapbox/dark-v9"
        onHover={_onHover}
      >
        <Source type="geojson" data={geoData}>
          <Layer {...dataLayer} />
        </Source>
        {_renderTooltip()}
      </ReactMapGl>
    </div>
  );
}

let mapStateToProps = (state, ownProps) => {
  return { ...ownProps, user: state.user, authed: state.authed };
};

export default connect(mapStateToProps)(Map);
