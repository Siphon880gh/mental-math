<section class="js-game-pairs">
  <h2>Pair to 100</h2>
  <p class="lede">SAMPLE: six invoices. Tap two that make 100, until all three pairs are found. Each set is new.</p>
  <noscript><p>SAMPLE: 18 + 82, 72 + 28, 35 + 65 → three hundreds = 300.</p></noscript>
  <p class="coach-message js-pair-status" aria-live="polite">Pairs found: 0 of 3</p>
  <p class="coach-controls js-pair-tiles"></p>
  <p class="coach-wrong coach-panel js-pair-miss" hidden aria-live="polite"></p>
  <p class="coach-success coach-panel js-pair-win" hidden aria-live="polite"></p>
  <p class="coach-controls">
    <button type="button" class="js-pair-next" hidden>Next set</button>
    <button type="button" class="js-pair-reset">Start this set over</button>
  </p>
  <?= resource_tagger('game:pair-hundred', true) ?>
  <p>
    <?= lesson_link('complements', 'Related guide') ?>
    ·
    <a href="<?= e(url('/games')) ?>">All games</a>
  </p>
</section>
