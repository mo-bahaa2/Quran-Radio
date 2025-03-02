document.addEventListener('DOMContentLoaded', function () {
    const sheikhList = document.getElementById('sheikh-list');
    const sheikhDetails = document.getElementById('sheikh-details');
    const sheikhImage = document.getElementById('sheikh-image');
    const sheikhAudio = document.getElementById('sheikh-audio');
    const starsContainer = document.getElementById('stars-container');
    const moonContainer = document.getElementById('moon-container');
    const prayerTimesList = document.getElementById('prayer-times-list');

    // إنشاء النجوم
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

    // إضافة الهلال
    function addMoon() {
        const moon = document.createElement('img');
        moon.src = './pngtree-ramadan-lantern-cartoon-colored-clipart-colorful-cartoon-mubarak-vector-png-image_12912463-removebg-preview.png'; // تأكد من وجود صورة الهلال في مجلد المشروع
        moon.alt = 'هلال رمضان';
        moonContainer.appendChild(moon);
    }

    createStars();
    addMoon();

    // جلب بيانات الشيوخ من الـ API
    fetch('https://data-rosy.vercel.app/radio.json')
        .then(response => response.json())
        .then(data => {
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
            console.error('Error fetching sheikhs:', error);
            sheikhList.innerHTML = '<p>تعذر تحميل بيانات الشيوخ</p>';
        });

    // جلب آية قرآنية عشوائية
    fetch('https://api.alquran.cloud/v1/ayah/random/ar.asad')
        .then(response => response.json())
        .then(data => {
            const ayah = data.data.text;
            document.getElementById('random-ayah').textContent = ayah;
        })
        .catch(error => {
            console.error('Error fetching random ayah:', error);
        });

    // جلب مواعيد الأذان
    fetch('https://api.aladhan.com/v1/timingsByCity/02-03-2025?city=cairo&country=egypt&method=8')
        .then(response => response.json())
        .then(data => {
            const timings = data.data.timings;
            const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

            prayers.forEach(prayer => {
                const li = document.createElement('li');
                li.textContent = `${prayer}: ${timings[prayer]}`;
                prayerTimesList.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Error fetching prayer times:', error);
            prayerTimesList.innerHTML = '<p>تعذر تحميل مواعيد الأذان</p>';
        });
});