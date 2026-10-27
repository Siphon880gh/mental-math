<section class="js-game-nearbase">
  <h2>Near-base gaps</h2>
  <p class="lede">
    Each round multiplies two numbers near 100 or 1,000: both below, both above,
    or one on each side. Pick the left part (cross), the right part (multiply
    the gaps), then put them together.
  </p>
  <noscript><p>SAMPLE: 97 × 94 → 97 − 6 = 91, 3 × 6 = 18 → 9,118.</p></noscript>
  <p class="coach-message figure js-nb-prompt" aria-live="polite"></p>
  <p class="js-nb-gaps"></p>
  <p class="coach-message js-nb-status"></p>
  <p class="eyebrow js-nb-step"></p>
  <p class="coach-controls js-nb-choices"></p>
  <p class="coach-wrong coach-panel js-nb-miss" hidden aria-live="polite"></p>
  <p class="coach-success coach-panel js-nb-win" hidden aria-live="polite"></p>
  <p class="coach-controls">
    <button type="button" class="js-nb-next" hidden>Next pair</button>
    <button type="button" class="js-nb-reset">New numbers, same shape</button>
  </p>
  <p class="js-nb-tally"></p>
  <?= resource_tagger('game:near-base-gaps', true) ?>
  <p>
    <?= lesson_link('near-base', 'Related guide') ?>
    ·
    <a href="<?= e(url('/games')) ?>">All games</a>
  </p>
</section>
