import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import {
    List, ListItem, ListItemText, Grid
} from "@mui/material";
import { getOfficers } from 'helper/helper';

function PopupDetails({ selectedMarker }) {
    console.log("selectedMarker",selectedMarker)
    const countyBuildings = useSelector(state => state.buildings)
    // const searchQuery = useSelector(state => state.global.searchQuery)
    const [paymentdistribution, setPaymentDistribution] = useState()
    const [ward,setWard] = useState()
    const [county,setCounty] = useState()

    useEffect(() => {
        const selected = countyBuildings?.filter(el => {
            return el._id === selectedMarker._id
        })

        setWard(selected[0]?.ward)
        setCounty(selected[0]?.county)

        

        function getPaymentStatusDistribution(permits) {
            const result = permits?.reduce((acc, permit) => {
                const paymentStatus = permit.payment_status;

                if (paymentStatus === 'Paid') {
                    acc.paid++;
                } else if (paymentStatus === 'Partially Paid') {
                    acc.partiallyPaid++;
                } else if (paymentStatus === 'Not Paid') {
                    acc.notPaid++;
                }

                return acc;
            }, { paid: 0, partiallyPaid: 0, notPaid: 0 });

            if (permits.length === 0) {
                return "No Occupants";
            }

            return result
        }

        if (selectedMarker) {
            const paymentDistribution = getPaymentStatusDistribution(selectedMarker?.singleBusinessPermits || []);
            setPaymentDistribution(paymentDistribution);
        }
    }, [selectedMarker])

    useEffect(()=>{
        let wardOfficer
        county !== undefined && getOfficers({county,role:"revenueOfficer"}).then(({data}) => {            
            wardOfficer = data?.filter(officer => {
                return officer.ward === ward
            })

            console.log("officer:",wardOfficer)
        })
    },[ward,county])
    
    return (
        <Grid width={325} height={500} container spacing={1} sx={{ maxWidth: "325px", maxHeight: "700px" }}>
            <Grid>
                <List>
                    <ListItem sx={{ marginBottom: '-20px', }}>
                        <ListItemText sx={{
                            fontSize: '8px',

                        }} primary={`NP-${paymentdistribution?.notPaid} : PP-${paymentdistribution?.partiallyPaid} : P-${paymentdistribution?.paid}`} />
                    </ListItem>
                    <ListItem>
                        <ListItemText sx={{
                            fontSize: '8px',
                        }} secondary={`Building # - ${selectedMarker?.building_number} : Structure - ${selectedMarker?.type_of_structure} : Floors - ${selectedMarker.floors || 0}`} />
                    </ListItem>

                    {selectedMarker?.singleBusinessPermits
                        // .filter((store) => {
                        //     const { business_category, is_building_open, store_no } = store;
                        //     const permitObj = { business_category, is_building_open, store_no };

                        //     for (const key in permitObj) {
                        //         if (permitObj[key].toString().toLowerCase().includes(searchQuery.toLowerCase())) {
                        //             return true;
                        //         }
                        //     }

                        //     return false;
                        // })
                        .map((store, index) => {
                            let borderColor;
                            if (store.payment_status === 'Paid') {
                                borderColor = 'green';
                            } else if (store.payment_status === 'Not Paid') {
                                borderColor = 'red';
                            } else if (store.payment_status === 'Partially Paid') {
                                borderColor = 'gold';
                            } else {
                                borderColor = 'teal';
                            }

                            return (
                                <ListItem
                                    key={index}
                                    sx={{
                                        marginBottom: '10px',
                                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                                        border: `2px solid ${borderColor}`,
                                        borderRadius: '2px',
                                        cursor: "pointer"
                                    }}
                                >
                                    <div>
                                        <ListItemText
                                            secondary={`Store # - ${store.store_no} - ${store.payment_status}`}
                                            primary={`${store.business_name}->${store.business_category}`}
                                            sx={{
                                                fontSize: '12px',
                                            }}
                                        />
                                    </div>
                                </ListItem>
                            );
                        })
                    }

                    {selectedMarker?.singleBusinessPermits
                        // .filter((store) => {
                        //     const { business_category, is_building_open, store_no } = store;
                        //     const permitObj = { business_category, is_building_open, store_no };

                        //     for (const key in permitObj) {
                        //         if (permitObj[key].toString().toLowerCase().includes(searchQuery.toLowerCase())) {
                        //             return true;
                        //         }
                        //     }

                        //     return false;
                        // })
                        .length === 0 && (
                            selectedMarker?.singleBusinessPermits.map((store, index) => {
                                let borderColor;
                                if (store.payment_status === 'Paid') {
                                    borderColor = 'green';
                                } else if (store.payment_status === 'Not Paid') {
                                    borderColor = 'red';
                                } else if (store.payment_status === 'Partially Paid') {
                                    borderColor = 'gold';
                                } else {
                                    borderColor = 'teal';
                                }
                                return (
                                    <ListItem
                                        key={index}
                                        sx={{
                                            marginBottom: '10px',
                                            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                                            border: `2px solid ${borderColor}`,
                                            borderRadius: '2px',
                                        }}
                                    >
                                        <div>
                                            <ListItemText
                                                secondary={`Store # - ${store.store_no} - ${store.payment_status}`}
                                                primary={`${store.business_name}->${store.business_category}`}
                                                sx={{
                                                    fontSize: '12px',
                                                }}
                                            />
                                        </div>
                                    </ListItem>
                                )
                            })
                        )}
                </List>
            </Grid>
            {/* <Grid item xs={6} sx={{ position: "fixed", top: 3, right: 9 }} width={320}>
                
                    <ListItem sx={{ marginBottom: '-5px', }}>
                        <ListItemText sx={{
                            fontSize: '6px',
                            fontStyle: 'bold'

                        }} primary={`STORE INFO: ${currentstore ? currentstore.business_name : ""}`} />
                    </ListItem>
                
                <br />

                {currentstore && (
                    <>
                        <Card>
                            <ListItem sx={{}}>
                                <ListItemText sx={{
                                    fontSize: '6px',
                                    fontStyle: 'bold'

                                }} secondary={`APPLICATION TYPE: ${currentstore.application_type}`} />
                            </ListItem>
                            <ListItem sx={{}}>
                                <ListItemText sx={{
                                    fontSize: '6px',
                                    fontStyle: 'bold'

                                }} secondary={`DESCRIPTION: ${currentstore.business_description}`} />
                            </ListItem>
                        </Card>
                        <br />
                        <Card>
                            <ListItem sx={{}}>
                                <ListItemText sx={{
                                    fontSize: '6px',
                                    fontStyle: 'bold'

                                }} secondary={`Message Officer`} />
                            </ListItem>
                            <TextareaAutosize
                                rows={4}
                                placeholder="..."
                                style={{
                                    maxWidth: '800px',
                                    resize: 'vertical',
                                    borderRadius: '2px',
                                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                                    border: `1px solid teal`,
                                    margin: '8px',
                                    padding: '8px'
                                }}
                                value={message}
                                onKeyDown={handleKeyDown}
                                onChange={handleMessage}
                            />
                        </Card>
                    </>
                )
                }

            </Grid> */}
        </Grid>
    )
}

export default PopupDetails