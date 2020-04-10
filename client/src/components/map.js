import React, { useEffect } from "react";
import Iframe from "react-iframe";

function Map() {
  useEffect(() => {
    document.title = "Map | COVinfo";
  }, []);

  return (
    <Iframe url="https://covid19.health/" width={"100%"} height={"100%"} />
  );
}

export default Map;
