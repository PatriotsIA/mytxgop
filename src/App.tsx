import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

const CountyFinder = lazy(() => import("./routes/CountyFinder"));
const StatePage = lazy(() => import("./routes/StatePage"));
const CountyHome = lazy(() => import("./routes/CountyHome"));
const CountyAbout = lazy(() => import("./routes/CountyAbout"));
const CountyContact = lazy(() => import("./routes/CountyContact"));
const CountySubmitEvent = lazy(() => import("./routes/CountySubmitEvent"));
const CountySupportReport = lazy(() => import("./routes/CountySupportReport"));
const CountyWeather = lazy(() => import("./routes/CountyWeather"));
const CountyNews = lazy(() => import("./routes/CountyNews"));
const LegacyCountyRedirect = lazy(() => import("./routes/LegacyCountyRedirect"));
const NotFound = lazy(() => import("./routes/NotFound"));

function App() {
  return (
    <Suspense fallback={<div className="route-loading">Loading GOP Connect...</div>}>
      <Routes>
        <Route path="/" element={<CountyFinder />} />
        <Route path="/not-found" element={<NotFound />} />
        <Route path="/:countySlug/about" element={<LegacyCountyRedirect pageSlug="about" />} />
        <Route path="/:countySlug/contact-us" element={<LegacyCountyRedirect pageSlug="contact-us" />} />
        <Route path="/:countySlug/submit-event" element={<LegacyCountyRedirect pageSlug="submit-event" />} />
        <Route path="/:countySlug/support-report" element={<LegacyCountyRedirect pageSlug="support-report" />} />
        <Route path="/:countySlug/weather" element={<LegacyCountyRedirect pageSlug="weather" />} />
        <Route path="/:countySlug/local-news" element={<LegacyCountyRedirect pageSlug="local-news" />} />
        <Route path="/:countySlug/national-news" element={<LegacyCountyRedirect pageSlug="national-news" />} />
        <Route path="/:stateSlug" element={<StatePage />} />
        <Route path="/:stateSlug/:countySlug" element={<CountyHome />} />
        <Route path="/:stateSlug/:countySlug/about" element={<CountyAbout />} />
        <Route path="/:stateSlug/:countySlug/contact-us" element={<CountyContact />} />
        <Route path="/:stateSlug/:countySlug/submit-event" element={<CountySubmitEvent />} />
        <Route path="/:stateSlug/:countySlug/support-report" element={<CountySupportReport />} />
        <Route path="/:stateSlug/:countySlug/weather" element={<CountyWeather />} />
        <Route path="/:stateSlug/:countySlug/local-news" element={<CountyNews />} />
        <Route path="/:stateSlug/:countySlug/national-news" element={<CountyNews />} />
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
