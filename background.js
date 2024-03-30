chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "vinDetected") {
        chrome.action.setBadgeText({text: 'VIN', tabId: sender.tab.id});
        chrome.action.setBadgeBackgroundColor({color: '#FF0000', tabId: sender.tab.id});

        chrome.storage.local.set({detectedVIN: request.vin});
    } else if (request.action === "fetchVIN") {
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

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'loading') {
        chrome.storage.local.remove('detectedVIN', function() {
            console.log('Detected VIN cleared for new page load.');
        });
        chrome.action.setBadgeText({text: '', tabId: tabId});
    }
});