let CONFIG = {
	API_BASE_URL: 'https://www.anapioficeandfire.com/',
	extractNumber: function(strng){
		return strng.match(/\d/g)[0];
	}
}

export default CONFIG;