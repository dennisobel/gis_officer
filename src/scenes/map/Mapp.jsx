
import React, { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { styled } from '@mui/material/styles';
import { Box, useTheme } from '@mui/material';
import { Icon } from '@mui/material';
import { LocationOn } from '@mui/icons-material';
import Dot from './Dot';
import PopupDetails from './PopupDetails';
import { useDispatch, useSelector } from 'react-redux';
import { setMode, setSearchQuery, setMapType, setSelectedMarker, setMarkedDetails, setActivePage } from 'state';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAllBuildingStores } from 'helper/helper';

const MapContainer = styled(Box)(({ theme }) => ({
    height: '100vh',
    width: '100vw',
}));

const MarkerIcon = styled(Icon)(({ theme }) => ({
    color: '008080',
}));

const MapView = ({ isRightbarOpen, setIsRightbarOpen }) => {
    const buildings = useSelector((state) => state.global.countybuildings);
    const mapType = useSelector(state => state.global.mapType)
    const MAPBOX_TOKEN = 'pk.eyJ1Ijoid2VzbGV5MjU0IiwiYSI6ImNsMzY2dnA0MDAzem0zZG8wZTFzc3B3eG8ifQ.EVg7Sg3_wpa_QO6EJjj9-g';
    const theme = useTheme();
    const dispatch = useDispatch();
    const mapContainerRef = useRef(null);
    const [openpopup, setOpenpopup] = useState(false);
    const [selected, setSelected] = useState();
    const { pathname } = useLocation();
    const [active, setActive] = useState('');
    const [mapp, setMap] = useState();
    const { NavigationControl } = mapboxgl;

    useEffect(() => {
        setActive(pathname.substring(1));
        dispatch(setActivePage(active));
    }, [pathname]);

    const paymentStatusColors = {
        Paid: 'green',
        'Partially Paid': 'yellow',
        'Not Paid': 'red',
        'No Occupants': 'blue',
    };

    const dots = [
        { color: 'green', label: 'Paid', value: 'Paid' },
        { color: 'yellow', label: 'Partially paid', value: 'Partially paid' },
        { color: 'red', label: 'Not paid', value: 'Not paid' },
    ];

    function calculateMapCenter(objects) {
        let totalLatitude = 0;
        let totalLongitude = 0;

        if (objects !== undefined) {
            for (const obj of objects) {
                const latitude = parseFloat(obj.latitude);
                const longitude = parseFloat(obj.longitude);
                totalLatitude += latitude;
                totalLongitude += longitude;
            }
        }
        const centerLatitude = totalLatitude / objects.length;
        const centerLongitude = totalLongitude / objects.length;
        return { latitude: centerLatitude, longitude: centerLongitude };
    }

    function calculateZoomLevel(markerCount) {
        // Calculate the zoom level based on the number of markers.
        // The following code is just an example and may need to be adjusted for your specific needs.
        const zoomLevel = Math.floor(Math.log2(markerCount) + 1);

        return zoomLevel;
    }

    useEffect(() => {
        dispatch(setActivePage("geography"))
    }, []);

    useEffect(() => {
        mapboxgl.accessToken = MAPBOX_TOKEN;
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            //   style: 'mapbox://styles/mapbox/streets-v11',
            style: 'mapbox://styles/mapbox/streets-v12?optimize=true',
            // style: "mapbox://styles/wesley254/clezjwl8d002001md18wexpan?optimize=true",
            center: [calculateMapCenter(buildings)?.longitude, calculateMapCenter(buildings)?.latitude],
            //   zoom: 3,
            preserveDrawingBuffer: true,
        });

        setMap(map);

        // Add zoom control
        const nav = new NavigationControl();
        map.addControl(nav, 'bottom-left');
        const bounds = new mapboxgl.LngLatBounds();
        const markers = [];

        buildings &&
            buildings.forEach((marker) => {
                const el = document.createElement('div');
                el.className = 'marker';
                el.style.backgroundImage = `url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ffffff"%3E%3Cpath d="M12 2C8.13 2 5 5.13 5 9c0 6 7 13 7 13s7-7 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /%3E%3C/svg%3E')`;
                el.style.backgroundSize = 'cover';
                el.style.backgroundColor = 'teal';
                el.style.width = '30px';
                el.style.height = '30px';
                el.style.cursor = 'pointer';

                const link = document.createElement('a');
                link.href = '/dashboard';
                link.textContent = 'My link';

                const label = document.createElement('h6');
                label.textContent = marker.label;

                const content = document.createElement('div');
                content.appendChild(label);
                content.appendChild(link);

                const markerPopup = new mapboxgl.Popup({
                    anchor: 'bottom',
                    offset: [0, -10],
                    className: 'custom-popup',
                    maxHeight: '700px',
                })
                    .setDOMContent(content)
                    .on('open', () => {
                        setSelectedMarker(marker);
                        setOpenpopup(true);
                        dispatch(setSelectedMarker(marker));
                    })
                    .on('close', () => {
                        setSelectedMarker(marker);
                        setOpenpopup(false);
                        setSelected(marker);
                    });

                if (mapType === "Markers") {

                } else if (mapType === "Clusters") {

                }

                const markerInstance = new mapboxgl.Marker({ color: paymentStatusColors[marker.payment_status] })
                    .setLngLat([marker.longitude, marker.latitude])
                    .setPopup(markerPopup);

                markers.push({ markerInstance, longitude: marker.longitude, latitude: marker.latitude });

                bounds.extend([marker.longitude, marker.latitude]);
            });

        const filterMarkers = () => {
            const currentBounds = map.getBounds();
            console.log("current bounds:", currentBounds)
            markers.forEach(({ markerInstance, longitude, latitude }) => {
                if (currentBounds.contains([longitude, latitude])) {
                    markerInstance.addTo(map);
                } else {
                    markerInstance.remove();
                }
            });
        };



        // Add an event listener to the map's `markersadded` event.
        map.on('markersadded', function () {
            // Calculate the zoom level based on the number of markers.
            const zoomLevel = calculateZoomLevel(map.getMarkers().length);

            // Set the map's zoom level.
            map.setZoom(zoomLevel);
        });


        map.on('load', () => {
            map.fitBounds(bounds, { padding: 5 });
        });

        map.on('moveend', filterMarkers);

        const maxBounds = new mapboxgl.LngLatBounds();
        maxBounds.extend([bounds.getWest(), bounds.getSouth()]);
        maxBounds.extend([bounds.getEast(), bounds.getNorth()]);

        return () => {
            map.off('moveend', filterMarkers);
            map.remove();
        };
    }, [buildings]);

    useEffect(() => {
        if (openpopup) {
            setIsRightbarOpen(true);
            getAllBuildingStores({ _id: selected._id }).then(({ data }) => {
                dispatch(setSelectedMarker(data));
            });
        }
        dispatch(setMarkedDetails());
    }, [openpopup]);

    return (
        <>
            <MapContainer ref={mapContainerRef}>
                <div className="map-controls">
                    <MarkerIcon theme={theme}>
                        <LocationOn />
                    </MarkerIcon>
                </div>
            </MapContainer>
            {dots.map((dot, index) => (
                <Dot key={index} index={index} color={dot.color} label={dot.label} />
            ))}
        </>
    );
};

export default MapView;
