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
