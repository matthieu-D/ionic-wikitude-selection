var World = {
	// true once data was fetched
	initiallyLoadedData: false,

	// different POI-Marker assets
	markerDrawableIdle: null,
	markerDrawableSelected: null,
	markerDrawableDirectionIndicator: null,

	// list of AR.GeoObjects that are currently shown in the scene / World
	markerList: [],

	// The last selected marker
	currentMarker: null,

	// called to inject new POI data
	loadPoisFromJsData: function loadPoisFromJsDataFn(poiData) {
		// empty list of visible markers
		World.markerList = [];

		// Start loading marker assets:
		// Create an AR.ImageResource for the marker selected-image
		World.markerDrawableSelected = new AR.ImageResource("assets/marker-selected.png");
		// Create an AR.ImageResource referencing the image that should be displayed for a direction indicator.
		World.markerDrawableDirectionIndicator = new AR.ImageResource("assets/indicator.png");

		// loop through POI-information and create an AR.GeoObject (=Marker) per POI
		for (var currentPlaceNr = 0; currentPlaceNr < poiData.length; currentPlaceNr++) {
      World.markerDrawableIdle = new AR.ImageResource('assets/'+ poiData[currentPlaceNr].icon);
			var singlePoi = {
				"id": poiData[currentPlaceNr].id,
				"latitude": parseFloat(poiData[currentPlaceNr].latitude),
				"longitude": parseFloat(poiData[currentPlaceNr].longitude),
				"altitude": parseFloat(poiData[currentPlaceNr].altitude),
				"title": poiData[currentPlaceNr].name,
				"shortDescription": poiData[currentPlaceNr].shortDescription,
				"longDescription": poiData[currentPlaceNr].longDescription
			};

			/*
				To be able to deselect a marker while the user taps on the empty screen,
				the World object holds an array that contains each marker.
			*/
			World.markerList.push(new Marker(singlePoi));
		}
	},

	// location updates, fired every time you call architectView.setLocation() in native environment
	locationChanged: function locationChangedFn(lat, lon, alt, acc) {

		/*
			The custom function World.onLocationChanged checks with the flag World.initiallyLoadedData if the function was already called. With the first call of World.onLocationChanged an object that contains geo information will be created which will be later used to create a marker using the World.loadPoisFromJsonData function.
		*/
		if (!World.initiallyLoadedData) {
			/*
				requestDataFromLocal with the geo information as parameters (latitude, longitude) creates different poi data to a random location in the user's vicinity.
			*/
			World.requestDataFromLocal(lat, lon);
			World.initiallyLoadedData = true;
		}
	},

	// fired when user pressed maker in cam
	onMarkerSelected: function onMarkerSelectedFn(marker) {

		// deselect previous marker
		if (World.currentMarker) {
			if (World.currentMarker.poiData.id == marker.poiData.id) {
				return;
			}
			World.currentMarker.setDeselected(World.currentMarker);
		}

		// highlight current one
		marker.setSelected(marker);
		World.currentMarker = marker;
	},

	// screen was clicked but no geo-object was hit
	onScreenClick: function onScreenClickFn() {
		if (World.currentMarker) {
			World.currentMarker.setDeselected(World.currentMarker);
		}
	},

	// request POI data
	requestDataFromLocal: function requestDataFromLocalFn(centerPointLatitude, centerPointLongitude) {
		var poisToCreate = 3;
		var poiData = [];
    for (var i = 0; i < poisToCreate; i++) {
      poiData.push({
        "id": meetingPoints[i].id,
        "longitude": (centerPointLongitude + (Math.random() / 5 - 0.1)),
        "latitude": (centerPointLatitude + (Math.random() / 5 - 0.1)),
        "shortDescription": meetingPoints[i].shortDescription,
        "longDescription": meetingPoints[i].longDescription,
        // use this value to ignore altitude information in general - marker will always be on user-level
        "altitude": AR.CONST.UNKNOWN_ALTITUDE,
        "name": meetingPoints[i].name,
        "icon": meetingPoints[i].icon
      });
    }
    World.loadPoisFromJsData(poiData);
	}
};

/*
	Set a custom function where location changes are forwarded to. There is also a possibility to set AR.context.onLocationChanged to null. In this case the function will not be called anymore and no further location updates will be received.
*/
AR.context.onLocationChanged = World.locationChanged;

/*
	To detect clicks where no drawable was hit set a custom function on AR.context.onScreenClick where the currently selected marker is deselected.
*/
AR.context.onScreenClick = World.onScreenClick;
