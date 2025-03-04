document.addEventListener('DOMContentLoaded', function () {
    const sheikhList = document.getElementById('sheikh-list');
    const sheikhDetails = document.getElementById('sheikh-details');
    const sheikhImage = document.getElementById('sheikh-image');
    const sheikhAudio = document.getElementById('sheikh-audio');
    const starsContainer = document.getElementById('stars-container');
    const moonContainer = document.getElementById('moon-container');
    const prayerTimesList = document.getElementById('prayer-times-list');

    function createStars() {
        const numStars = 100;
        for (let i = 0; i < numStars; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.top = `${Math.random() * 100}%`;
            star.style.left = `${Math.random() * 100}%`;
            star.style.animationDelay = `${Math.random() * 2}s`;
            starsContainer.appendChild(star);
        }
    }

    function addMoon() {
        const moon = document.createElement('img');
        moon.src = './images-removebg-preview.png';
        moon.alt = 'هلال رمضان';
        moonContainer.appendChild(moon);
    }

    function showLoadingMessage() {
        const loadingMessage = document.createElement('p');
        loadingMessage.textContent = 'جاري التحميل...';
        loadingMessage.style.color = '#FFF0D9';
        sheikhList.appendChild(loadingMessage);
    }

    function hideLoadingMessage() {
        const loadingMessage = sheikhList.querySelector('p');
        if (loadingMessage) {
            loadingMessage.remove();
        }
    }

    createStars();
    addMoon();

    fetch('https://data-rosy.vercel.app/radio.json')
        .then(response => response.json())
        .then(data => {
            hideLoadingMessage();
            if (data.radios && Array.isArray(data.radios)) {
                data.radios.forEach(sheikh => {
                    const sheikhItem = document.createElement('div');
                    sheikhItem.className = 'sheikh-item';
                    sheikhItem.textContent = sheikh.name;
                    sheikhItem.addEventListener('click', () => {
                        sheikhImage.src = sheikh.img;
                        sheikhAudio.src = sheikh.url;
                        sheikhDetails.style.display = 'block';
                        sheikhAudio.play();
                    });
                    sheikhList.appendChild(sheikhItem);
                });
            } else {
                console.error('Expected an array inside "radios" but got:', data);
            }
        })
        .catch(error => {
            hideLoadingMessage();
            console.error('Error fetching sheikhs:', error);
            sheikhList.innerHTML = '<p style="color: #FF0000;">تعذر تحميل بيانات الشيوخ</p>';
        });

    fetch('https://api.alquran.cloud/v1/ayah/random/ar.asad')
        .then(response => response.json())
        .then(data => {
            const ayah = data.data.text;
            document.getElementById('random-ayah').textContent = ayah;
        })
        .catch(error => {
            console.error('Error fetching random ayah:', error);
        });

    function convertTo12HourFormat(time) {
        const [hour, minute] = time.split(':');
        let period = 'ص';
        let formattedHour = parseInt(hour);
        if (formattedHour >= 12) {
            period = 'م';
            if (formattedHour > 12) formattedHour -= 12;
        }
        return `${formattedHour}:${minute} ${period}`;
    }

    function fetchPrayerTimes() {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();

        const apiUrl = `https://api.aladhan.com/v1/timingsByCity/${day}-${month}-${year}?city=cairo&country=egypt&method=8`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const timings = data.data.timings;
                const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
                
                prayerTimesList.innerHTML = '';

                prayers.forEach(prayer => {
                    const li = document.createElement('li');
                    li.textContent = `${prayer}: ${convertTo12HourFormat(timings[prayer])}`;
                    prayerTimesList.appendChild(li);
                });
            })
            .catch(error => {
                console.error('Error fetching prayer times:', error);
                prayerTimesList.innerHTML = '<p>تعذر تحميل مواعيد الأذان</p>';
            });
    }

    fetchPrayerTimes();
    setInterval(fetchPrayerTimes, 86400000);
});