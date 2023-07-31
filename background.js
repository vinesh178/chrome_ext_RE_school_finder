chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "getAddress") {
    const lat = request.lat;
    const long = request.long;

    // send query to school finder
    const schoolfinderurl = `https://cesensw.cartodb.com/api/v2/sql?q=SELECT s.*, b.cartodb_id, b.calendar_year, b.catchment_level, b.priority,
                         b.school_type, b.shape_area, b.kindergarten, b.year1, b.year2, b.year3, b.year4, b.year5, b.year6, b.year7, b.year8, b.year9, b.year10, b.year11, b.year12, ST_DISTANCE(s.the_geom::geography,
                         ST_SetSRID(ST_Point(${long},${lat}),4326)::geography) AS dist FROM dec_schools_2020 AS s JOIN catchments_2020 AS b ON
                         s.school_code = b.school_code WHERE (ST_CONTAINS(b.the_geom, ST_SetSRID(ST_Point(${long},${lat}),4326)) AND (catchment_level IN ('primary','infants'))) ORDER BY dist ASC `;
    fetch(schoolfinderurl)
      .then((response) => response.json())
      .then((data) => {
        if (data.rows.length === 0) {
          return "";
        } else {
          return data.rows[0].school_name;
        }
      })
      .then((school) => sendResponse({ school }));

    return true;
  }
});
