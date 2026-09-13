<section class="js-game-swap">
  <h2>Percent swap</h2>
  <p class="lede">SAMPLE: 14% of 50. Swap to the easy half.</p>
  <p class="coach-message js-swap-msg">14% of 50</p>
  <p class="coach-controls">
    <button type="button" class="js-swap">Swap A% of B</button>
    <button type="button" class="js-half" disabled>Take 50%</button>
    <button type="button" class="js-swap-reset">Reset</button>
  </p>
  <p class="coach-success coach-panel js-swap-win" hidden>14% of 50 is 50% of 14 → 7.</p>
  <?= resource_tagger('game:percent-swap', true) ?>
  <p>
    <?= lesson_link('percent-reversible', 'Related guide') ?>
    ·
    <a href="<?= e(url('/games')) ?>">All games</a>
  </p>
</section>
