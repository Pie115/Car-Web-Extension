chrome.runtime.sendMessage({action: "fetchVIN", vin: "ZPBUA1ZL9KLA00848"}, response => {
    if (response.data) {
      console.log("VIN Data:", response.data);
    } else if (response.error) {
      console.error("Error:", response.error);
    }
  });