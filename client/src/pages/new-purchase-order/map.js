import React from "react";
import MapInit from "./mapinit";

const Map = ({ origin, destination }) => {

  return (
    <MapInit
      origin={origin}
      destination={destination}
      googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCcZyvEkGx4i1cQlbiFvQBM8kM_x53__5M"
      loadingElement={<div style={{ height: `100%` }} />}
    />
  );
};

export default Map;
