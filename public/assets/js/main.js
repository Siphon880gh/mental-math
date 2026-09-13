import { initCase } from "./case.js";
import { initCoach } from "./coach.js";
import { initDashboard } from "./dashboard.js";
import { initDrill } from "./drill.js";
import { initGames } from "./games.js";
import { initNav } from "./nav.js";
import { initPassTags } from "./pass-tags.js";
import { applyDocumentClasses } from "./progress.js";
import { initPeek } from "./session-peek.js";
import { initScenario } from "./scenario.js";

applyDocumentClasses();
initNav();
initPeek();
initPassTags();

const page = document.querySelector("[data-page]")?.dataset.page;
if (page === "home") initDashboard();
if (page === "coach") initCoach();
if (page === "drill") initDrill();
if (page === "case") initCase();
if (page === "scenario") initScenario();
if (page === "game") initGames();
