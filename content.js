chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  
//     const script = document.querySelector("body > script:nth-child(2)").innerHTML.split("=").slice(1).join('=');
//   console.log(`script ${script}`);
//   const regex = /"marketing_price_range":"([^"]+)"/;
//   const match = regex.exec(script);
//   const marketingPriceRange = match ? match[1] : null;
//   console.log(marketingPriceRange); // outputs "750pw_1000pw" for the given script

  
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
