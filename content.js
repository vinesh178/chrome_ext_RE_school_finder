chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "myMessage") {
    const addressElement = document.querySelector(
      "#argonaut-wrapper > div.details > div.details__wrapper > div.details__hero > div > div > div.hero-poster__pip > div > div.property-info__header > div.property-info__address-actions > h1"
    );
    const address = addressElement.textContent;

    chrome.runtime.sendMessage({ type: "getAddress", address }, (response) => {
      // const school = response.school

      sendResponse({ school: response });
      return true;
    });
  }
  return true;
});
