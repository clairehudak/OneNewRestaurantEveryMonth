// code and organization dervied from Forest Walker's walkthrough
//https://www.youtube.com/watch?v=Dj5hzKBxCBI&list=PL4rQq4MQP1crXuPtruu_eijgOUUXhcUCP&index=3

class Helper {
  //create the base URL, so we don't have to type it for every call
  static baseUrl(){
    return "https://api.foursquare.com/v2"
  }
  //foursquare API authorization
  static authorization() {
    const clientKeys = {
      client_id:"5P10QPFPU1TTELLGTZFSJQPZAONTZANDRHK5ZQE3L5RHYHXW",
      client_secret:"BRQQVYH4CJVSWA22324ZEGWXWC2OKUFBPUUIGLCF5OLB0DWF",
      v:"20181014"
    };
    //format the clientKeys
    return Object.keys(clientKeys).map(key=>
    `${key}=${clientKeys[key]}`)
    .join("&");
  }
  static buildUrl(urlParams){
    if(!urlParams){
      return ""
    }
    // format the URL Parameters
    return Object.keys(urlParams).map(key=>
    `${key}=${urlParams[key]}`)
    .join("&");
  }
  static headers() {
    return {
      Accept: "application/json"
    };
  }
  static simpleFetch(endPoint,method,urlParams){
    let requestData = {
      method,
      headers: Helper.headers()
    };
    return fetch(
      `${Helper.baseUrl()}${endPoint}?${Helper.authorization()}&${Helper.buildUrl(
        urlParams
      )}`,
      requestData
    ).then(result=>result.json());
  }
} // end of Helper class

export default class FoursquareAPI {
  static search(urlParams) {
    return Helper.simpleFetch("/venues/search", "GET", urlParams);
  }
  static getVenueDetails(VENUE_ID) {
    return Helper.simpleFetch(`/venues/${VENUE_ID}`, "GET");
  }
  static getVenuePhotos(VENUE_ID) {
    return Helper.simpleFetch(`/venues/${VENUE_ID}/photos`, "GET");
  }
}
