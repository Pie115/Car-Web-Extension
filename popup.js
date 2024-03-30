document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.local.get('detectedVIN', function(data) {
        if (data.detectedVIN) {
            document.getElementById('vinInput').value = data.detectedVIN;
            fetchVINDetails(data.detectedVIN); 
        }
    });

    document.getElementById('fetchButton').addEventListener('click', function() {
        const vin = document.getElementById('vinInput').value;
        fetchVINDetails(vin);
    });
});

function fetchVINDetails(vin) {
    if (vin) {
        chrome.runtime.sendMessage({action: "fetchVIN", vin: vin}, function(response) {
            if (response.data && response.data.price) {
                const priceString = response.data.price.replace('$', '').replace(',', '');
                const price = parseFloat(priceString);
                if (!isNaN(price)) {
                    console.log(`Fetched price: $${price}`);
                    updatePriceHeatmap(price, 0, 100000);
                } else {
                    console.error('Price parsing resulted in NaN.');
                }
            } else if (response.error) {
                console.error(`Error fetching VIN details: ${response.error}`);
            }
        });
    }
}
function updatePriceHeatmap(price, minPrice, maxPrice) {
    const clampedPrice = Math.max(minPrice, Math.min(price, maxPrice));
    const positionPercent = ((clampedPrice - minPrice) / (maxPrice - minPrice)) * 100;
    const marker = document.getElementById('priceMarker');

    marker.style.left = `${positionPercent}%`;

    //document.getElementById('minPrice').textContent = `$${minPrice.toLocaleString()}`;
    //document.getElementById('maxPrice').textContent = `$${maxPrice.toLocaleString()}`;
    const currentPriceLabel = document.getElementById('currentPrice');
    currentPriceLabel.textContent = `$${price.toLocaleString()}`;

    currentPriceLabel.style.left = `${positionPercent}%`;
}