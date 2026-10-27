<section class="js-game-eleven">
  <h2>Eleven neighbors</h2>
  <p class="lede">
    Each round is a new 2- or 3-digit number × 11. Fill each slot: first digit,
    neighbor sums, last digit. Then carry any 10 one place left.
  </p>
  <noscript><p>SAMPLE: 347 × 11 → 3 | 7 | 11 | 7 → carry → 3,817.</p></noscript>
  <p class="coach-message figure js-eleven-prompt" aria-live="polite"></p>
  <p class="coach-message figure figure--slots js-eleven-slots"></p>
  <p class="eyebrow js-eleven-step"></p>
  <p class="coach-controls js-eleven-choices"></p>
  <p class="coach-wrong coach-panel js-eleven-miss" hidden aria-live="polite"></p>
  <p class="coach-success coach-panel js-eleven-win" hidden aria-live="polite"></p>
  <p class="coach-controls">
    <button type="button" class="js-eleven-next" hidden>Next number</button>
    <button type="button" class="js-eleven-reset">New number, same shape</button>
  </p>
  <p class="js-eleven-tally"></p>
  <?= resource_tagger('game:eleven-neighbors', true) ?>
  <p>
    <?= lesson_link('fixed-multipliers', 'Related guide') ?>
    ·
    <a href="<?= e(url('/games')) ?>">All games</a>
  </p>
</section>
