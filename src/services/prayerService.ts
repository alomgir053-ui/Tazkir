import { PrayerTimes } from '../types/index.ts';

export interface CityLocation {
  name: string;
  bnName: string;
  lat: number;
  lng: number;
  timezoneOffset: number; // in hours
}

export const BD_CITIES: CityLocation[] = [
  { name: 'Dhaka', bnName: 'ঢাকা', lat: 23.8103, lng: 90.4125, timezoneOffset: 6 },
  { name: 'Chittagong', bnName: 'চট্টগ্রাম', lat: 22.3569, lng: 91.7832, timezoneOffset: 6 },
  { name: 'Sylhet', bnName: 'সিলেট', lat: 24.8949, lng: 91.8687, timezoneOffset: 6 },
  { name: 'Rajshahi', bnName: 'রাজশাহী', lat: 24.3745, lng: 88.6042, timezoneOffset: 6 },
  { name: 'Khulna', bnName: 'খুলনা', lat: 22.8456, lng: 89.5403, timezoneOffset: 6 },
  { name: 'Barisal', bnName: 'বরিশাল', lat: 22.7010, lng: 90.3535, timezoneOffset: 6 },
  { name: 'Rangpur', bnName: 'রংপুর', lat: 25.7439, lng: 89.2752, timezoneOffset: 6 },
  { name: 'Mymensingh', bnName: 'ময়মনসিংহ', lat: 24.7471, lng: 90.4203, timezoneOffset: 6 },
];

export function getCalculatedPrayerTimes(city: CityLocation = BD_CITIES[0]): PrayerTimes {
  const now = new Date();
  
  // Base astronomical timing offsets for BD (Hanafi / Islamic Foundation standard)
  const fajrHour = 5;
  const fajrMin = 15 + Math.round((90.4125 - city.lng) * 4);
  
  const sunriseHour = 6;
  const sunriseMin = 30 + Math.round((90.4125 - city.lng) * 4);

  const dhuhrHour = 12;
  const dhuhrMin = 10 + Math.round((90.4125 - city.lng) * 4);

  const asrHour = 15;
  const asrMin = 45 + Math.round((90.4125 - city.lng) * 4);

  const maghribHour = 18;
  const maghribMin = 10 + Math.round((90.4125 - city.lng) * 4);

  const ishaHour = 19;
  const ishaMin = 25 + Math.round((90.4125 - city.lng) * 4);

  const formatTime = (h: number, m: number) => {
    let normalizedM = m;
    let normalizedH = h;
    while (normalizedM >= 60) {
      normalizedM -= 60;
      normalizedH += 1;
    }
    while (normalizedM < 0) {
      normalizedM += 60;
      normalizedH -= 1;
    }
    const period = normalizedH >= 12 ? 'PM' : 'AM';
    const displayH = normalizedH % 12 === 0 ? 12 : normalizedH % 12;
    const displayM = normalizedM < 10 ? `0${normalizedM}` : `${normalizedM}`;
    return `${displayH}:${displayM} ${period}`;
  };

  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const prayerSchedule = [
    { name: 'ফজর', hour: fajrHour, min: fajrMin },
    { name: 'যোহর', hour: dhuhrHour, min: dhuhrMin },
    { name: 'আসর', hour: asrHour, min: asrMin },
    { name: 'মাগরিব', hour: maghribHour, min: maghribMin },
    { name: 'এশা', hour: ishaHour, min: ishaMin },
  ];

  let upcomingPrayer = 'ফজর';
  let diffMinutes = 0;

  for (const p of prayerSchedule) {
    const pMinutes = p.hour * 60 + p.min;
    if (pMinutes > currentMinutes) {
      upcomingPrayer = p.name;
      diffMinutes = pMinutes - currentMinutes;
      break;
    }
  }

  if (diffMinutes === 0) {
    // Tomorrow's Fajr
    upcomingPrayer = 'ফজর';
    const tomorrowFajrMinutes = 24 * 60 + (fajrHour * 60 + fajrMin);
    diffMinutes = tomorrowFajrMinutes - currentMinutes;
  }

  const hoursLeft = Math.floor(diffMinutes / 60);
  const minsLeft = diffMinutes % 60;
  const timeRemaining = hoursLeft > 0 ? `${hoursLeft} ঘণ্টা ${minsLeft} মিনিট বাকি` : `${minsLeft} মিনিট বাকি`;

  return {
    fajr: formatTime(fajrHour, fajrMin),
    sunrise: formatTime(sunriseHour, sunriseMin),
    dhuhr: formatTime(dhuhrHour, dhuhrMin),
    asr: formatTime(asrHour, asrMin),
    maghrib: formatTime(maghribHour, maghribMin),
    isha: formatTime(ishaHour, ishaMin),
    hijriDate: '২৭ সফর ১৪৪৮ হিজরি',
    upcomingPrayer,
    timeRemaining,
  };
}
