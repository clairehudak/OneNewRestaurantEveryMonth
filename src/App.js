import React, { Component } from 'react';
import './App.css';
import MyMap from "./Components/Map";
import FoursquareAPI from "./API/FoursquareApi";
import Sidebar from "./Components/Sidebar";

//*************************************************************************
// Venue IDs for ONREM Restaurants if using FoursquareAPI.getVenueDetails
//*************************************************************************
// const venueIds = [
//   "58d16ebd9465dd2288ccb7da", //Salsa Limon
//   "4dfe860452b1267800ce999d", // Velvet Taco
//   "4b462688f964a520391826e3", // The Great Outdoors Sub Shop
//   "4d115af70c786ea8994bd0ab", // Nick & Sam's
//   "582df1a698015f3d10f1a40c", // Wayback Burgers
//   "555b7d12498eb806f3b30074", // Super Chix
//   "579b5d25498e4beb8928536a", // Little Greek
//   "5914aba9d1a4021be81aabef", // Cbowls Poke
//   "4e961f5261af7b877161705f", // Liberty Burger
//   "4c34b2673896e21eeaf7eb90"  // Panda Express
// ];

//*************************************************************************
// Array of search parameters to give to the FoursquareApi.search function.
// These parameters will return the correct ONREM restaurant.
//*************************************************************************
const venueSearchParams = [
  {
    near: "Dallas, TX",
    query: "Salsa Limon",
    ll: "32.783226,-96.800649",
    limit: 1
  },
  {
    near:"Dallas, TX",
    query:"Velvet Taco",
    ll:"32.821693,-96.785382",
    limit: 1
  },
  {
    near:"Addison, TX",
    query:"The Great Outdoors Sub Shop",
    ll:"32.953524,-96.817814",
    limit: 1
  },
  {
    near: "Dallas, TX",
    query: "Nick and Sams",
    ll: "32.798507,-96.807424",
    limit: 1
  },
  {
    near:"Addison, TX",
    query:"Wayback Burgers",
    ll:"32.933425,-96.838648",
    limit: 1
  },
  {
    near:"Dallas, TX",
    query:"Super Chix",
    ll:"32.9533,-96.804611",
    limit: 1
  },
  {
    near:"Addison, TX",
    query:"Little Greek Fresh Grill",
    ll:"32.953574,-96.817927",
    limit: 1
  },
  {
    near:"Addison, TX",
    query:"Cbowls Poke",
    ll:"32.934616,-96.839714",
    limit: 2
  },
  {
    near:"Dallas, TX",
    query:"Liberty Burger",
    ll:"32.910499,-96.817599",
    limit: 1
  },
  {
    near:"Addison, TX",
    query:"Panda Express",
    ll:"32.956142,-96.818035",
    limit: 1
  }
]

class App extends Component {
  constructor(){
    super();
    this.state = {
      venues:[],
      markers:[],
      zoom: 11,
      apiError: false,
      // updateSuperState takes in an ojbect and sets the state of that ojvect
      updateSuperState: obj => {
        this.setState(obj);
      }
    };
  }

  // function to close all open infoWindows, so only one is open at a time
  closeInfoWindows = () =>{
    const markers = this.state.markers.map(marker => {
      marker.isOpen = false;
      return marker;
    });
    this.setState({markers: Object.assign(this.state.markers, markers) });
  }

  //function to show infoWindow on MarkerClick
  markerClicked = marker => {
    this.clearMarkers();
    this.closeInfoWindows();
    marker.isOpen = true;
    this.setState({markers: Object.assign(this.state.markers, marker) });
  }

  // function to animate the markers when a restaurant is clicked in the sidebar
  animateMarker = marker => {
    this.clearMarkers();
    marker.animate = true;
    this.setState({markers: Object.assign(this.state.markers, marker) });
  }

  // function to set all animations to false, so only one is animated at a time
  clearMarkers = () =>{
    const markers = this.state.markers.map(marker => {
      marker.animate = false;
      return marker;
    });
    this.setState({markers: Object.assign(this.state.markers, markers)});
  }

  // function to animate marker/open the infoWindow when a restaurant is clicked in sidebar
  restaurantClicked = venue => {
    const restaurantMarker = this.state.markers.find(marker=>marker.id === venue.id);
    this.markerClicked(restaurantMarker);
    this.animateMarker(restaurantMarker);
  }

