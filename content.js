document.addEventListener("DOMContentLoaded", function() {
 
  const sel = document.querySelector("body > script:nth-child(2)");

const property_details = sel.textContent.split("=").slice(1).join("=");


const latitude = property_details.indexOf("latitude");
const longitude = property_details.indexOf("longitude");
const marketing_price_range1 = property_details.indexOf("marketing_price_range");


const lat = property_details.substring(latitude, latitude + 25).replace(/[\/\\,]/g, "").split(":")[1].replace(",","")
const long = property_details.substring(longitude, longitude + 26).replace(/[\/\\,]/g, "").split(":")[1].replace(",","")


const marketing_price_range = property_details.substring(marketing_price_range1, marketing_price_range1 + 57).replace(/[\/\\,]/g, '').split(":")[1].replace(/"/g,"")


const [min, max] = marketing_price_range.split("_");


const mpr = `${min} to ${max}`;

chrome.runtime.sendMessage({ type: "getAddress", lat: lat, long: long }, (response) => {
  const div = document.querySelector("#argonaut-wrapper > div.details > div.details__wrapper > div.details__hero > div > div > div.hero-poster__pip > div > div.property-info__header")

  const div2 = document.querySelector("#argonaut-wrapper > div.details > div.details__wrapper > div.details__main.layout > div.details__content.layout__content > div > div > div.property-info > div.property-info__header > div.property-info__address-actions")

  const finalDiv = div ? div : div2

  finalDiv.id = 'school-name';
  finalDiv.append(`${response.school} - ${mpr}`)

});



});




