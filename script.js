// Define available cities with their English and Arabic names
const cities = [
    { en: "Riyadh", ar: "الرياض" },
    { en: "Makkah", ar: "مكة المكرمة" },
    { en: "Jeddah", ar: "جدة" },
    { en: "Dammam", ar: "الدمام" }
];
// Populate the city selection dropdown menu
let selectElement = document.getElementById("city-selected");
for (let city of cities) {
    selectElement.innerHTML += `<option value="${city.en}">${city.ar}</option>`;
}
// Fetch prayer times and update the UI based on the selected city
function getCityName(){
    let select = document.getElementById("city-selected");
    let citySelected = select.value;
    let cityNameAr = select.options[select.selectedIndex].text; 
    document.getElementById("cityName").innerHTML = cityNameAr;
    // Call API to get prayer times for the selected city
    axios.get(`https://api.aladhan.com/v1/timingsByCity?city=${citySelected}&country=Saudi Arabia`)
    .then((response)=>{
        let pTime = response.data;
        let timings = pTime.data.timings;
        let prayertimes = document.getElementById("prayertimes");
        prayertimes.innerHTML = "";
        // Render the prayer times list with respective icons
        prayertimes.innerHTML = `
        <li><span class="prayer-name"><i class="fa-solid fa-cloud-sun"></i> الفجر</span> <span class="prayer-time">${timings.Fajr}</span></li>
        <li><span class="prayer-name"><i class="fa-solid fa-sun"></i> الشروق</span> <span class="prayer-time">${timings.Sunrise}</span></li>
        <li><span class="prayer-name"><i class="fa-solid fa-cloud-sun-rain"></i> الظهر</span> <span class="prayer-time">${timings.Dhuhr}</span></li>
        <li><span class="prayer-name"><i class="fa-solid fa-sun"></i> العصر</span> <span class="prayer-time">${timings.Asr}</span></li>
        <li><span class="prayer-name"><i class="fa-solid fa-moon"></i> المغرب</span> <span class="prayer-time">${timings.Maghrib}</span></li>
        <li><span class="prayer-name"><i class="fa-solid fa-star-and-crescent"></i> العشاء</span> <span class="prayer-time">${timings.Isha}</span></li>
        `;
        // Extract Hijri date details from the response
        const hijri = response.data.data.date.hijri;
        const weekDayAr = hijri.weekday.ar; 
        const dayNum = hijri.day;
        const monthAr = hijri.month.ar;
        const yearNum = hijri.year; 
        // Calculate current time in minutes to determine the next prayer
        const now = new Date();
        const currentMins = now.getHours() * 60 + now.getMinutes();

        // Convert prayer times to minutes for comparison
        const times = [
            toMins(timings.Fajr), toMins(timings.Sunrise), toMins(timings.Dhuhr),
            toMins(timings.Asr), toMins(timings.Maghrib), toMins(timings.Isha)
        ];

    // Helper function to convert time string (HH:MM) to total minutes
    function toMins(t) { const [h, m] = t.split(':').map(Number); return h * 60 + m; }

    // Find the index of the upcoming prayer
    let nextIndex = times.findIndex(t => t > currentMins);
    if (nextIndex === -1) nextIndex = 0; 

    // Highlight the next prayer item in the UI
    const items = document.querySelectorAll("#prayertimes li");
    if (items[nextIndex]) items[nextIndex].classList.add("next-prayer");
    // Display the formatted Hijri date
    document.getElementById("daydate").innerHTML = `${weekDayAr}، ${dayNum} ${monthAr} ${yearNum} هـ`;

    }).catch((error)=>{
        alert("error");
    });
    }
// Automatically trigger function for the default selected city on load
getCityName();