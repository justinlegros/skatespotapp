import React from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow
} from "@react-google-maps/api";
import { formatRelative } from "date-fns";
import logo from "../images/skatespotblue.png";
import "./Parks.css";
import { Link } from "react-router-dom";
import MapStyles from "../mapStyles"
import icon from "../images/skateboard.svg"
import usePlacesAutoComplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";

import "@reach/combobox/styles.css"


// <Link to="/"> <img className="logo" src={logo} alt="" logo></img> </Link>

const libraries = ["places"];
const mapContainerStyle = {
  width: "100vw",
  height: "100vh"
};
const center = {
  lat: 43.653225,
  lng: -79.383186,
};

const options = {
  styles: MapStyles,
  disableDefaultUI: true,
  zoomControl: true,
  mapTypeControl: true,
}


export default function Parks() {

  const { isLoaded, loaderror} = useLoadScript ({
      googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
      libraries,
  });

  const [selected, setSelected] = React.useState(null);

  const [markers, setMarkers] = React.useState([]);

  const onMapClick = React.useCallback( (event) => {
    setMarkers((current) => [...current, {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
      time: new Date(),
    }]) }, []);

  const mapRef = React.useRef();

  const onMapLoad = React.useCallback( (map) => {
    mapRef.current = map;
  }, [])

  const panTo = React.useCallback(({lat,lng}) => {
    mapRef.current.panTo({lat,lng});
    mapRef.current.setZoom(14);
  }, []);

  if (loaderror) return "Error Loading Map";
  if (!isLoaded) return "Loading Map";

  return (
    <>
     
     <div className="MapWindow">
     <h1> Skate {" "} <span role="img" aria-label="skate"> 🛹</span> </h1>

    <Search panTo={panTo}/>

    <Locate panTo={panTo}/>

     <GoogleMap 
        mapContainerStyle={mapContainerStyle}
        zoom={8}
        center ={center}
        options ={options}
        onClick = {onMapClick}
        onLoad = {onMapLoad}
     >
      {markers.map((marker)=> (
      <Marker 
        key={ marker.time.toISOString()} 
        position={{lat: marker.lat, lng: marker.lng,}}
        icon = {{
          url: icon,
          scaledSize: new window.google.maps.Size(30,30),
          origin: new window.google.maps.Point(0,0),
          anchor: new window.google.maps.Point(15,15),
        }}
        onClick= { () => {
          setSelected(marker);
        }}
      /> 
      ))}
      {selected ? (<InfoWindow position={{ lat: selected.lat, lng: selected.lng}} onCloseClick={() => {
        setSelected(null);
      }}>
        <div>
          <h2> Skate Spot</h2>
          <p> Spot Added {formatRelative(selected.time, new Date())}</p>
        </div>
      </InfoWindow>) :null}
     </GoogleMap>
     </div>
    </>
  );
}

function Locate ({panTo}) {
  return ( <button className="locate"  onClick={() => {
    navigator.geolocation.getCurrentPosition((position) => {
        panTo({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
    }, () => null
    );
  }}> 
    <img src={icon} alt="compass - locate me"/>
  </button>
  )
}


function Search({panTo}){
  const {
    ready, 
    value, 
    suggestions: {status, data}, 
    setValue, 
    clearSuggestions,
  } = usePlacesAutoComplete({
    requestOptions: {
      location: {
        lat: () => 43.653225,
        lng: () => -79.383186, },
      radius: 200 * 1000,
    }
  });

  return (
  <div className="search"> 
  <Combobox onSelect={async (address) => {
    setValue(address, false);
    clearSuggestions();
    try {
      const results = await getGeocode({address});
      const {lat, lng} = await getLatLng(results[0]);
      panTo({lat,lng});
    } catch(error) {
      console.log("error!")
    }
    console.log(address);
    }}>

      <ComboboxInput 
      value={value} 
      onChange={(e) => {
        setValue(e.target.value);
      }}
      disabled= {!ready}
      placeholder="Enter an Address"
      />

      <ComboboxPopover>
        <ComboboxList>
        {status === "OK" && 
          data.map(({id, description})=> (
        <ComboboxOption key={id} value={description}/>))}
        </ComboboxList> 
      </ComboboxPopover>

  </Combobox>
  </div>
  );
}
