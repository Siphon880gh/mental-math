<?php

use Reflex\Catalog\PassTags;
use Reflex\Catalog\Tracks;

/** @var string $content */
/** @var string $page */
/** @var ?string $activeTrack */
/** @var ?string $section */

$caption = $activeTrack ? Tracks::LABEL[$activeTrack] : "\u{00A0}";
?>
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mental Math Trainer</title>
    <link rel="stylesheet" href="<?= e(url('/assets/css/app.css')) ?>" />
    <script>
      (function () {
        try {
          var peek = sessionStorage.getItem("reflex_core_session_peek_v1") === "1";
          if (peek) document.documentElement.classList.add("peek-on");
            var raw = localStorage.getItem("reflex_core_progress_v1");
          var parsed = raw ? JSON.parse(raw) : null;
          var milestones = (parsed && parsed.milestones) || {
            "E4.M1": "active",
            "E4.M2": "locked",
            "E4.M3": "locked",
            "E4.M0": "locked",
            "E5.M2": "locked",
            "op-feasibility": "active",
            "op-unit-econ": "locked",
            "op-runway": "locked",
            "op-growth": "locked",
          };
          if ((milestones["E4.M0"] || "") === "complete") {
            document.documentElement.classList.add("cases-unlocked");
          }
          Object.keys(milestones).forEach(function (id) {
            if (milestones[id] && milestones[id] !== "locked") {
              document.documentElement.classList.add("ms-" + id.replace(/\./g, "-") + "-open");
            }
          });
          window.__reflexBoot = { peek: peek, milestones: milestones, parsed: parsed };
          window.__reflexBase = <?= json_encode(app_base(), JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES) ?>;
        } catch (err) {
          window.__reflexBoot = { peek: false, milestones: { "E4.M1": "active" }, parsed: null };
          window.__reflexBase = <?= json_encode(app_base(), JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES) ?>;
          document.documentElement.classList.add("ms-E4-M1-open");
        }
      })();
    </script>
  </head>
  <body>
    <div class="shell">
      <header class="masthead">
        <div class="app">
          <a href="<?= e(url('/')) ?>" class="brand">
            <p class="eyebrow">REFLEX_CORE</p>
            <h1>Mental Math Trainer</h1>
          </a>
          <p class="lede">
            Recognize number shapes, then calculate on the fly. Five minutes. No
            calculator.
          </p>
        </div>
      </header>
      <div class="site-nav__sentinel" aria-hidden="true"></div>
      <nav
        class="site-nav"
        aria-label="Primary"
        data-stuck="false"
        data-caption="<?= $activeTrack ? 'true' : 'false' ?>"
      >
        <div class="site-nav__inner">
          <ul class="site-nav__row">
            <li>
              <a href="<?= e(url('/track-a')) ?>" class="<?= $activeTrack === 'quick' ? 'is-current' : '' ?>" data-track="quick">Track A</a>
            </li>
            <li>
              <a href="<?= e(url('/track-b')) ?>" class="<?= $activeTrack === 'stakeholder' ? 'is-current' : '' ?>" data-track="stakeholder">Track B</a>
            </li>
            <li><a href="<?= e(url('/drills')) ?>">Drills</a></li>
            <li><a href="<?= e(url('/cases')) ?>">Cases</a></li>
            <li><a href="<?= e(url('/scenarios')) ?>">Scenarios</a></li>
            <li><a href="<?= e(url('/games')) ?>">Games</a></li>
          </ul>
          <p class="site-nav__caption" data-visible="<?= $activeTrack ? 'true' : 'false' ?>" aria-live="polite">
            <span class="site-nav__caption-text"><?= $activeTrack ? e(Tracks::LABEL[$activeTrack]) : '&nbsp;' ?></span>
          </p>
        </div>
      </nav>
      <main class="app app--body" data-page="<?= e($page) ?>"<?= !empty($section) ? ' data-section="' . e($section) . '"' : '' ?>>
        <?= $content ?>
      </main>
    </div>
    <?= json_script('pass-tags-catalog', PassTags::TAGS) ?>
    <?= json_script('track-labels', Tracks::LABEL) ?>
    <script type="module" src="<?= e(url('/assets/js/main.js')) ?>"></script>
  </body>
</html>
