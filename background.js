importScripts('lib/turf.min.js');

let geojsonData;
let schooldata;
const schoolcodeToSchoolName = new Map();

async function loadGeoJSON() {
    const response = await fetch(chrome.runtime.getURL('catchments_primary.geojson'));
    if (!response.ok) {
        throw new Error('Failed to load GeoJSON data');
    }
    geojsonData = await response.json(); // Cache GeoJSON data
    console.log('GeoJSON data loaded:', geojsonData);
}

async function loadSchoolData() {
    const response = await fetch(chrome.runtime.getURL('schooldata.json'));
    if (!response.ok) {
        throw new Error('Failed to load school data');
    }
    schooldata = await response.json(); // Cache school data
    console.log('School data loaded:', schooldata);
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

        loadGeoJSONAndCheckPoint(geojsonData, pointToCheck)
            .then(school => {
                sendResponse({ school });
            })
            .catch(error => {
                console.error('Error checking point:', error);
                sendResponse({ school: "" }); // Return null on error
            });

        return true; // Keep the message channel open for async response
    }
});

// Function to check if a point is inside any catchment polygon
function checkPointInCatchment(point, geojson) {
    const turfPoint = turf.point(point);

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

async function loadGeoJSONAndCheckPoint(geojsonData, pointToCheck) {
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



