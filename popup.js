document.addEventListener("DOMContentLoaded", () => {

  document.getElementById("details").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      var currentTab = tabs[0].id;

      chrome.tabs.sendMessage(currentTab, { type: "myMessage" },  (response) => {
        if (chrome.runtime.lastError) {
          console.error(
            `error in popup.js - ${chrome.runtime.lastError.message}`
          );
        } else {
          const school =  response.school;
          document.getElementById("catchment").textContent = school;
        }
      });
    });
  });
});
