LocationsService.prototype.constructor = LocationsService;

function LocationsService() {

	var _arr = [];

	// **********
	// methods...
	// **********

	this.process = function(csv) {
		var that = this;
		$.ajax({
		  type: 'GET',
		  url: csv,
		  cache: false,
		  success: function(text){ 
			parseCSV(text);	
			$(that).trigger("complete");
		  }
		});	
		
	}

	this.getLocations = function() {
		
		return _arr;
	}
	
	// *****************
	// private functions
	// *****************

	parseCSV = function(text) {
		
		var name,description,rank,city,state,leasable_area,opened,renovated,levels,food_court,website,number_stores,parking_places;
		var pt,pms,attr,graphic;
		
		var lines = CSVToArray(text)
		var fields = lines[0];
		
		var values;
		
		for (var i = 1; i < lines.length; i++) {
			
			values = lines[i];
			if (values.length == 1) {
				break;
			}
	
			name = values[fields.indexOf("Name")];
			description = values[fields.indexOf("Description")];
			rank = values[fields.indexOf("Rank")];
			city = values[fields.indexOf("City")];
			state = values[fields.indexOf("State")];
			leasable_area = values[fields.indexOf("Gross_Leasable_Area")];
			opened = values[fields.indexOf("Date_Opened")];
			renovated = values[fields.indexOf("Last_Renovation_Completed")];
			levels = values[fields.indexOf("Levels")];
			food_court = values[fields.indexOf("Food_Court")];
			website = values[fields.indexOf("Link")];
			number_stores = values[fields.indexOf("Total_Stores")];
			parking_places = values[fields.indexOf("Number_of_Parking_Spaces")];
									
			pt = esri.geometry.geographicToWebMercator(
				new esri.geometry.Point(
					[values[fields.indexOf("Long")],values[fields.indexOf("Lat")]],
					new esri.SpatialReference({ wkid:4326}))
			);	
			
			pms = new esri.symbol.PictureMarkerSymbol("images/PurplePinLighter.png",21,24);	
			pms.setOffset(0,7);		
			attr = {
				name:name,
				description:description,
				rank:rank,
				city:city,
				state:state,
				leasable_area:leasable_area,
				opened:opened,
				renovated:renovated,
				levels:levels,
				food_court:food_court,
				website:website,
				number_stores:number_stores,
				parking_places:parking_places
				};
			graphic = new esri.Graphic(pt,pms,attr);		
	
			_arr.push(graphic);
	
		}
		
		_arr.sort(compare);
		
	}
	
	function compare(a,b) {
		rank_a = parseInt(a.attributes.leasable_area);
		rank_b = parseInt(b.attributes.leasable_area);
		if (rank_a > rank_b) return -1;
		else if (rank_a == rank_b) return 0;
		else return 1;
	}
	
	
	// This will parse a delimited string into an array of
	// arrays. The default delimiter is the comma, but this
	// can be overriden in the second argument.
	// courtesy of Ben Nadel www.bennadel.com

	function CSVToArray( strData, strDelimiter ){
		// Check to see if the delimiter is defined. If not,
		// then default to comma.
		strDelimiter = (strDelimiter || ",");
		 
		// Create a regular expression to parse the CSV values.
		var objPattern = new RegExp(
		(
		// Delimiters.
		"(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
		 
		// Quoted fields.
		"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
		 
		// Standard fields.
		"([^\"\\" + strDelimiter + "\\r\\n]*))"
		),
		"gi"
		);
		 
		 
		// Create an array to hold our data. Give the array
		// a default empty first row.
		var arrData = [[]];
		 
		// Create an array to hold our individual pattern
		// matching groups.
		var arrMatches = null;
		 
		 
		// Keep looping over the regular expression matches
		// until we can no longer find a match.
		while (arrMatches = objPattern.exec( strData )){
		 
		// Get the delimiter that was found.
		var strMatchedDelimiter = arrMatches[ 1 ];
		 
		// Check to see if the given delimiter has a length
		// (is not the start of string) and if it matches
		// field delimiter. If id does not, then we know
		// that this delimiter is a row delimiter.
		if (
		strMatchedDelimiter.length &&
		(strMatchedDelimiter != strDelimiter)
		){
		 
		// Since we have reached a new row of data,
		// add an empty row to our data array.
		arrData.push( [] );
		 
		}
		 
		 
		// Now that we have our delimiter out of the way,
		// let's check to see which kind of value we
		// captured (quoted or unquoted).
		if (arrMatches[ 2 ]){
		 
		// We found a quoted value. When we capture
		// this value, unescape any double quotes.
		var strMatchedValue = arrMatches[ 2 ].replace(
		new RegExp( "\"\"", "g" ),
		"\""
		);
		 
		} else {
		 
		// We found a non-quoted value.
		var strMatchedValue = arrMatches[ 3 ];
		 
		}
		 
		 
		// Now that we have our value string, let's add
		// it to the data array.
		arrData[ arrData.length - 1 ].push( strMatchedValue );
		}
		 
		// Return the parsed data.
		return( arrData );
	}
 	
}

