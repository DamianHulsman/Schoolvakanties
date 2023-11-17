import * as Location from 'expo-location';
import axios from 'axios';

const determineRegion = (province, municipality) => {
    const northProvinces = ['Drenthe', 'Friesland', 'Groningen', 'Noord-Holland', 'Overijssel'];
    const northMunicipalities = ['Almere', 'Dronten', 'Lelystad', 'Noordoosterpolder', 'Urk', 'Hattem', 'Eemnes', 'Abcoude'];

    const middleProvinces = ['Zuid-Holland'];
    const middleMunicipalities = ['Aalten', 'Apeldoorn', 'Barneveld', 'Berkelland', 'Bronckhorst', 'Brummen', 'Buren', 'Culemborg', 'Doetinchem', 'Ede', 'Elburg', 'Epe', 'Ermelo', 'Harderwijk', 'Heerde', 'Lochem', 'Montferland', 'Neder-Betuwe', 'Nijkerk', 'Nunspeet', 'Oldebroek', 'Oost-Gelre', 'Oude IJsselstreek', 'Putten', 'Scherpenzeel', 'Tiel', 'Voorst', 'Wageningen', 'West Betuwe', 'Winterswijk', 'Zutphen', 'Altena', 'Zeewolde'];

    const southProvinces = ['Limburg', 'Zeeland'];
    const southMunicipalities = ['Arnhem', 'Berg en Dal', 'Beuningen', 'Doesburg', 'Druten', 'Duiven', 'Heumen', 'Lingewaard', 'Maasdriel', 'Montferland', 'Nijmegen', 'Overbetuwe', 'Renkum', 'Rheden', 'Rozendaal', 'Rijnwaarden', 'Westervoort', 'West Maas en Waal', 'Wijchen', 'Zaltbommel', 'Zevenaar'];

    if (northProvinces.includes(province) || northMunicipalities.includes(municipality)) {
      return 'noord';
    } else if (middleProvinces.includes(province) || middleMunicipalities.includes(municipality)) {
      return 'midden';
    } else if (southProvinces.includes(province) || southMunicipalities.includes(municipality)) {
      return 'zuid';
    } else {
      return 'Onbekende regio';
    }
  }
  
  async function fetchSchoolHolidays() {
    try {
      const response = await axios.get('https://opendata.rijksoverheid.nl/v1/sources/rijksoverheid/infotypes/schoolholidays/schoolyear/2023-2024?output=json');
      console.log(response.data);
      return response.data.content[0].vacations;
    } catch (error) {
      console.error('Fout bij het ophalen van schoolvakantiegegevens:', error);
      return null;
    }
  }

  async function findNextHoliday(region) {
    const schoolHolidaysData = await fetchSchoolHolidays();
    if (schoolHolidaysData) {
      const currentDate = new Date();
      const futureHolidays = [];
      for (let holiday of schoolHolidaysData) {
        const regionData = holiday.regions.find((r) => r.region === region || r.region === 'heel Nederland');
        if (regionData) {
          const startDate = new Date(regionData.startdate);
          if (startDate > currentDate) {
            const daysUntilNextHoliday = Math.ceil((startDate - currentDate) / (1000 * 60 * 60 * 24));
            futureHolidays.push({
              holidayName: holiday.type.trim(),
              daysUntilNextHoliday,
              startDate,
            });
          }
        }
      }
      if (futureHolidays.length > 0) {
        futureHolidays.sort((a, b) => a.startDate - b.startDate);
        return futureHolidays[0];
      }
    }
    return null;
  }

  async function findAllFutureHolidays(region) {
    // Fetch all holidays
    const allHolidays = await fetchSchoolHolidays();
  
    // Filter out holidays that are in the past or not in the given region
    const futureHolidays = allHolidays.filter(holiday => {
    const regionData = holiday.regions.filter(r => r.region === region || r.region === 'heel Nederland');
      return regionData && new Date(regionData.startdate) > new Date();
    });
  
    // Map the holidays to a new array with only the relevant information
    const mappedHolidays = futureHolidays.map(holiday => {
      const regionData = holiday.regions.find(r => r.region === region);
      const holidayName = holiday.type.trim();
      console.warn('holidayName:', holidayName);
      return {
        holidayName: holiday.type,
        startDate: new Date(regionData.startdate),
        endDate: new Date(regionData.enddate),
      };
    });
  
    // Return the mapped holidays
    return mappedHolidays;
  }

export { GetLocation, findNextHoliday, reverseGeocode, determineRegion, findAllFutureHolidays};  
  