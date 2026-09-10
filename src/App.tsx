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
import SiteNav from "./components/SiteNav";

export default function App() {
  return (
    <div className="shell">
      <header className="masthead">
        <div className="app">
          <Link to="/" className="brand">
            <p className="eyebrow">REFLEX_CORE</p>
            <h1>Mental Math Trainer</h1>
          </Link>
          <p className="lede">
            Recognize number shapes, then calculate on the fly. Five minutes. No
            calculator.
          </p>
        </div>
      </header>
      <SiteNav />
      <main className="app app--body">
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
      </main>
    </div>
  );
}
