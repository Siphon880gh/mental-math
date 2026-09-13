<section class="js-game-chips">
  <h2>Percent chips</h2>
  <p class="lede">SAMPLE: build 35% of 2,000. Chips are 50 / 25 / 10 / 5.</p>
  <p class="js-chip-status">Chips: 0% → 0</p>
  <p class="coach-controls">
    <button type="button" data-chip="50">+50%</button>
    <button type="button" data-chip="25">+25%</button>
    <button type="button" data-chip="10">+10%</button>
    <button type="button" data-chip="5">+5%</button>
    <button type="button" class="js-chip-reset">Reset</button>
  </p>
  <p class="coach-success coach-panel js-chip-win" hidden>35% of 2,000 = 700. Three tenths plus 5%.</p>
  <?= resource_tagger('game:percent-chips', true) ?>
  <p>
    <?= lesson_link('percent-chunks', 'Related guide') ?>
    ·
    <a href="<?= e(url('/games')) ?>">All games</a>
  </p>
</section>
