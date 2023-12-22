import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { fetchSchoolHolidays, findNextHoliday } from '../functions';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const Vacations = () => {
    const [mappedHolidays, setMappedHolidays] = useState([]);
    const [isEnabled, setIsEnabled] = useState(false);
    const [customregion, setCustomregion] = useState('noord');
    const [nextHoliday, setNextHoliday] = useState({});
    const [selectedYear, setSelectedYear] = useState('2023-2024');
    const [nextholidayIcon, setNextholidayIcon] = useState('');
    try {

        useEffect(() => {

            // Haal de data op uit de asyncstorage
            const fetchData = async () => {

                const isEnabledData = await AsyncStorage.getItem('isEnabled');
                const customregionData = await AsyncStorage.getItem('customregion');
                if (isEnabledData !== null) {
                    setIsEnabled(isEnabledData);
                }
                if (customregionData !== null) {
                    setCustomregion(customregionData);
                }

            };

            // Haal de vakanties op
            const getHolidays = async () => {
                const currentRegion = await AsyncStorage.getItem('currentregion');
                const year = selectedYear;
                const data = await fetchSchoolHolidays(year);

                // Filter de vakanties op de regio
                const filteredData = data.map((holiday) => {
                    let startDate = "";
                    let endDate = "";
                    let icon;
                    if (holiday.regions.some((r) => r.region === "heel Nederland")) {
                        const heelNederlandDates = holiday.regions.find(
                            (r) => r.region === "heel Nederland"
                        );

                        if (heelNederlandDates) {
                            startDate = heelNederlandDates.startdate;
                            endDate = heelNederlandDates.enddate;
                            if(holiday.type.trim() === 'Zomervakantie') {
                                icon = <FontAwesome5 name="sun" size={30} color="black" />;
                            } else if (holiday.type.trim() === 'Kerstvakantie') {
                                icon = <FontAwesome5 name="gift" size={30} color="black" />;
                            } else if(holiday.type.trim() === 'Meivakantie') {
                                icon = <FontAwesome5 name="flower" size={30} color="black" />;
                            } else if(holiday.type.trim() === 'Herfstvakantie') {
                                icon = <FontAwesome5 name="leaf" size={30} color="black" />;
                            } else if(holiday.type.trim() === 'Voorjaarsvakantie') {
                                icon = <FontAwesome5 name="leaf" size={30} color="black" />;
                            } else {
                                icon = <FontAwesome5 name="calendar" size={30} color="black" />;
                            }
                        }
                        return {
                            type: holiday.type.trim(),
                            startDate: new Date(startDate).toLocaleDateString('nl-NL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
                            endDate: new Date(endDate).toLocaleDateString('nl-NL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                        };
                    }
                    else {
                        const selectedRegion = holiday.regions.find(
                            (r) => r.region === (isEnabled ? currentRegion : customregion)
                        );
                        if (selectedRegion) {
                            startDate = selectedRegion.startdate;
                            endDate = selectedRegion.enddate;
                            if(holiday.type.trim() === 'Zomervakantie') {
                                icon = <FontAwesome5 name="sun" size={30} color="black" />;
                            } else if (holiday.type.trim() === 'Kerstvakantie') {
                                icon = <FontAwesome5 name="snowman" size={30} color="black" />;
                            } else if(holiday.type.trim() === 'Meivakantie') {
                                icon = <FontAwesome5 name="sun" size={30} color="black" />;
                            } else if(holiday.type.trim() === 'Herfstvakantie') {
                                icon = <FontAwesome5 name="leaf" size={30} color="black" />;
                            } else if(holiday.type.trim() === 'Voorjaarsvakantie') {
                                icon = <FontAwesome5 name="rose" size={30} color="black" />;
                            } else {
                                icon = <FontAwesome5 name="calendar" size={30} color="black" />;
                            }

                            return {
                                type: holiday.type.trim(),
                                icon: icon,
                                startDate: new Date(startDate).toLocaleDateString('nl-NL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
                                endDate: new Date(endDate).toLocaleDateString('nl-NL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                            };
                        }
                        
                    }
                })
                let mappedHoliday = [];

                // Map de vakanties naar een view
                filteredData.map((holiday, index) => {
                    let hStyle = styles[holiday.type];
                    mappedHoliday.push(<View key={index} style={[styles.holiday, hStyle]}>
                        <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>{holiday.type}</Text>
                        <View key={index} style={{display: 'flex', flexDirection: 'row'}}>
                            <View style={{flex: 3}}>
                                <Text>Startdatum: {holiday.startDate}</Text>
                                <Text>Einddatum: {holiday.endDate}</Text>
                            </View>
                            <View style={{flex: 1}}>
                                {holiday.icon}
                            </View>
                        </View>

                    </View>
                    );
                })
                setMappedHolidays(mappedHoliday);
            }

            // Haal de volgende vakantie op
            const nextHoliday = async () => {
                const currentRegion = await AsyncStorage.getItem('currentregion');
                const nextholiday = await findNextHoliday(selectedYear, (isEnabled ? currentRegion : customregion));
                if (nextholiday !== null) {
                    setNextHoliday(nextholiday);
                } else {
                    console.log('No next holiday found');
                }
            }


            fetchData();
            getHolidays();
            nextHoliday();
        }, [selectedYear, customregion, isEnabled]);
    } catch (err) {
        console.log(err);
    }
    return (
        <View>
            <ScrollView>
                <Picker
                    selectedValue={selectedYear}
                    onValueChange={(itemValue) => { setSelectedYear(itemValue) }}
                >
                    <Picker.Item label="2023-2024" value="2023" />
                    <Picker.Item label="2024-2025" value="2024" />
                    <Picker.Item label="2025-2026" value="2025" />
                </Picker>
                <View style={styles.nextHolidayView}>
                    {nextHoliday.icon}
                    <Text style={styles.nextHolidayTitle}>Dagen tot volgende vakantie: {nextHoliday.daysUntilNextHoliday}</Text>
                    <Text style={styles.nextHolidaySubTitle}>Volgende vakantie: {nextHoliday.holidayName}</Text>
                    <Text style={styles.nextHolidaySubTitle}>Startdatum: {new Date(nextHoliday.startDate).toLocaleDateString('nl-NL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
                </View>
                {mappedHolidays}
            </ScrollView>
        </View>
    );
};


const styles = StyleSheet.create({
    holiday: {
        margin: 5,
        padding: 5,
    },
    Kerstvakantie: {
        backgroundColor: 'red',
    },
    Meivakantie: {
        backgroundColor: 'lime',
    },
    Herfstvakantie: {
        backgroundColor: 'orange',
    },
    Voorjaarsvakantie: {
        backgroundColor: 'aqua',
    },
    Zomervakantie: {
        backgroundColor: 'yellow',
    },
    nextHolidayTitle: {
        fontSize: 23,
        fontWeight: 'bold'
    },
    nextHolidayView: {
        margin: 5,
        padding: 5,
    },
    nextHolidaySubTitle: {
        fontSize: 20,
    },
});

export default Vacations;