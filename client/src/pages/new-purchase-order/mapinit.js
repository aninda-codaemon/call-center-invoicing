import React, { useState, useEffect } from "react";
import {
  withGoogleMap,
  GoogleMap,
  DirectionsRenderer
} from "react-google-maps";

const MapInit = (props) => {
  const { google } = window;
  const [mapData, setMapData] = useState({
    directions: null
  });

  const GoogleMapExample = withGoogleMap(props => (
    <GoogleMap
      defaultCenter={{
        lat: 40.756795,
        lng: -73.954298
      }}
      defaultZoom={13}
    >
      <DirectionsRenderer directions={mapData.directions} />{" "}
    </GoogleMap>
  ));

  const directionsService = new google.maps.DirectionsService();
  const origin = {
    lat: props.origin.lat,
    lng: props.origin.lng
  };
  const destination = {
    lat: props.destination.lat,
    lng: props.destination.lng
  };

  directionsService.route(
    {
      origin: origin,
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING
    },
    (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        setMapData({
          directions: result
        });
      } else {
        console.error(`error fetching directions ${result}`);
      }
    }
  );

  return (
    <div>
      <GoogleMapExample
        containerElement={
          <div
            style={{
              height: `400px`,
              width: "100%"
            }}
          />
        }
        mapElement={
          <div
            style={{
              height: `100%`
            }}
          />
        }
      />
    </div>
  );
};

export default MapInit;
