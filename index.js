// عرض الآية اليومية
fetch('https://api.alquran.cloud/v1/ayah/random/ar.asad')
  .then(res => res.json())
  .then(data => {
    document.getElementById('daily-message').textContent = `"${data.data.text}" - ${data.data.surah.name} آية ${data.data.numberInSurah}`;
  });

// أسماء الصلوات بالعربية
const arabicNames = {
  Fajr: "الفجر",
  Sunrise: "الشروق",
  Dhuhr: "الظهر",
  Asr: "العصر",
  Sunset: "الغروب",
  Maghrib: "المغرب",
  Isha: "العشاء",
  Imsak: "الإمساك",
  Midnight: "منتصف الليل"
};

// تحويل الوقت إلى 12 ساعة بالعربية
function convertTo12Hour(timeStr) {
  const [hourStr, minute] = timeStr.split(':');
  let hour = parseInt(hourStr, 10);
  const period = hour >= 12 ? 'م' : 'ص';
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${period}`;
}

// تحميل مواقيت الصلاة
function loadPrayerTimes() {
  const now = new Date();
  const day = now.getDate().toString().padStart(2, '0');
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const year = now.getFullYear();

  fetch(`https://api.aladhan.com/v1/timingsByCity/${day}-${month}-${year}?city=cairo&country=egypt&method=8`)
    .then(res => res.json())
    .then(data => {
      const timings = data.data.timings;
      const prayerList = document.getElementById('prayer-times-list');
      prayerList.innerHTML = '';

      Object.keys(timings).forEach(key => {
        if (arabicNames[key]) {
          const li = document.createElement('li');
          li.textContent = `${arabicNames[key]}: ${convertTo12Hour(timings[key])}`;
          prayerList.appendChild(li);
        }
      });
    });
}

// تشغيل عند التحميل
loadPrayerTimes();


// التحديث كل 12 ساعة
setInterval(loadPrayerTimes, 43200000); // 12 ساعة = 43200000ms

// تحميل قائمة الإذاعات مع التحكم في التشغيل
let currentAudio = null;

fetch('https://data-rosy.vercel.app/radio.json')
  .then(res => res.json())
  .then(data => {
    const radioList = document.getElementById('radio-list');
    radioList.innerHTML = '';

    data.radios.forEach(radio => {
      const card = document.createElement('div');
      card.className = 'sheikh-item';
      card.style.setProperty('--radio-image', `url('${radio.img}')`);
      card.innerHTML = `<h4>${radio.name}</h4>`;

      card.style.backgroundImage = `linear-gradient(rgba(232, 216, 195, 0.9), rgba(232, 216, 195, 0.8)), url('${radio.img}')`;
      card.style.backgroundSize = 'cover';
      card.style.backgroundPosition = 'center';

      card.addEventListener('click', () => {
        if (currentAudio) {
          currentAudio.pause();
          currentAudio = null;
        }

        const audio = new Audio(radio.url);
        audio.play();
        currentAudio = audio;
      });

      radioList.appendChild(card);
    });
  });
