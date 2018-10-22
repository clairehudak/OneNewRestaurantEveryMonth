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
          {/*Error handling.*/}
          {this.props.apiError === true &&
            <span> Sorry, something went wrong. </span>
          }
      </ol>
    )
  }
}

export default RestaurantList
