document.addEventListener('DOMContentLoaded', function () {
  const sheikhList = document.getElementById('sheikh-list');
  const sheikhDetails = document.getElementById('sheikh-details');
  const sheikhImage = document.getElementById('sheikh-image');
  const sheikhAudio = document.getElementById('sheikh-audio');
  const prayerTimesList = document.getElementById('prayer-times-list');

  // Toggle sections
  document.getElementById("show-prayers").addEventListener("click", () => {
    document.getElementById("prayer-times").style.display = "block";
    document.getElementById("radio-section").style.display = "none";
    setActiveButton("show-prayers");
  });

  document.getElementById("show-radios").addEventListener("click", () => {
    document.getElementById("prayer-times").style.display = "none";
    document.getElementById("radio-section").style.display = "block";
    setActiveButton("show-radios");
  });

  function setActiveButton(id) {
    document.querySelectorAll(".nav-buttons button").forEach(btn => btn.classList.remove("active"));
    document.getElementById(id).classList.add("active");
  }

  // Fetch radio data
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
            document.getElementById('sheikh-name').textContent = sheikh.name;
            sheikhDetails.style.display = 'block';
            sheikhAudio.play();
          });
          sheikhList.appendChild(sheikhItem);
        });
      }
    })
    .catch(error => {
      sheikhList.innerHTML = '<p style="color: red;">تعذر تحميل الإذاعات</p>';
    });

  // Fetch random ayah
  fetch('https://api.alquran.cloud/v1/ayah/random/ar.asad')
    .then(response => response.json())
    .then(data => {
      const ayah = data.data.text;
      document.getElementById('random-ayah').textContent = ayah;
    })
    .catch(error => {
      console.error('Error fetching ayah:', error);
    });

  // Convert time to Arabic 12-hour format
  function convertToArabicTime(time) {
    const [hourStr, minute] = time.split(':');
    let hour = parseInt(hourStr);
    let period = 'ص';

    if (hour >= 12) {
      period = 'م';
      if (hour > 12) hour -= 12;
    }
    if (hour === 0) hour = 12;

    return `${hour}:${minute} ${period}`;
  }

  // Fetch prayer times
  function fetchPrayerTimes() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();

    const apiUrl = `https://api.aladhan.com/v1/timingsByCity/${day}-${month}-${year}?city=cairo&country=egypt&method=8`;

    const prayerNames = {
      Fajr: 'الفجر',
      Imsak: 'الإمساك',
      Dhuhr: 'الظهر',
      Asr: 'العصر',
      Maghrib: 'المغرب',
      Isha: 'العشاء'
    };

    const prayerKeys = ['Fajr', 'Imsak', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        const timings = data.data.timings;
        prayerTimesList.innerHTML = '';
        prayerKeys.forEach(key => {
          const li = document.createElement('li');
          li.textContent = `${prayerNames[key]}: ${convertToArabicTime(timings[key])}`;
          prayerTimesList.appendChild(li);
        });
      })
      .catch(error => {
        prayerTimesList.innerHTML = '<p>تعذر تحميل مواعيد الصلاة</p>';
      });
  }

  fetchPrayerTimes();
  setInterval(fetchPrayerTimes, 86400000); // تحديث كل يوم
});
