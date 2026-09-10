import { Link, Navigate, Route, Routes } from "react-router-dom";
import CasePlayer from "./pages/CasePlayer";
import Cases from "./pages/Cases";
import CoachView from "./pages/CoachView";
import Dashboard from "./pages/Dashboard";
import DrillPlayer from "./pages/DrillPlayer";
import Drills from "./pages/Drills";
import GameHost from "./pages/GameHost";
import Games from "./pages/Games";
import GuideView from "./pages/GuideView";
import ScenarioPlayer from "./pages/ScenarioPlayer";
import Scenarios from "./pages/Scenarios";
import TrackGuides from "./pages/TrackGuides";
import { TRACK_NAV } from "./lib/tracks";

export default function App() {
  return (
    <div className="app">
      <header>
        <Link to="/" className="brand">
          <p className="eyebrow">REFLEX_CORE</p>
          <h1>Mental Math Trainer</h1>
        </Link>
        <p className="lede">
          Recognize number shapes, then calculate on the fly. Five minutes. No
          calculator.
        </p>
        <nav>
          <Link to={TRACK_NAV.quick.href}>{TRACK_NAV.quick.label}</Link>
          <Link to={TRACK_NAV.stakeholder.href}>{TRACK_NAV.stakeholder.label}</Link>
          <Link to="/drills">Drills</Link>
          <Link to="/cases">Cases</Link>
          <Link to="/scenarios">Scenarios</Link>
          <Link to="/games">Games</Link>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/archive" element={<Navigate to="/track-a" replace />} />
        <Route path="/guides" element={<Navigate to="/track-a" replace />} />
        <Route path="/track-a" element={<TrackGuides track="quick" />} />
        <Route path="/track-b" element={<TrackGuides track="stakeholder" />} />
        <Route path="/guides/:slug" element={<GuideView />} />
        <Route path="/coach/:slug" element={<CoachView />} />
        <Route path="/drills/:groupId" element={<DrillPlayer />} />
        <Route path="/drills" element={<Drills />} />
        <Route path="/cases/:caseId" element={<CasePlayer />} />
        <Route path="/cases" element={<Cases />} />
        <Route path="/scenarios/:scenarioId" element={<ScenarioPlayer />} />
        <Route path="/scenarios" element={<Scenarios />} />
        <Route path="/games/:slug" element={<GameHost />} />
        <Route path="/games" element={<Games />} />
      </Routes>
    </div>
  );
}
