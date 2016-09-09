/**
 * Created by ISMAIL on 9/5/2016.
 */

var _ = require('lodash');

module.exports = function (yelp, foursquare) {
    /*Merge Array on the basis of name so wont be any duplicate entries*/
    return _.unionBy(yelp, foursquare, 'name');
};