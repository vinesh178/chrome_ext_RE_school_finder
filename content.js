chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  
  if (request.type === "myMessage") {
    const addressElement = document.querySelector(
      "#argonaut-wrapper > div.details > div.details__wrapper > div.details__hero > div > div > div.hero-poster__pip > div > div.property-info__header > div.property-info__address-actions > h1"
    );

  const finalDiv = div ? div : div2

  const schoolString = response.school ? `${response.school} - ${mpr}` : `${mpr}`;
  finalDiv.id = 'school-name';
  finalDiv.append(schoolString);

});





