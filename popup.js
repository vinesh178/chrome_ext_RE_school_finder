document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("button1").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      var currentTab = tabs[0].id;

      chrome.tabs.sendMessage(currentTab, { type: "myMessage" }, (response) => {
        if (chrome.runtime.lastError) {
          console.error(
            `error in popup.js - ${chrome.runtime.lastError.message}`
          );
        } else {
          // console.log("response in popup.js", JSON.stringify(response));
          const school = response.school.school;
          document.getElementById("catchment").textContent = school;
        }
      });
    });
  });
});
