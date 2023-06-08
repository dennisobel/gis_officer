// import {
//     Box,
//     Button,
//     ButtonGroup,
//     Flex,
//     HStack,
//     IconButton,
//     Input,
//     SkeletonText,
//     Text,
//   } from '@chakra-ui/react'
//   import { FaLocationArrow, FaTimes } from 'react-icons/fa'
  
//   import {
//     useJsApiLoader,
//     GoogleMap,
//     Marker,
//     Autocomplete,
//     DirectionsRenderer,
//   } from '@react-google-maps/api'
//   import { useRef, useState, useEffect } from 'react'
  
//   const center = { lat: -1.336180, lng: 36.894335 }
  
  

  
//   function Map() {
//     const { isLoaded } = useJsApiLoader({
//       googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
//       libraries: ['places'],
//     })
  
//     const [map, setMap] = useState(/** @type google.maps.Map */ (null))
//     const [directionsResponse, setDirectionsResponse] = useState(null)
//     const [distance, setDistance] = useState('')
//     const [duration, setDuration] = useState('')
//     const [userLocation, setUserLocation] = useState(null);

//     useEffect(() => {
//         getUserLocation();
//     }, []);

//     const getUserLocation = () => {
//         navigator.geolocation.getCurrentPosition(
//             (position) => {
//                 const { latitude, longitude } = position.coords;
//                 setUserLocation({ latitude:parseFloat(latitude), longitude:parseFloat(longitude) });
//             },
//             (error) => console.log(error),
//             { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
//         );
//     };

//     useEffect(()=>{
//       if (userLocation !== null) {
//         console.log("user location:", userLocation);
//         // const centerr = { lat: userLocation !== null && userLocation.latitude, lng: 36.894335 +}
//       }
//     },[userLocation])
  
//     /** @type React.MutableRefObject<HTMLInputElement> */
//     const originRef = useRef()
//     /** @type React.MutableRefObject<HTMLInputElement> */
//     const destiantionRef = useRef()
  
//     if (!isLoaded) {
//         return <SkeletonText />
//     }
  
//     async function calculateRoute() {
//       if (originRef.current.value === '' || destiantionRef.current.value === '') {
//         return
//       }
//       // eslint-disable-next-line no-undef
//       const directionsService = new google.maps.DirectionsService()
//       const results = await directionsService.route({
//         origin: originRef.current.value,
//         destination: destiantionRef.current.value,
//         // eslint-disable-next-line no-undef
//         travelMode: google.maps.TravelMode.DRIVING,
//       })
//       setDirectionsResponse(results)
//       setDistance(results.routes[0].legs[0].distance.text)
//       setDuration(results.routes[0].legs[0].duration.text)
//     }
  
//     function clearRoute() {
//       setDirectionsResponse(null)
//       setDistance('')
//       setDuration('')
//       originRef.current.value = ''
//       destiantionRef.current.value = ''
//     }
  
//     return (
//       <Flex
//         position='relative'
//         flexDirection='column'
//         alignItems='center'
//         h='100vh'
//         w='100vw'
//       >
//         <Box position='absolute' left={0} top={0} h='100%' w='100%'>
//           {/* Google Map Box */}
//           <GoogleMap
//             center={center}
//             zoom={15}
//             mapContainerStyle={{ width: '100%', height: '100%' }}
//             options={{
//               zoomControl: false,
//               streetViewControl: false,
//               mapTypeControl: false,
//               fullscreenControl: false,
//             }}
//             onLoad={map => setMap(map)}
//           >
//             <Marker position={center} />
//             {directionsResponse && (
//               <DirectionsRenderer directions={directionsResponse} />
//             )}
//           </GoogleMap>
//         </Box>
//         <Box
//           p={4}
//           borderRadius='lg'
//           m={4}
//           bgColor='white'
//           shadow='base'
//           minW='container.md'
//           zIndex='1'
//         >
//           <HStack spacing={2} justifyContent='space-between'>
//             <Box flexGrow={1}>
//               <Autocomplete>
//                 <Input type='text' placeholder='Origin' ref={originRef} />
//               </Autocomplete>
//             </Box>
//             <Box flexGrow={1}>
//               <Autocomplete>
//                 <Input
//                   type='text'
//                   placeholder='Destination'
//                   ref={destiantionRef}
//                 />
//               </Autocomplete>
//             </Box>
  
//             <ButtonGroup>
//               <Button colorScheme='pink' type='submit' onClick={calculateRoute}>
//                 Calculate Route
//               </Button>
//               <IconButton
//                 aria-label='center back'
//                 icon={<FaTimes />}
//                 onClick={clearRoute}
//               />
//             </ButtonGroup>
//           </HStack>
//           <HStack spacing={4} mt={4} justifyContent='space-between'>
//             <Text>Distance: {distance} </Text>
//             <Text>Duration: {duration} </Text>
//             <IconButton
//               aria-label='center back'
//               icon={<FaLocationArrow />}
//               isRound
//               onClick={() => {
//                 map.panTo(center)
//                 map.setZoom(15)
//               }}
//             />
//           </HStack>
//         </Box>
//       </Flex>
//     )
//   }
  
//   export default Map
  

import React, { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import { getBusinessById, calculateDistance, getBuildingById } from "helper/helper";


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
            const newMap = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [longitude, latitude],
                zoom: 10,
                accessToken: MAPBOX_TOKEN,
            });
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
            const markers = [
                new mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(map),
                new mapboxgl.Marker().setLngLat([destLng, destLat]).addTo(map),
            ];

            // Calculate distance
            const distance = calculateDistance(
                { lat: latitude, lng: longitude },
                { lat: destLat, lng: destLng }
            );
            console.log("Distance:", distance);

            // Fetch directions from Mapbox Directions API
            const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/walking/${longitude},${latitude};${destLng},${destLat}?access_token=${MAPBOX_TOKEN}`;
            fetch(directionsUrl)
                .then((response) => response.json())
                .then((data) => {
                    const route = data.routes[0].geometry;
                    const routeLayer = {
                        id: 'route',
                        type: 'line',
                        source: {
                            type: 'geojson',
                            data: {
                                type: 'Feature',
                                geometry: route,
                            },
                        },
                        paint: {
                            'line-color': 'blue',
                            'line-width': 3,
                        },
                    };
                    map.addLayer(routeLayer);
                })
                .catch((error) => {
                    console.log("Error fetching directions:", error);
                });
        }
    }, [map, latitude, longitude, coords]);

    return <MapContainer ref={mapContainerRef} />;
};

export default MapView;
