/**
 * Created by ISMAIL on 9/5/2016.
 */

module.exports = function (data, term) {
	var parsed  = [];
	var imagees = 'images/';
	var coffee  = ['coffee'],
	    food    = ['food', 'eatery', 'restorant', 'dinner','eat'],
	    alcohol = ['beer','drink','drinking'],
	    shop    = ['shopping', 'mall', 'shop', 'fashion'];

	for (var ite of data) {
		var entry = {};
		if (ite.name) {
			entry.name = ite.name;
		} else {
			//we dont need a business without a name
			continue;
		}

		if (ite.location.address) {
			entry.address = ite.location.address;
		} else {
			entry.address = 'NA';
		}

		if (ite.categories instanceof Array && ite.categories.length > 0) {
			entry.categories = [];
			ite.categories.forEach(function (e) {
				if (e.name) {
					entry.categories.push(e.name);
				}
			});
		} else {
			entry.categories = 'NA';
		}

		if (ite.location instanceof Object &&
			ite.location.lat !== undefined &&
			ite.location.lng !== undefined) {
			entry.cords = {lat: ite.location.lat, lon: ite.location.lng};
		} else {
			//we dont need a business without coordinates
			continue;
		}

		if (ite.location.city) {
			entry.city = ite.location.city;
		} else {
			entry.city = 'NA';
		}

		if (ite.rating) {
			entry.rating = ite.rating;
		} else {
			entry.rating = 'NA';
		}

		if (ite.contact.phone) {
			entry.phone = ite.contact.phone;
		} else {
			entry.phone = 'NA';
		}

		if (coffee.indexOf(term) !== -1) {
			entry.photo = imagees + 'coffee.png';
		} else if (alcohol.indexOf(term) !== -1) {
			entry.photo = imagees + 'beer.png';
		} else if (food.indexOf(term) !== -1) {
			entry.photo = imagees + 'food.png';
		} else if (shop.indexOf(term) !== -1) {
			entry.photo = imagees + 'shop.png';
		} else {
			entry.photo = 'http://www.megaicons.net/static/img/icons_sizes/8/60/256/science-business-icon.png';
		}


		if (ite.url) {
			entry.url = ite.url;
		} else {
			entry.url = 'NA';
		}

		if (ite.description) {
			entry.description = ite.description;
		} else {
			entry.description = 'NA';
		}

		parsed.push(entry);
	}
	return parsed;
};