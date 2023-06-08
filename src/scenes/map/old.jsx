import React, { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { styled } from '@mui/material/styles';
import { ArrowBackOutlined } from "@mui/icons-material";
import { Box } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { getBusinessById, calculateDistance, getBuildingById } from "helper/helper";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { IconButton } from '@chakra-ui/react';

const MapContainer = styled(Box)(({ theme }) => ({
    height: '100vh',
    width: '100vw',
}));

const MapView = () => {
    const MAPBOX_TOKEN = 'pk.eyJ1Ijoid2VzbGV5MjU0IiwiYSI6ImNsMzY2dnA0MDAzem0zZG8wZTFzc3B3eG8ifQ.EVg7Sg3_wpa_QO6EJjj9-g';
    const { latitude, longitude, id } = useParams();
    const mapContainerRef = useRef(null);
    const [map, setMap] = useState(null);
    const [coords, setCoords] = useState(null);
    const { NavigationControl } = mapboxgl;
    const navigate = useNavigate()


    function decodePolyline(polyline) {
        const polylinePoints = [];
        let index = 0;
        let lat = 0;
        let lng = 0;

        while (index < polyline.length) {
            let shift = 0;
            let result = 0;

            let byte;
            do {
                byte = polyline.charCodeAt(index++) - 63;
                result |= (byte & 0x1f) << shift;
                shift += 5;
            } while (byte >= 0x20);

            const deltaLat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
            lat += deltaLat;

            shift = 0;
            result = 0;

            do {
                byte = polyline.charCodeAt(index++) - 63;
                result |= (byte & 0x1f) << shift;
                shift += 5;
            } while (byte >= 0x20);

            const deltaLng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
            lng += deltaLng;

            polylinePoints.push([lng * 1e-5, lat * 1e-5]);
        }

        return polylinePoints;
    }

    const getStore = async () => {
        try {
            const { data } = await getBusinessById(id);
            return data;
        } catch (error) {
            console.log("Error getting store:", error);
            return null;
        }
    };

    useEffect(() => {
        const initializeMap = async () => {
            const store = await getStore();
            if (store) {
                const { data } = await getBuildingById({ _id: store.building });
                if (data) {
                    setCoords({
                        latitude: parseFloat(data.latitude),
                        longitude: parseFloat(data.longitude),
                    });
                }
            }
        };

        initializeMap();
    }, []);

    useEffect(() => {
        if (!map) {
            const nav = new NavigationControl();

            const newMap = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [longitude, latitude],
                zoom: 8,
                accessToken: MAPBOX_TOKEN,
            }).addControl(nav, "top-left");
            setMap(newMap);
        }

        return () => {
            if (map) {
                map.remove();
            }
        };
    }, [map, latitude, longitude]);

    useEffect(() => {
        if (map && coords) {
            const { latitude: destLat, longitude: destLng } = coords;

            // Add markers
            const originMarker = new mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(map);
            const destinationMarker = new mapboxgl.Marker().setLngLat([destLng, destLat]).addTo(map);

            // Calculate distance
            const distance = calculateDistance(
                { lat: latitude, lng: longitude },
                { lat: destLat, lng: destLng }
            );
            console.log("Distance:", distance);

            // Fit the markers within the map's view
            const bounds = new mapboxgl.LngLatBounds();
            bounds.extend([longitude, latitude]);
            bounds.extend([destLng, destLat]);
            map.fitBounds(bounds, { padding: 50 });


            // Fetch directions from Mapbox Directions API
            const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${longitude},${latitude};${destLng},${destLat}?access_token=${MAPBOX_TOKEN}`;
            fetch(directionsUrl)
                .then((response) => response.json())
                .then((data) => {
                    console.log(" DATA:", data)
                    const geometry = data.routes[0].geometry;
                    const route = data.routes[0];
                    const steps = route.legs[0].steps;

                    steps.forEach((step, index) => {
                        const { maneuver, instruction } = step;
                        const turnMarker = new mapboxgl.Marker()
                            .setLngLat(step.maneuver.location)
                            .addTo(map);

                        const popupContent = `
                          <div>
                            <strong>${maneuver.type}</strong><br/>
                            ${instruction}
                          </div>
                        `;

                        const popup = new mapboxgl.Popup({ closeButton: false, offset: 25 })
                            .setHTML(popupContent)
                            .addTo(map);

                        turnMarker.setPopup(popup);

                        // Open the popup by default for the first turn
                        if (index === 0) {
                            popup.addTo(map);
                        }
                    });
                    const geojson = {
                        type: "Feature",
                        geometry: {
                            type: "LineString",
                            coordinates: decodePolyline(geometry)
                        }
                    };

                    // Draw route line
                    map.addSource('route', {
                        type: 'geojson',
                        data: geojson
                    });
                    map.addLayer({
                        id: 'route',
                        type: 'line',
                        source: 'route',
                        paint: {
                            'line-color': 'teal',
                            'line-width': 3,
                        },
                    });
                })
                .catch((error) => {
                    console.log("Error fetching directions:", error);
                });
        }
    }, [map, latitude, longitude, coords]);

    return (
        <>
            <WidgetWrapper>
                <FlexBetween gap="1.5rem">
                    <IconButton onClick={() => navigate(`/store/${id}`)}>
                        <ArrowBackOutlined />
                    </IconButton>
                </FlexBetween>
            </WidgetWrapper>
            <MapContainer ref={mapContainerRef} />
        </>
    )
};

export default MapView;
