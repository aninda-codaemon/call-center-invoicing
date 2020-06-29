import React, {useState} from 'react';

import PlacesAutocomplete, {
  geocodeByAddress,
  geocodeByPlaceId,
  getLatLng,
} from 'react-places-autocomplete';

const Locationsearch = (props) => {
  const google = window.google;
  let geocoder = new google.maps.Geocoder;
  console.log('props places', props.value.replace(/[&\/\\#+()$~%.'":*?<>{}]/g, ''));
  const [address, setAddress] = useState(props.value.replace(/[&\/\\#+()$~%.'":*?<>{}]/g, ''));
  
  const [inputVal, setInputVal] = useState("");
  const [isLatlong, setIsLatlong] = useState(false);

  

	const handleChange = async (address) => {	
   
    let latlngStr = address.split(',', 2);
    let latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};	
    // console.log("latlong"+latlngStr[0]);

    // 40.714224,-73.961452
    // New York University, New York, NY, USA
   
    if(isNaN(latlng.lat) === false && isNaN(latlng.lng) === false){
      setInputVal(latlng.lat+","+latlng.lng);
      setIsLatlong(true);
     // console.log("hello");
        geocoder.geocode({'location': latlng}, async function(results, status) {
          /// console.log("address23"+results[0].formatted_address);
          if(status === "OK"){
            setAddress(results[0].formatted_address);

          }
         
         try {

          //alert(address);
          const geocode = await geocodeByAddress(address);  
          console.log("fghf"+geocode[0]);
                    
          const latLang = await getLatLng(geocode[0]);  		      
          geocode[0].address_components.forEach(element => {
            if (element.types[0] === "postal_code") {          
              props.onSelect({ description: results[0].formatted_address, latlng: latLang, zip_code: element.long_name, place: props.place });
            }
          });      
        } catch (error) {
          console.log('Geocoding error');
          ///console.log(error);
          props.onSelect({ description: address, latlng: {}, zip_code: '', place: props.place });
          // setAddress('');
        }
        });
        
    
    }else{
      //console.log("hello Piu");
      setAddress(address);
      setInputVal(address);
      setIsLatlong(false);
      try {

        
        const geocode = await geocodeByAddress(address);  
        // console.log("fghf"+geocode[0]);
                  
        const latLang = await getLatLng(geocode[0]);  		      
        geocode[0].address_components.forEach(element => {
          if (element.types[0] === "postal_code") {          
            props.onSelect({ description: address, latlng: latLang, zip_code: element.long_name, place: props.place });
          }
        });      
      } catch (error) {
        console.log('Geocoding error');
        ///console.log(error);
        props.onSelect({ description: address, latlng: {}, zip_code: '', place: props.place });
        // setAddress('');
      }
  
    }

  };

  const handleSelect = async (address) => {	
    let latlngStr = address.split(',', 2);
    let latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};	
    // console.log("latlong"+latlngStr[0]);

    // 40.714224,-73.961452
    // New York University, New York, NY, USA
   
    if(isNaN(latlng.lat) === false && isNaN(latlng.lng) === false){
      setInputVal(latlng);
      setIsLatlong(true);
      //console.log("hello");
        geocoder.geocode({'location': latlng}, function(results, status) {
          /// console.log("address23"+results[0].formatted_address);
          if(status === "OK"){
            setAddress(results[0].formatted_address);

          }
        });
    }else{
      //console.log("hello Piu");
      setAddress(address);
      setInputVal(address);
      setIsLatlong(true);
      
    }
  	try {
  		const geocode = await geocodeByAddress(address);  		
  		const latLang = await getLatLng(geocode[0]);  		
      geocode[0].address_components.forEach(element => {
        if (element.types[0] === "postal_code") {          
          props.onSelect({ description: address, latlng: latLang, zip_code: element.long_name, place: props.place });
        }
      });
  	} catch (error) {
  		console.log('Geocoding error');
      //console.log(error);
      props.onSelect({ description: address, latlng: {}, zip_code: '', place: props.place });
      // setAddress('');
  	}
  };

  const renderFunc = ({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div className="form-group">
            <input
              {...getInputProps({
                placeholder: 'Search locations',
                className: 'location-search-input float-input',
              })}
            />
            <label>{props.label}</label>
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map(suggestion => {
                const className = suggestion.active
                  ? 'suggestion-item--active'
                  : 'suggestion-item';
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                  : { backgroundColor: '#ffffff', cursor: 'pointer' };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );

  return (
    
  		<PlacesAutocomplete
        value={inputVal}
        onChange={handleChange}
        onSelect={handleSelect}
        debounce={500}
        shouldFetchSuggestions={address.length > 3 && isLatlong === false}
      >
      	{ renderFunc }
      </PlacesAutocomplete>
  	);

}

export default Locationsearch;