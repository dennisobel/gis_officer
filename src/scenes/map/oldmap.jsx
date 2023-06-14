import React, { useEffect, useState, useRef, forwardRef } from 'react';
import Map, { Marker, Popup, NavigationControl, Source, Layer } from 'react-map-gl';
import { interpolateOranges, interpolateGreens, interpolateReds, interpolateYlOrRd } from 'd3-scale-chromatic';
import { useSelector } from 'react-redux';
import Navbar from "scenes/navbar";
import { Box, useMediaQuery } from "@mui/material";
import { getUsername } from "helper/helper";
import Dot from './Dot';
import PopupDetails from './PopupDetails';
import { getAllBuildingStores } from 'helper/helper';

const OldMap = () => {
  const buildings = useSelector(state => state.buildings) || JSON.parse(localStorage.getItem("buildings"))
  const [userLocation, setUserLocation] = useState(null);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const [user, setUser] = useState()
  const MapMarker = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ffffff"%3E%3Cpath d="M12 2C8.13 2 5 5.13 5 9c0 6 7 13 7 13s7-7 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /%3E%3C/svg%3E'
  const [selectedMarker, setSelectedMarker] = useState();
  const [directions, setDirections] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [viewport, setViewport] = useState();
  const [selectedMarkerRef, setSelectedMarkerRef] = useState(null)
  const [filteredbuildings, setFilteredBuildings] = useState()
  const MAPBOX_TOKEN = 'pk.eyJ1Ijoid2VzbGV5MjU0IiwiYSI6ImNsMzY2dnA0MDAzem0zZG8wZTFzc3B3eG8ifQ.EVg7Sg3_wpa_QO6EJjj9-g'
  const mapRef = useRef();
  const markerRef = useRef();
  const markerRefs = useRef([]);
  const [bounds, setBounds] = useState()
  const [threshold, setThreshold] = useState()
  const [heatmapData, setHeatmapdata] = useState()
  const mapType = "Markers"

  const mapKey = JSON.stringify(viewport);
  const dots = [
    { color: "green", label: "Paid", value: "Paid" },
    { color: "yellow", label: "Partially paid", value: "Partially paid" },
    { color: "red", label: "Not paid", value: "Not paid" },
  ];

  const getHeatmapColor = (value) => {
    const scale = interpolateOranges;
    return scale(value);
  };

  const paidColor = (value) => {
    const scale = interpolateGreens;
    return scale(value);
  };

  const notPaidColor = (value) => {
    const scale = interpolateReds;
    return scale(value);
  };

  const partiallyPaidColor = (value) => {
    const scale = interpolateYlOrRd;
    return scale(value);
  };

  const getUserLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
      },
      (error) => console.error(error),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  const handleSelected = async (marker, index) => {
    getAllBuildingStores({ _id: marker._id }).then(({ data }) => {
      setSelectedMarker(data)
      setSelectedMarkerRef(markerRefs.current[index]);
      const markerRef = markerRefs.current.find((item) => item.marker === marker)?.ref;
    })
  };

  const handleClosePopup = () => {
    setSelectedMarker(null);
  };

  function calculateMapCenter(objects) {
    let totalLatitude = 0;
    let totalLongitude = 0;

    for (const obj of objects) {
      const latitude = parseFloat(obj.latitude);
      const longitude = parseFloat(obj.longitude);
      totalLatitude += latitude;
      totalLongitude += longitude;
    }
    const centerLatitude = totalLatitude / objects.length;
    const centerLongitude = totalLongitude / objects.length;

    return { latitude: centerLatitude, longitude: centerLongitude };
  }

  function clusterCoordinates(coordinates, threshold) {
    const clusters = [];

    // Iterate over each coordinate
    for (let i = 0; i < coordinates.length; i++) {
      const coordinate = coordinates[i];

      // Check if the coordinate belongs to any existing cluster
      let foundCluster = false;
      for (let j = 0; j < clusters.length; j++) {
        const cluster = clusters[j];

        // Calculate the distance between the current coordinate and the cluster's center
        const distance = Math.sqrt(
          Math.pow(coordinate.latitude - cluster.center.latitude, 2) +
          Math.pow(coordinate.longitude - cluster.center.longitude, 2)
        );

        // If the distance is below the threshold, add the coordinate to the cluster
        if (distance < threshold) {
          cluster.coordinates.push(coordinate);
          foundCluster = true;
          break;
        }
      }

      // If the coordinate doesn't belong to any cluster, create a new cluster with the coordinate as the center
      if (!foundCluster) {
        clusters.push({
          center: coordinate,
          coordinates: [coordinate]
        });
      }
    }

    return clusters;
  }


  const paymentStatusColors = {
    "Paid": "green",
    "Partially Paid": "yellow",
    "Not Paid": "red",
    "No Occupants": "blue"
  };

  const heatmapLayer = {
    id: 'heatmap-layer',
    type: 'heatmap',
    source: {
      type: 'geojson',
      // data: buildings && buildings
      // data: Array.isArray(buildings) ? buildings : []
      // data: Array.isArray(filteredbuildings) ? filteredbuildings : []
      data: heatmapData

    },
    paint: {
      'heatmap-opacity': 0.8,
      'heatmap-radius': 15,
      'heatmap-weight': [
        'interpolate',
        ['linear'],
        ['to-number', ['get', 'paymentstatus']],
        0, 0,
        1, 1
      ],
      'heatmap-color': [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0, 'rgba(0, 0, 255, 0)',
        0.2, notPaidColor(0.2),
        0.4, partiallyPaidColor(0.4),
        0.6, paidColor(0.6),
        0.8, getHeatmapColor(0.8)
      ]
    }
  };

  useEffect(() => {
    getUsername()
      .then(user => setUser(user))
  }, [])

  useEffect(() => {
    console.log("BOUNDS:", bounds)
    console.log("BUILDINGS:", buildings)
    let markers = JSON.parse(localStorage.getItem("buildings"))
    if (markers !== null) {
      const filteredMarkers = markers?.filter(marker => {
        const { longitude, latitude } = marker;
        const lng = parseFloat(longitude);
        const lat = parseFloat(latitude);
        return lng >= bounds?._sw.lng && lng <= bounds?._ne.lng && lat >= bounds?._sw.lat && lat <= bounds?._ne.lat;
      });

      const clusteredCoordinates = clusterCoordinates(filteredMarkers, threshold);
      let clustered = []
      for (let i of clusteredCoordinates) {
        let output = {
          ...i.center,
          coordinates: i.coordinates
        }

        clustered.push(output)
      }

      const heatmapData = {
        type: 'FeatureCollection',
        features: clustered.map((building) => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [building.longitude, building.latitude]
          },
          properties: {
            weight: building.paymentstatus
          }
        }))
      };
      setHeatmapdata(heatmapData)
      setFilteredBuildings(clustered)
    }
  }, [buildings, bounds, mapRef, threshold])

  useEffect(() => {
    let temp = JSON.parse(localStorage.getItem("buildings"))
    let lat = calculateMapCenter(temp).latitude
    let lng = calculateMapCenter(temp).longitude
    buildings !== undefined && setViewport({
      latitude: lat,
      longitude: lng,
      zoom: 15
    })
  }, [buildings])

  useEffect(() => {
    getUserLocation();
    setBounds(getBounds())
  }, []);

  useEffect(() => {
    setBounds(getBounds())
  }, [mapRef])

  useEffect(() => {
    switch (true) {
      case zoom >= 1 && zoom <= 10:
        setThreshold(0.1)
        break;
      case zoom >= 11 && zoom <= 13:
        setThreshold(0.01)
        break;
      case zoom >= 14 && zoom <= 16:
        setThreshold(0.001)
        break;
      case zoom === 17:
        setThreshold(0.0001)
        break;
      case zoom >= 18 && zoom <= 22:
        setThreshold(0.00001)
        break;
      default:
        break;
    }
  }, [zoom])

  const getBounds = () => {
    if (!mapRef.current) {
      return null;
    }
    return mapRef.current.getBounds();
  };

  return (
    <Box>
      <Navbar />
      <Map
        ref={mapRef}
        key={mapKey}
        initialViewState={{ ...viewport }}
        // onViewportChange={handleViewportChange}
        onDrag={(event) => {
          setZoom(event.viewState.zoom)
          setBounds(getBounds())
        }}
        style={{ width: '100vw', height: '100vh' }}
        // mapStyle="mapbox://styles/wesley254/clezjwl8d002001md18wexpan"
        mapStyle="mapbox://styles/mapbox/streets-v12?optimize=true"
        mapboxAccessToken={MAPBOX_TOKEN}
        onZoom={(event) => {
          setZoom(event.viewState.zoom)
          setBounds(getBounds())
        }}
      >
        {userLocation && (
          <Marker latitude={userLocation?.latitude} longitude={userLocation?.longitude}>
            <div>📍</div>
          </Marker>
        )}

        {Array.isArray(filteredbuildings) && mapType === "Markers" ? (filteredbuildings?.map((marker, index) =>
        (
          <Marker key={index} latitude={marker.latitude} longitude={marker.longitude} anchor="bottom">
            <img
              onClick={() => handleSelected(marker)}
              style={{
                height: "15px",
                width: "14px",
                cursor: "pointer",
                backgroundColor: paymentStatusColors[marker.payment_status],
                borderRadius: "50px"
              }}
              src={MapMarker} alt="mapmarker" />
          </Marker>
        ))) : Array.isArray(filteredbuildings) && mapType === "Clusters" ? (<Source type="geojson" data={{ type: 'FeatureCollection', features: filteredbuildings && filteredbuildings }}>
          <Layer style={{ cursor: 'pointer' }}  {...heatmapLayer} onClick={(e) => {
            const marker = e.features[0];
            handleSelected(marker)
          }} interactive={true} />
        </Source>) : (<></>)
        }

        {selectedMarker && (
          <Popup
            latitude={selectedMarker.latitude}
            longitude={selectedMarker.longitude}
            anchor="top-left"
            onClose={handleClosePopup}
            closeButton={true}
            closeOnClick={false}
            style={{ maxWidth: "325px", maxHeight: "500px", overflow: "auto", backgroundColor: "rgba(0, 188, 212, 0.2)" }}
          >
            <PopupDetails selectedMarker={selectedMarker} />
          </Popup>
        )}

        {directions && (
          <>
            <Source id="line-source" type="geojson" data={directions} >
              <Layer
                id='directions-layer'
                type='line'
                source='line-source'
                // layout={{ 'line-join': 'round', 'line-cap': 'round' }}
                paint={{ 'line-color': '#00ff00', 'line-width': 5, 'line-opacity': 0.5 }}
                interactive={true}
              />
            </Source>
          </>

        )}

        <NavigationControl showCompass showZoom position='bottom-left' />
        {dots.map((dot, index) => (
          <Dot
            key={index}
            index={index}
            color={dot.color}
            label={dot.label}
          />
        ))}
      </Map>
    </Box>
  )
}

export default OldMap