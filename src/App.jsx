import { useEffect, useState } from "react";

export default function App() {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [weather, setWeather] = useState(null);
  const [bestTravel, setBestTravel] = useState(null);

  console.log("Countries array:", countries);

  useEffect(() => {
    async function fetchCountries() {
      try {
        const res = await fetch(
          `https://restcountries.com/v3.1/all?fields=name,capital,flags,population,region,cca3`
        );
        const data = await res.json();
        setCountries(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Countries fetch failed", e);
        setCountries([]);
      }
    }
    fetchCountries();
  }, []);

  useEffect(() => {
    async function fetchWeather() {
      if (!selected || !selected.capital?.[0]) return;
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${selected.capital[0]}&units=metric&appid=054343e1e21a559db0b46e4fe5df6574`
        );
        const data = await res.json();
        const temp = data?.main?.temp ?? null;
        setWeather(temp);

        if (temp !== null) {
          if (temp >= 20 && temp <= 28)
            setBestTravel("Perfect weather to explore this country! 🌞");
          else if (temp < 20)
            setBestTravel("A bit cool now, consider visiting later in the year ❄️");
          else
            setBestTravel("It’s quite hot now, maybe plan for cooler months 🔥");
        } else {
          setBestTravel("Check local weather for the best travel time 🌍");
        }
      } catch (e) {
        console.error("Weather fetch failed", e);
        setWeather(null);
        setBestTravel(null);
      }
    }

    fetchWeather();
  }, [selected]);

  const filteredCountries = countries.filter((c) =>
    c.name?.common?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6">
      <h1 className="text-4xl font-bold text-center text-blue-900 mt-12 mb-6">
        🌎 Explore the World 🌎
      </h1>

      <div className="w-full flex justify-center mb-6">
        <form onSubmit={(e) => e.preventDefault()} className="w-full max-w-md">
          <input
            type="text"
            placeholder="Type a country to explore..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-3 border rounded-lg w-full text-center text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white shadow"
          />
        </form>
      </div>

      {search && !selected && filteredCountries.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-5xl justify-items-center mx-auto">
          {filteredCountries.map((country) => (
            <div
              key={country.cca3}
              className="border rounded-lg p-4 flex flex-col items-center shadow hover:shadow-xl transition-all duration-200 cursor-pointer bg-white w-40 text-center"
              onClick={() => setSelected(country)}
            >
              {country.flags?.svg && (
                <img
                  src={country.flags.svg}
                  alt={country.name?.common}
                  className="object-cover mb-2 rounded shadow-sm"
                  style={{ width: '256px', height: '192px' }}
                />
              )}
              <h2 className="font-semibold text-center text-lg">{country.name?.common}</h2>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="mt-6 p-6 border rounded-2xl shadow-2xl bg-white w-full max-w-md text-center animate-fadeIn">
          <h2 className="text-3xl font-bold">{selected.name?.common}</h2>
          <p className="mt-2">🏛️ Capital: {selected.capital?.[0] || "N/A"}</p>
          <p>👥 Population: {selected.population?.toLocaleString() || "N/A"}</p>
          <p>🌍 Region: {selected.region || "N/A"}</p>

          {weather !== null ? (
            <>
              <p>🌡️ Current Temp in {selected.capital[0]}: {weather}°C</p>
              <p>✈️ Travel Tip: {bestTravel}</p>
            </>
          ) : (
            <p>No weather data available</p>
          )}

          <button
            className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            onClick={() => {
              setSelected(null);
              setWeather(null);
              setBestTravel(null);
              setSearch("");
            }}
          >
            Back to Search
          </button>
        </div>
      )}

      {search && !selected && filteredCountries.length === 0 && (
        <p className="text-center mt-4 text-gray-500">No countries match your search 😢</p>
      )}
    </div>
  );
}
