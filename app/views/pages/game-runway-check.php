<section class="js-game-step" data-game="runway-check">
  <h2>Runway check</h2>
  <p class="lede">
    Each round gives cash, monthly spend, and monthly revenue. Pick the net burn, the months of runway,
    then when to start a raise that takes about six months.
  </p>
  <noscript><p>SAMPLE: $240k cash, $35k spend, $15k revenue → $20k net burn → 12 months → start the raise in 6.</p></noscript>
  <p class="coach-message figure js-step-prompt" aria-live="polite"></p>
  <p class="js-step-info"></p>
  <p class="coach-message js-step-status"></p>
  <p class="eyebrow js-step-label"></p>
  <p class="coach-controls js-step-choices"></p>
  <p class="coach-wrong coach-panel js-step-miss" hidden aria-live="polite"></p>
  <p class="coach-success coach-panel js-step-win" hidden aria-live="polite"></p>
  <p class="coach-controls">
    <button type="button" class="js-step-next" hidden>Next company</button>
    <button type="button" class="js-step-reset">New numbers</button>
  </p>
  <p class="js-step-tally"></p>
  <?= resource_tagger('game:runway-check', true) ?>
  <p>
    <?= lesson_link('cfo-runway', 'Related guide') ?>
    ·
    <a href="<?= e(url('/games')) ?>">All games</a>
  </p>
</section>
