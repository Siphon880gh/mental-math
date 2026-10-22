<section class="js-game-eleven">
  <h2>Eleven neighbors</h2>
  <p class="lede">SAMPLE: 347 × 11. Fill each slot: first digit, neighbor sums, last digit. Then carry.</p>
  <p class="coach-message js-eleven-slots">_ | _ | _ | _</p>
  <p class="coach-controls">
    <button type="button" data-slot="0" data-value="3">First digit: 3</button>
    <button type="button" data-slot="1" data-value="7">3 + 4</button>
    <button type="button" data-slot="2" data-value="11">4 + 7</button>
    <button type="button" data-slot="3" data-value="7">Last digit: 7</button>
    <button type="button" class="js-eleven-carry" disabled>Carry the 1</button>
    <button type="button" class="js-eleven-reset">Reset</button>
  </p>
  <p class="coach-success coach-panel js-eleven-win" hidden>3 | 7 | 11 | 7 → carry → 3,817.</p>
  <?= resource_tagger('game:eleven-neighbors', true) ?>
  <p>
    <?= lesson_link('fixed-multipliers', 'Related guide') ?>
    ·
    <a href="<?= e(url('/games')) ?>">All games</a>
  </p>
</section>
