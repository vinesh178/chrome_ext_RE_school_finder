importScripts('lib/turf.min.js');

let geojsonData;
let schooldata;

fetch(chrome.runtime.getURL('catchments_primary.geojson'))
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        geojsonData = data; // Store the fetched GeoJSON data
        console.log('GeoJSON data loaded:', geojsonData);
    })
    .catch(error => {
        console.error('Error fetching GeoJSON data:', error);
    });

fetch(chrome.runtime.getURL('schooldata.json'))
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        schooldata = data; // Store the fetched GeoJSON data
        console.log('School data loaded:', schooldata);
    })
    .catch(error => {
        console.error('Error fetching School data:', error);
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
        
        // Now look for the corresponding school in schooldata
        const school = schooldata.find(s => s.School_code === result);
        if (school) {
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





