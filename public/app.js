let seasonFilter = 'All';
let genderFilter = 'All';

const seasonOptions = document.querySelector('.seasons');
const genderOptions = document.querySelector('.genders');
const searchResultsElem = document.querySelector('.searchResults');
const priceRangeElem = document.querySelector('.priceRange');
const showPriceRangeElem = document.querySelector('.showPriceRange');

const garmentsTemplateText = document.querySelector('.garmentListTemplate');
const garmentsTemplate = Handlebars.compile(garmentsTemplateText.innerHTML);

seasonOptions.addEventListener('click', function (evt) {
	seasonFilter = evt.target.value;
	filterData();
});

genderOptions.addEventListener('click', function (evt) {
	genderFilter = evt.target.value;
	filterData();
});

function garments() {
	axios
		.get(`http://localhost:4017/api/garments`, function (result) {
			console.log(result)
			searchResultsElem.innerHTML = garmentsTemplate({
				garments: result.data.garments
			});
		});
}

garments()

function priceGarments() {
	axios
		.get(`http://localhost:4017/api/garments/price/:price`, function (result) {
			console.log(result.data)
			searchResultsElem.innerHTML = garmentsTemplate({
				garments: result.data.garments
			});
		});
}

function filterData() {
	axios
		.get(`/api/garments?gender=${genderFilter}&season=${seasonFilter}`
			// , {
			// headers: {
			//   'Authorization': `token ${access_token}`
			// }
			//  } 
		)
		.then(function (result) {
			searchResultsElem.innerHTML = garmentsTemplate({
				garments: result.data.garments
			})
		});
}

priceRangeElem.addEventListener('change', function (evt) {
	const maxPrice = evt.target.value;
	showPriceRangeElem.innerHTML = maxPrice;
	axios
		.get(`/api/garments/price/${maxPrice}`)
		.then(function (result) {
			searchResultsElem.innerHTML = garmentsTemplate({
				garments: result.data.garments
			})
		});
});

filterData();
