class Marker {

  constructor (poiData) {
    this.poiData = poiData;
    this.isSelected = false;

    var markerLocation = new AR.GeoLocation(poiData.latitude, poiData.longitude, poiData.altitude);

    this.markerDrawableIdle = new AR.ImageDrawable(World.markerDrawableIdle, 2.5, {
        zOrder: 0,
        /*
            To react on user interaction, an onClick property can be set for each AR.Drawable. The property is a function which will be called each time the user taps on the drawable. The function called on each tap is returned from the following helper function defined in marker.js. The function returns a function which checks the selected state with the help of the variable isSelected and executes the appropriate function. The clicked marker is passed as an argument.
        */
        onClick: Marker.prototype.getOnClickTrigger(this)
    });

    this.markerDrawableSelected = new AR.ImageDrawable(World.markerDrawableSelected, 2.5, {
        zOrder: 0,
        enabled: false,
        onClick: Marker.prototype.getOnClickTrigger(this)
    });

    this.titleLabel = new AR.Label(poiData.title, 1, {
        zOrder: 1,
        translate: {
            y: 0.55
        },
        style: {
            textColor: '#FFFFFF',
            fontStyle: AR.CONST.FONT_STYLE.BOLD
        }
    });

    this.descriptionLabel = new AR.Label(poiData.shortDescription, 1, {
        zOrder: 1,
        translate: {
            y: -0.55
        },
        style: {
            textColor: '#FFFFFF'
        }
    });

    this.directionIndicatorDrawable = new AR.ImageDrawable(World.markerDrawableDirectionIndicator, 0.1, {
        verticalAnchor: AR.CONST.VERTICAL_ANCHOR.TOP
    });

    /*
        Create the AR.GeoObject with the drawable objects and define the AR.ImageDrawable as an indicator target on the marker AR.GeoObject. The direction indicator is displayed automatically when necessary. AR.Drawable subclasses (e.g. AR.Circle) can be used as direction indicators.
    */
    this.markerObject = new AR.GeoObject(markerLocation, {
        drawables: {
            cam: [this.markerDrawableIdle, this.markerDrawableSelected, this.titleLabel, this.descriptionLabel],
            indicator: this.directionIndicatorDrawable
        }
    });
  }


  getOnClickTrigger (marker) {
      return function() {

          if (marker.isSelected) {
              marker.setDeselected(marker);
          } else {
              marker.setSelected(marker);
              try {
                  World.onMarkerSelected(marker);
              } catch (err) {
                  alert(err);
              }
          }
          return true;
      };
  };

  setSelected (marker) {
      marker.isSelected = true;
      marker.descriptionLabel.text = marker.poiData.longDescription;

      marker.markerDrawableIdle.enabled = false;
      marker.markerDrawableSelected.enabled = true;
  };

  setDeselected (marker) {
      marker.isSelected = false;
      marker.descriptionLabel.text = marker.poiData.shortDescription;

      marker.markerDrawableIdle.enabled = true;
      marker.markerDrawableSelected.enabled = false;
  };

}
