const sel = document.querySelector("body > script:nth-child(2)");

const property_details = sel.textContent.split("=").slice(1).join("=");


const lat = property_details.indexOf("latitude");
const long = property_details.indexOf("longitude");
const marketing_price_range = property_details.indexOf("marketing_price_range");

console.log(property_details.substring(lat, lat + 25).replace(/\\\\\\\"/g, ''));
console.log(property_details.substring(long, long + 26).replace(/\\\\\\\"/g, ''));
console.log(
  property_details.substring(marketing_price_range, marketing_price_range + 57).replace(/\\\\\\\\\\\\\\\"/g,'')
);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "myMessage") {
    const addressElement = document.querySelector(
      "#argonaut-wrapper > div.details > div.details__wrapper > div.details__hero > div > div > div.hero-poster__pip > div > div.property-info__header > div.property-info__address-actions > h1"
    );

    const addressElement2 = document.querySelector(
      "#argonaut-wrapper > div.details > div.details__wrapper > div.details__main.layout > div.details__content.layout__content > div > div > div.property-info > div.property-info__header > div.property-info__address-actions > h1"
    );

    const address = addressElement
      ? addressElement.textContent
      : addressElement2.textContent;

    chrome.runtime.sendMessage({ type: "getAddress", address }, (response) => {
      sendResponse({ school: response.school });
      return true;
    });
  }
  return true;
});


