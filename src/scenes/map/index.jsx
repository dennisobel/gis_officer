
import React, { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { styled } from '@mui/material/styles';
import { Box, useTheme } from '@mui/material';
import { Icon } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { IconButton } from '@chakra-ui/react';
import { ArrowBackOutlined } from "@mui/icons-material";

import L from 'leaflet';
import 'leaflet-routing-machine';
import { getBusinessById, calculateDistance, getBuildingById } from "helper/helper";

const MapContainer = styled(Box)(({ theme }) => ({
    height: '100vh',
    width: '100vw',
}));

const MapView = ({ isRightbarOpen, setIsRightbarOpen }) => {
    const MAPBOX_TOKEN = 'pk.eyJ1Ijoid2VzbGV5MjU0IiwiYSI6ImNsMzY2dnA0MDAzem0zZG8wZTFzc3B3eG8ifQ.EVg7Sg3_wpa_QO6EJjj9-g';
    const location = useSelector(state => state.currentLocation)
    const theme = useTheme();
    const dispatch = useDispatch();
    const mapContainerRef = useRef(null);
    const [mapp, setMap] = useState();
    const [coords, setCoords] = useState()
    const [distance, setDistance] = useState()
    const [minimumdist] = useState(10000)
    const [routingControl, setRoutingControl] = useState()
    const navigate = useNavigate()

    const [store, setStore] = useState()
    const { latitude, longitude, id } = useParams()
    const { NavigationControl } = mapboxgl;

    const getStore = async () => {
        const { data } = await getBusinessById(id)
        setStore(data)
        return data
    }

    useEffect(() => {
        getStore()
            .then((res) => {
                console.log("STORE:", res);
                getBuildingById({ _id: res?.building })
                    .then(({ data }) => {
                        console.log(data);
                        setCoords({
                            latitude: parseFloat(data?.latitude),
                            longitude: parseFloat(data?.longitude),
                        });
                    })
                    .catch((error) => {
                        console.log("Error getting building:", error);
                    });
            })
            .catch((error) => {
                console.log("Error getting store:", error);
            })
            .finally(() => {
                // This code will run after coords is set
                if (coords) {
                    console.log("Coordinates:", coords);
                    const distance = calculateDistance(
                        { lat: location?.latitude, lng: location?.longitude },
                        { lat: coords?.latitude, lng: coords?.longitude }
                    );
                    console.log("Distance:", distance);
                    setDistance(distance);
                }
            });
    }, []);


    useEffect(() => {
        if (coords) {
            console.log("Coordinates:", coords);
            const distance = calculateDistance(
                { lat: location?.latitude, lng: location?.longitude },
                { lat: coords?.latitude, lng: coords?.longitude }
            );
            console.log("Distance:", distance);
            setDistance(distance);
        }
    }, [coords]);

    useEffect(() => {
        const map = L.map(mapContainerRef.current).setView([latitude, longitude], 15);
        // const tileurl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
        const tileurl = "https://studio.mapbox.com/tilesets/dennisobel.0kkicap0"

        L.tileLayer(tileurl, {
            attribution: '',
            maxZoom: 18,
            id: 'mapbox://styles/mapbox/streets-v12',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: MAPBOX_TOKEN,
        }).addTo(map);

        if (coords) {
            const markers = [
                L.marker([latitude, longitude]),
                L.marker([coords.latitude, coords.longitude]),
            ];

            markers.forEach((marker) => {
                marker.addTo(map);
            });

            // Add routing control
            const routingControl = L.Routing.control({
                waypoints: [
                    L.latLng(latitude, longitude),
                    L.latLng(latitude - 0.00054, longitude - 0.0078),
                ],
                routeWhileDragging: true,
            }).addTo(map);
            setRoutingControl(routingControl);
        }


        return () => {
            if (routingControl) {
                routingControl.removeFrom(map);
            }
            map.remove();
        };
    }, [latitude, longitude, coords])

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
    );
};

export default MapView;
