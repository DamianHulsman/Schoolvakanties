import React, { useState, useEffect } from 'react';
import { View, Text, Button, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchSchoolHolidays, findNextHoliday } from '../functions'; // replace with the actual path

const Vacations = () => {
    const [mappedHolidays, setMappedHolidays] = useState([]);
    const [isEnabled, setIsEnabled] = useState(false);
    const [customregion, setCustomregion] = useState('noord');
    const [nextHoliday, setNextHoliday] = useState({});
    try {

        useEffect(() => {
            
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

            const getHolidays = async () => {
                const currentRegion = await AsyncStorage.getItem('currentregion');
                const data = await fetchSchoolHolidays(currentRegion);

                const filteredData = data.map((holiday, index) => {
                    let startDate = "";
                    let endDate = "";
                    if (holiday.regions.some((r) => r.region === "heel Nederland")) {
                    const heelNederlandDates = holiday.regions.find(
                        (r) => r.region === "heel Nederland"
                      );

                      if (heelNederlandDates) {
                        startDate = heelNederlandDates.startdate;
                        endDate = heelNederlandDates.enddate;

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
                          }
                        return {
                            type: holiday.type.trim(),
                            startDate: new Date(startDate).toLocaleDateString('nl-NL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
                            endDate: new Date(endDate).toLocaleDateString('nl-NL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                        };
                        }
                    })
                let mappedHoliday = [];
                filteredData.map((holiday, index) => {
                    let hStyle = styles[holiday.type];
                    mappedHoliday.push(<View key={index} style={[styles.holiday, hStyle]}>
                        <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>{holiday.type}</Text>
                            <View key={index}>
                                <Text>Startdatum: {holiday.startDate}</Text>
                                <Text>Einddatum: {holiday.endDate}</Text>
                            </View>

                    </View>
                    );
                })
                setMappedHolidays(mappedHoliday);
            }

            const nextHoliday = async () => {
                const currentRegion = await AsyncStorage.getItem('currentregion');
                const nextholiday = await findNextHoliday((isEnabled ? currentRegion : customregion));
                setNextHoliday(nextholiday);
            }


            fetchData();
            getHolidays();
            nextHoliday();
        }, []);
    } catch (err) {
        console.log(err);
    }
    return (
        <View>
            <ScrollView>
                <View style={styles.nextHolidayView}>
                    <Text style={styles.nextHolidayTitle}>Dagen tot volgende vakantie: {nextHoliday.daysUntilNextHoliday}</Text>
                    <Text style={styles.nextHolidaySubTitle}>Volgende vakantie: {nextHoliday.holidayName}</Text>
                    <Text style={styles.nextHolidaySubTitle}>Startdatum: {new Date(nextHoliday.startDate).toLocaleDateString('nl-NL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
                </View>
                {mappedHolidays}
            </ScrollView>
        </View>
    );
};

export default Vacations;

const styles = StyleSheet.create({
    holiday: {
        margin: 5,
        padding: 5
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