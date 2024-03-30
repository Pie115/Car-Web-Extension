chrome.runtime.sendMessage({action: "fetchVIN", vin: "ZPBUA1ZL9KLA00848"}, response => {
    if (response.data) {
      console.log("VIN Data:", response.data);
    } else if (response.error) {
      console.error("Error:", response.error);
    }
  });

  function detectVIN() {
    const bodyText = document.body.innerText;
    const vinRegex = /[A-HJ-NPR-Z0-9]{17}/g;
    let vinMatches = bodyText.match(vinRegex);

    vinMatches = [...new Set(vinMatches)];
    
    if (vinMatches && vinMatches.length > 0) {
        chrome.runtime.sendMessage({action: "vinDetected", vin: vinMatches[0]});
    }
}

detectVIN();


const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) detectVIN();
  });
});
observer.observe(document.body, { childList: true, subtree: true });
