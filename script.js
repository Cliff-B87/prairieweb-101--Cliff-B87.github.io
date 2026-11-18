const form = document.getElementById("enquiryForm");
form.addEventListener("submit", function(event) {
    event.preventDefault();
    console.log("Form submitted");

const visitorname = document.getElementById("name").value.trim();
const nameError = document.getElementById("nameError");
const email = document.getElementById("email").value.trim();
const emailError = document.getElementById("emailError");
const trailLength = document.getElementById("Trail-Length").value.trim();
const trailLengthError = document.getElementById("trailLengthError");
const message = document.getElementById("message").value.trim();
const messageError = document.getElementById("messageError");
const result = document.getElementById("result");
let isValid = true;
nameError.textContent = "";
emailError.textContent = "";
trailLengthError.textContent = "";
messageError.textContent = "";
result.textContent = "";

if (visitorname === "") {
    nameError.textContent =
        "Please enter your name.";
    isValid = false;
}
if (email === "") {
    emailError.textContent =
        "Please enter your email address.";
    isValid = false;
}
else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    emailError.textContent =
        "Please enter a valid email address.";
    isValid = false;
}
if (trailLength === "") {
        trailLengthError.textContent = "Please select a trail length.";
        isValid = false;
    }
if (message === "") {
    messageError.textContent =
        "Please enter your message.";
    isValid = false;
} else if (message.length > 500) {
    messageError.textContent =
        "Your message is too long. Please keep it under 500 characters.";
    isValid = false;
}
if (isValid) {
    const data = Object.fromEntries(
        new FormData(form).entries()
    );
    console.log(JSON.stringify(data, null, 2));
    
    result.textContent =
        "Thank you for your enquiry. We'll get back to you soon";
    result.className = "success";
}
});


fetch("config.json")
    .then(response => {
        if (!response.ok) {
            throw new Error("Configuration request failed: " + response.status);
        }
        return response.json();
    })
    .then(config => {

        // Google Maps settings
        const mapKey = config.mapKey;
        const mapLocation = config.mapLocation;

        // Weather settings
        const weatherKey = config.weather.weatherKey;
        const city = config.weather.location;
        const units = config.weather.units;

        // Google Maps initialization
        function initMap() {

            const location = {
                lat: mapLocation.latitude,
                lng: mapLocation.longitude
            };

            const map = new google.maps.Map(
                document.getElementById("map"),
                {
                    zoom: mapLocation.zoom,
                    center: location
                }
            );
        }

        window.initMap = initMap;

        // Load Google Maps API
        const mapScript = document.createElement("script");

        mapScript.src =
            `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(mapKey)}&loading=async&callback=initMap`;

        mapScript.async = true;

        document.head.appendChild(mapScript);

        // Weather request
        const weatherURL =
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${encodeURIComponent(weatherKey)}&units=${units}`;

        fetch(weatherURL)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Weather request failed: " + response.status);
                }
                return response.json();
            })
            .then(data => {

                console.log(data);

                document.getElementById("city").textContent =
                    data.name;

                document.getElementById("temperature").textContent =
                    "Temperature: " + data.main.temp + "°C";

                document.getElementById("conditions").textContent =
                    "Conditions: " + data.weather[0].description;

                document.getElementById("humidity").textContent =
                    "Humidity: " + data.main.humidity + "%";

                document.getElementById("wind").textContent =
                    "Wind speed: " + data.wind.speed + " m/s";

            })
            .catch(error => {
                console.error("Weather error:", error);
            });

    })
    .catch(error => {
        console.error("Configuration error:", error);
    });