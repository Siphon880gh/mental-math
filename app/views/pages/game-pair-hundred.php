<section class="js-game-pairs">
  <h2>Pair to 100</h2>
  <p class="lede">SAMPLE: six invoices. Tap two that make 100, until all three pairs are found.</p>
  <p class="coach-message js-pair-status">Pairs found: 0 of 3</p>
  <p class="coach-controls">
    <?php foreach ([18, 72, 35, 82, 65, 28] as $n): ?>
      <button type="button" data-pair="<?= e((string) $n) ?>" aria-pressed="false"><?= e((string) $n) ?></button>
    <?php endforeach; ?>
    <button type="button" class="js-pair-reset">Reset</button>
  </p>
  <p class="coach-wrong coach-panel js-pair-miss" hidden></p>
  <p class="coach-success coach-panel js-pair-win" hidden>18+82, 72+28, 35+65 → three hundreds = 300.</p>
  <?= resource_tagger('game:pair-hundred', true) ?>
  <p>
    <?= lesson_link('complements', 'Related guide') ?>
    ·
    <a href="<?= e(url('/games')) ?>">All games</a>
  </p>
</section>
