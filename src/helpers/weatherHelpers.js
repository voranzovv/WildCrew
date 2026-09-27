// Get hour from time
const getHour = (time) => {
  const hour = time.split(":")[0];
  if (hour < 10) {
    return hour.split("")[1];
  }
  return hour;
};

// Get weather data
export const getWeather = async (lat, lng, startDate, time) => {
  console.log(getHour(time));
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=temperature_2m&start_date=${startDate}&end_date=${startDate}`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch weather data.");
  }

  const data = await response.json();

  return data.hourly.temperature_2m[getHour(time)];
};
