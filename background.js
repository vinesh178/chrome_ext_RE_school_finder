importScripts('lib/turf.min.js');

let geojsonData;
let schooldata;
const schoolcodeToSchoolName = new Map();

async function loadGeoJSON() {
    if (!geojsonData) {
        const response = await fetch(chrome.runtime.getURL('catchments_primary.geojson'));
        if (!response.ok) {
            throw new Error('Failed to load GeoJSON data');
        }
        geojsonData = await response.json(); // Cache GeoJSON data
        console.log('GeoJSON data loaded:', geojsonData);
    } else {
        console.log('GeoJSON data loaded from cache');
    }
}

async function loadSchoolData() {
    if (!schooldata) {
        const response = await fetch(chrome.runtime.getURL('schooldata.json'));
        if (!response.ok) {
            throw new Error('Failed to load school data');
        }
        schooldata = await response.json(); // Cache school data
        console.log('School data loaded:', schooldata);
    } else {
        console.log('School data loaded from cache');
    }
}

// Load both datasets and wait for them to finish
Promise.all([loadGeoJSON(), loadSchoolData()])
    .then(() => {
        console.log('Both datasets loaded successfully');
    })
    .catch(error => {
        console.error('Error loading datasets:', error);
    });

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "getAddress") {
        const pointToCheck = [request.long, request.lat];

        console.log(`address lat ${request.lat} and long ${request.long}`);

        // Ensure geojsonData is loaded before checking the point
        if (!geojsonData) {
            console.error('GeoJSON data is not loaded');
            sendResponse({ school: null });
            return;
        }

        loadGeoJSONAndCheckPoint(pointToCheck)
            .then(school => {
                sendResponse({ school });
            })
            .catch(error => {
                console.error('Error checking point:', error);
                sendResponse({ school: null }); // Return null on error
            });

        return true; // Keep the message channel open for async response
    }
});

// Function to check if a point is inside any catchment polygon
function checkPointInCatchment(point, geojson) {
    const turfPoint = turf.point(point);

    // Check if geojson is defined and has features
    if (!geojson || !geojson.features) {
        console.error('Invalid GeoJSON data');
        return null;
    }

    for (let feature of geojson.features) {
        const polygon = feature.geometry;
        const useDesc = feature.properties.USE_ID;

        const isInside = turf.booleanPointInPolygon(turfPoint, polygon);

        if (isInside) {
            return useDesc;  // Return USE_DESC if the point is inside
        }
    }

    return null;  // Return null if the point is not inside any polygon
}

async function loadGeoJSONAndCheckPoint(pointToCheck) {
    await Promise.all([loadGeoJSON(), loadSchoolData()]); // Ensure both datasets are loaded
    const result = checkPointInCatchment(pointToCheck, geojsonData);

    if (result) {
        console.log(`The point is inside the catchment. USE_ID: ${result}`);

        // Check if the school name is already cached
        if (schoolcodeToSchoolName.has(result)) {
            console.log("Returning cached school name:", schoolcodeToSchoolName.get(result));
            return schoolcodeToSchoolName.get(result); // Return cached school name
        }

        // Now look for the corresponding school in schooldata
        const school = schooldata.find(s => s.School_code === result);
        if (school) {
            // Cache the school name
            console.log(`Setting cached school code: ${result} with name: ${school.School_name}`);

            console.log(`School lat ${school.Latitude} and long ${school.Longitude}`);
            schoolcodeToSchoolName.set(result, school.School_name);
            return school.School_name; // Return the school name
        } else {
            console.log("School not found for the given USE_ID.");
            return null; // or return an appropriate message if needed
        }
    } else {
        console.log("The point is not inside any catchment.");
        return null; // Return null if not inside any catchment
    }
}

async function getWalkingDistance(startLat, startLon, endLat, endLon) {
    const apiKey = '5b3ce3597851110001cf6248fc6484b42c8649e2a8e3f576417fe43b'; // Replace with your actual API key
    const url = `https://api.openrouteservice.org/v2/directions/foot-walking?api_key=${apiKey}&start=${startLon},${startLat}&end=${endLon},${endLat}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        console.log(data);

        if (data.features && data.features.length > 0) {
            const distanceInMeters = data.features[0].properties.segments[0].distance;
            const distanceInKm = distanceInMeters / 1000;
            return distanceInKm.toFixed(2);
        } else {
            throw new Error('No route found');
        }
    } catch (error) {
        console.error('Error calculating walking distance:', error);
        return null;
    }
}
