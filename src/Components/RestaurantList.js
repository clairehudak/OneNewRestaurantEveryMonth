import React, { Component } from 'react'
import Restaurants from './Restaurants'

//List View of Restaurants
class RestaurantList extends Component {
  render() {

    return (
      <ol className="restaurantList">
        {this.props.venues.length > 0 && this.props.venues &&
          this.props.venues.map((restaurant,id)=>(
            <Restaurants key={id} {...restaurant}
            restaurantClicked = {this.props.restaurantClicked}/>
          ))}
          {/*Error handling. If the venue list is empty, let the user know.*/}
          {this.props.venues.length === 0 &&
            <span> Fetching the restaurant list&#8230; </span>
          }
      </ol>
    )
  }
}

export default RestaurantList
