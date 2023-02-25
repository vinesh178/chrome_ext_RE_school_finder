
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

  if (request.type === "getAddress") {
    // get the address
    const address = request.address;
  
    let school = "";

    fetch(chrome.runtime.getURL("./.env"))
      .then((response) => response.text())
      .then(async (text) => {
        const apiKey = text.split(":")[1];

        const locationIqKeyUrl = `https://us1.locationiq.com/v1/search?key=${apiKey}&q=${address}&format=json`;
       

        try {
          const response = await fetch(locationIqKeyUrl);
          const data_1 = await response.json();
          const latitude = data_1[0].lat;
          const longitude = data_1[0].lon;
       

          // send query to school finder
          const schoolfinderurl = `https://cesensw.cartodb.com/api/v2/sql?q=SELECT s.*, b.cartodb_id, b.calendar_year, b.catchment_level, b.priority,
                             b.school_type, b.shape_area, b.kindergarten, b.year1, b.year2, b.year3, b.year4, b.year5, b.year6, b.year7, b.year8, b.year9, b.year10, b.year11, b.year12, ST_DISTANCE(s.the_geom::geography,
                             ST_SetSRID(ST_Point(${longitude},${latitude}),4326)::geography) AS dist FROM dec_schools_2020 AS s JOIN catchments_2020 AS b ON
                             s.school_code = b.school_code WHERE (ST_CONTAINS(b.the_geom, ST_SetSRID(ST_Point(${longitude},${latitude}),4326)) AND (catchment_level IN ('primary','infants'))) ORDER BY dist ASC `;

        
          const response_1 = await fetch(schoolfinderurl);
          const data_2 = await response_1.json();
          school = data_2.rows[0].school_name;
         
          sendResponse({ school });

        } catch (error) {
          console.error(error);
          sendResponse({ error });
        }
      })
    return true;
  }

});

