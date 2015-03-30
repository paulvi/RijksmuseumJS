var fs = require('fs');
var http = require('http');
var request = require('request');

//var url = 'https://www.rijksmuseum.nl/api/en/collection/sk-c-5?key=UQVLOfJR&format=json';
var url = 'https://www.rijksmuseum.nl/api/en/collection?key=UQVLOfJR&format=json'
	+"&imgonly=True"
	+"&toppieces=True"
	//+"&q=Milkmaid"	//	SK-A-2344	The Milkmaid	The Milkmaid, Johannes Vermeer, c. 1660
	//+"&q=Milkmaid"	//	SK-A-2344	The Milkmaid	The Milkmaid, Johannes Vermeer, c. 1660
	;

var resoulutions = [ "", //0 - default 2500x2500
                     "&100x100",
                     "&200x200",
                     //"&500x500", other resolutions are not supported
                    ];
var resoulutionIndex = 1;

var artCount = 0;
var counter = 0;

var downloadUrls = [];

var destDir = __dirname+'/jpg/';

var mkdirSync = function(path) {
	try {
		fs.mkdirSync(path);
	} catch (e) {
		if (e.code != 'EEXIST')
			throw e;
	}
}

var downloadImage = function(objectNumber, title ){	
	counter++;
	var download_url = 'http://www.rijksmuseum.nl/media/assets/'
		+objectNumber+resoulutions[resoulutionIndex];
	//console.log(download_url);
	downloadUrls.push(download_url);
	request(download_url).pipe(fs.createWriteStream(destDir+''+title+resoulutions[resoulutionIndex]+'.jpg'));	
}

var getImages = function(url){		
	console.log(url);
	request.get(url, function onResponse(error, response, body) {
		if (!error && response.statusCode == 200) {
			var answer = JSON.parse(body);
			console.log(answer);
			artCount = answer.count;
			var artObjects = answer.artObjects;
			var arrayLength = artObjects.length;
			for (var i = 0; i < arrayLength; i++) {	
				var art = artObjects[i];
				var objectNumber = art.objectNumber;
				console.log(''+art.objectNumber+'	'+art.title+'	'+art.longTitle);
				downloadImage(objectNumber, art.title);
			}
			for (var i = 0; i < downloadUrls.length; i++) {	
				console.log('"'+downloadUrls[i]+'",');
			}
		}
	});
}

var getPage = function (page){
	getImages(url+'&p='+page);
}

mkdirSync(destDir);
//getImages(url);
for (var p = 0; p<10; p++){
	getPage(p);
}

