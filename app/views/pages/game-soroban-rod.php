<?php

use Reflex\Soroban;

?>
<section class="js-game-soroban">
  <h2>Soroban rod</h2>
  <p class="lede">
    Two rods: tens and ones. Each add asks which bead move does it: push beads
    straight on, the five-complement (+5, take some back), or the ten-complement
    (carry one, take some back).
  </p>
  <div class="js-soroban-board"><?= Soroban::html('47') ?></div>
  <p class="coach-message js-soroban-prompt" style="font-size: 2rem"></p>
  <p class="coach-controls js-soroban-choices"></p>
  <p class="coach-wrong coach-panel js-soroban-miss" hidden aria-live="polite"></p>
  <p class="coach-success coach-panel js-soroban-ok" hidden aria-live="polite"></p>
  <p class="coach-controls">
    <button type="button" class="js-soroban-next" hidden>Next add</button>
    <button type="button" class="js-soroban-reset">New board</button>
  </p>
  <p class="js-soroban-tally"></p>
  <noscript><p>SAMPLE: 47 + 8 → +10, −2 → 55.</p></noscript>
  <?= resource_tagger('game:soroban-rod', true) ?>
  <p>
    <?= lesson_link('mental-abacus', 'Related guide') ?>
    ·
    <a href="<?= e(url('/games')) ?>">All games</a>
  </p>
</section>
