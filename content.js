
const addressElement = document.querySelector(
    "#argonaut-wrapper > div.details > div.details__wrapper > div.details__hero > div > div > div.hero-poster__pip > div > div.property-info__header > div.property-info__address-actions > h1"
  );
  const address = addressElement.textContent;

  console.log(`address ${address}`);

  chrome.runtime.sendMessage({ address }, (response) => {
    console.log(
      `latitude : ${response.latitude} , longitude - ${response.longitude}`
    );
  });