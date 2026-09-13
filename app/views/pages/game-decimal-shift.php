<section class="js-game-decimal">
  <h2>Decimal shifter</h2>
  <p class="lede">SAMPLE: start at 8,500. 10% is one place left. 1% is two.</p>
  <p class="coach-message js-shift-value" style="font-size: 2rem">8500</p>
  <p class="coach-controls">
    <button type="button" class="js-shift-left">Shift left</button>
    <button type="button" class="js-shift-right">Shift right</button>
    <button type="button" class="js-shift-reset">Reset</button>
  </p>
  <p class="coach-success coach-panel js-win-10" hidden>10% of 8,500 is 850. One more left for 1%.</p>
  <p class="coach-success coach-panel js-win-1" hidden>1% of 8,500 is 85. Two places left.</p>
  <?= resource_tagger('game:decimal-shift', true) ?>
  <p>
    <?= lesson_link('percent-shift', 'Related guide') ?>
    ·
    <a href="<?= e(url('/games')) ?>">All games</a>
  </p>
</section>
