import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

const CountyFinder = lazy(() => import("./routes/CountyFinder"));
const CountyHome = lazy(() => import("./routes/CountyHome"));
const CountyAbout = lazy(() => import("./routes/CountyAbout"));
const CountyContact = lazy(() => import("./routes/CountyContact"));
const CountySubmitEvent = lazy(() => import("./routes/CountySubmitEvent"));
const CountyWeather = lazy(() => import("./routes/CountyWeather"));
const CountyNews = lazy(() => import("./routes/CountyNews"));
const NotFound = lazy(() => import("./routes/NotFound"));

function App() {
  return (
    <Suspense fallback={<div className="route-loading">Loading My Texas GOP...</div>}>
      <Routes>
        <Route path="/" element={<CountyFinder />} />
        <Route path="/not-found" element={<NotFound />} />
        <Route path="/:countySlug" element={<CountyHome />} />
        <Route path="/:countySlug/about" element={<CountyAbout />} />
        <Route path="/:countySlug/contact-us" element={<CountyContact />} />
        <Route path="/:countySlug/submit-event" element={<CountySubmitEvent />} />
        <Route path="/:countySlug/weather" element={<CountyWeather />} />
        <Route path="/:countySlug/local-news" element={<CountyNews />} />
        <Route path="/:countySlug/national-news" element={<CountyNews />} />
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
