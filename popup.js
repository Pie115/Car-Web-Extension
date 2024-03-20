document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('fetchButton').addEventListener('click', function() {
        const vin = document.getElementById('vinInput').value;
        if (vin) {
            chrome.runtime.sendMessage({action: "fetchVIN", vin: vin}, function(response) {
                if (response.data) {
                    const price = response.data.price || "Price not available";
                    const resultText = `Price: ${price}`;
                    document.getElementById('result').textContent = resultText;
                } else if (response.error) {
                    document.getElementById('result').textContent = 'Error: ' + response.error;
                } else {
                    document.getElementById('result').textContent = 'No response from background.';
                }
            });
        } else {
            document.getElementById('result').textContent = 'Please enter a VIN.';
        }
    });
});
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fetchVIN") {
        const url = `https://auto.dev/api/vin/${request.vin}?apikey=YOUR_API_KEY`;
        
        fetch(url)
            .then(response => response.json())
            .then(data => {
                let estimatedPrice = data.price?.estimateTmv || data.price?.baseMsrp; // Example of accessing nested pricing information
                sendResponse({data: data, estimatedPrice: estimatedPrice});
            })
            .catch(error => sendResponse({error: error.toString()}));
        
        return true; 
    }
});
