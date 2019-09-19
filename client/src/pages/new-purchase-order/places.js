import React, {useState} from 'react';

import PlacesAutocomplete, {
  geocodeByAddress,
  geocodeByPlaceId,
  getLatLng,
} from 'react-places-autocomplete';

const Locationsearch = (props) => {
	const [address, setAddress] = useState('');

	const handleChange = async (address) => {
		console.log('Handle change');
		console.log(address);
    setAddress(address);

    try {
  		const geocode = await geocodeByAddress(address);  		
  		console.log(geocode[0]);
  		const latLang = await getLatLng(geocode[0]);
  		console.log('Lat lang');
  		console.log(latLang);
  	} catch (error) {
  		console.log('Geocoding error');
  		console.log(error);
  	}

  };

  const handleSelect = async (address) => {
  	console.log('Handle select');
  	console.log(address);
  	setAddress(address);
  	try {
  		const geocode = await geocodeByAddress(address);
  		console.log(geocode[0]);
  		const latLang = await getLatLng(geocode[0]);
  		console.log('Lat lang');
  		console.log(latLang);

  	} catch (error) {
  		console.log('Geocoding error');
  		console.log(error);
  	}
  };

  const renderFunc = ({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div className="form-group">
            <input
              {...getInputProps({
                placeholder: 'Search Places ...',
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
        value={address}
        onChange={handleChange}
        onSelect={handleSelect}
      >
      	{ renderFunc }
      </PlacesAutocomplete>
  	);

}

export default Locationsearch;