chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fetchVIN") {
      const url = `https://auto.dev/api/listings/${request.vin}`;
      fetch(url, {
        headers: new Headers({
          "Authorization": "Bearer ZrQEPSkKcGFpbW9uZ291bGFydEBnbWFpbC5jb20="
        })
      })
      .then(response => response.json())
      .then(data => sendResponse({data: data}))
      .catch(error => sendResponse({error: error.toString()}));
      return true; 
    }
  });
