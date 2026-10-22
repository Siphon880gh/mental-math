<section class="js-game-nearbase">
  <h2>Near-base gaps</h2>
  <p class="lede">SAMPLE: 97 × 94. Distances from 100 are −3 and −6. Pick the left part, then the right part.</p>
  <p class="coach-message js-nb-status">Left part?</p>
  <p class="coach-controls js-nb-left">
    <button type="button" data-nb="91" data-ok="1">97 − 6 = 91</button>
    <button type="button" data-nb="103" data-why="Below the base you cross subtract: 97 − 6.">97 + 6 = 103</button>
    <button type="button" data-nb="9" data-why="Adding the gaps is not the left part. Cross subtract: 97 − 6.">3 + 6 = 9</button>
  </p>
  <p class="coach-controls js-nb-right" hidden>
    <button type="button" data-nb="18" data-ok="1">3 × 6 = 18</button>
    <button type="button" data-nb="09" data-why="Multiply the gaps, do not add them.">3 + 6 = 09</button>
    <button type="button" data-nb="918" data-why="Base 100 keeps two digits on the right: 91 | 18.">Write 91 then 8</button>
  </p>
  <p class="coach-controls"><button type="button" class="js-nb-reset">Reset</button></p>
  <p class="coach-wrong coach-panel js-nb-miss" hidden></p>
  <p class="coach-success coach-panel js-nb-win" hidden>91 | 18 → 9,118.</p>
  <?= resource_tagger('game:near-base-gaps', true) ?>
  <p>
    <?= lesson_link('near-base', 'Related guide') ?>
    ·
    <a href="<?= e(url('/games')) ?>">All games</a>
  </p>
</section>
