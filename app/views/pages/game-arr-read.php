<section class="js-game-step" data-game="arr-read">
  <h2>ARR read</h2>
  <p class="lede">
    Each round gives seats, a monthly price, and a one-time setup fee. Pick the MRR (fee out), the ARR,
    then a percent of ARR for a budget line.
  </p>
  <noscript><p>SAMPLE: 120 seats at $40/mo and a $1,000 setup fee → MRR $4,800 → ARR $57,600 → 10% = $5,760.</p></noscript>
  <p class="coach-message figure js-step-prompt" aria-live="polite"></p>
  <p class="js-step-info"></p>
  <p class="coach-message js-step-status"></p>
  <p class="eyebrow js-step-label"></p>
  <p class="coach-controls js-step-choices"></p>
  <p class="coach-wrong coach-panel js-step-miss" hidden aria-live="polite"></p>
  <p class="coach-success coach-panel js-step-win" hidden aria-live="polite"></p>
  <p class="coach-controls">
    <button type="button" class="js-step-next" hidden>Next deal</button>
    <button type="button" class="js-step-reset">New numbers</button>
  </p>
  <p class="js-step-tally"></p>
  <?= resource_tagger('game:arr-read', true) ?>
  <p>
    <?= lesson_link('mrr-arr', 'Related guide') ?>
    ·
    <a href="<?= e(url('/games')) ?>">All games</a>
  </p>
</section>