  // Function to handle when the More Information button is clicked
  infoClicked = () => {
    alert("Welcome to my ONREM project where I embark on a journey to visit " +
    "One New Restaurant Every Month!\nAddison, TX has more restaurants per capita than any city in the U.S.,\n" +
    "so I wanted to see what it (and the rest of Dallas) has to offer.\nThrough this goal, my fiance and I have found "+
    "some good eats that we've returned to again and again!\n\nIf you are ever in North Dallas "+
    "I hope you'll give some of these restaurants a try!");
  }

  // Check that the FoursquareAPI mounted correctly
  componentDidMount() {
    //*******************************************************************
    // Restaurant search via FoursquareAPI.search()
    // This searches for venues based on the query and location and adds
    // the markers and infoWindows to the map. Keeping this logic for
    // future use. This logic does not loop through a predetermined array
    // like then next function. This is good for searching for
    // a particular venue.
    //*******************************************************************
    // FoursquareAPI.search({
    //   near:"75244",
    //   query:"Cbowls Poke",
    //   ll:"32.934616,-96.839714",
    //   limit: 2
    // }).then(retval => {
    //   if(retval.error){
    //     console.log("Oops. Something went wrong.");
    //   }
    //   else {
    //     const { venues } = retval.response;
    //     const { center } = retval.response.geocode.feature.geometry;
    //     const markers = venues.map(venue => {
    //       return {
    //         lat: venue.location.lat,
    //         lng: venue.location.lng,
    //         isOpen: false, //infoWindow
    //         isVisible: true,
    //         id: venue.id,
    //         name: venue.name,
    //         animate: false
    //         // icon: defaultIcon
    //       };
    //     });
    //     this.setState({ venues, center, markers });
    //   }
    // });

    //***************************************************************
    // Restaurant search via via FoursquareAPI.search()
    // This searches for venues based on the venueSearchParams array
    // and adds the markers and infoWindows to the map.
    //**************************************************************
    for (var i = 0; i < venueSearchParams.length; i++) {
      FoursquareAPI.search(venueSearchParams[i])
      .then(retval => {
        var newVenues = this.state.venues;
        var newMarkers = this.state.markers;
        // if the first item in the venues array does not contain address
        // information, check the next one.
        var idx = 0;
        while(retval.response.venues[idx].location.address === undefined &&
               idx < (retval.response.venues.length-1)){
          idx++;
        }
        newVenues.push(retval.response.venues[idx]);
        newMarkers.push({
          lat: retval.response.venues[idx].location.lat,
          lng: retval.response.venues[idx].location.lng,
          isOpen: false, //infoWindow
          isVisible: true,
          id: retval.response.venues[idx].id,
          animate: false
        });
        this.setState({venues:newVenues, markers: newMarkers});
      })
      // The user will see an error in the sidebar. See RestaurantList.js
      .catch(error => {
        this.setState({apiError: true});
      })
    } // end of for loop

    //**********************************************************
    // Restaurant search via venue IDs
    // This loops over the current list of restaurants and adds
    // the markers and infoWindows to the map. Keeping this logic
    // for future use; getVenueDetails is a premimum call.
    //**********************************************************
    // for (var i = 0; i < venueIds.length; i++) {
    //   FoursquareAPI.getVenueDetails(venueIds[i])
    //   .then(retval => {
    //     var newVenues = this.state.venues;
    //     var newMarkers = this.state.markers;
    //     newVenues.push(retval.response);
    //     newMarkers.push({
    //       lat: retval.response.venue.location.lat,
    //       lng: retval.response.venue.location.lng,
    //       isOpen: false, //infoWindow
    //       isVisible: true,
    //       id: retval.response.venue.id
    //     })
    //      this.setState({venues:newVenues, markers: newMarkers})
    //   });
    // } // end of for loop
  }

  render() {
    return (
      <div role = "main" className="App">
        <Sidebar
          {...this.state}
          restaurantClicked = {this.restaurantClicked}
          infoClicked = {this.infoClicked}/>
        <MyMap {...this.state}
        markerClicked={this.markerClicked}/>
      </div>
    );
  }
}

export default App;
