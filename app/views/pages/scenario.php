<?php

use Reflex\Catalog\Tracks;

/** @var array<string, mixed> $study */
?>
<section class="js-scenario">
  <p class="eyebrow"><?= e(Tracks::LABEL[$study['track']]) ?></p>
  <h2><?= e($study['title']) ?></h2>
  <p><?= e($study['prompt']) ?></p>
  <p class="example js-scenario-skills" hidden>
    <?= skill_links($study['skillIds']) ?>
  </p>
  <p class="coach-controls">
    <button type="button" class="js-hint">Hint</button>
    <button type="button" class="js-cheat">Cheat</button>
  </p>
  <ol class="hint-list js-hints" hidden></ol>
  <p class="coach-panel coach-success js-cheat-text" hidden></p>
  <div class="choice-list js-choices" role="group" aria-label="Answer choices">
    <?php foreach ($study['choices'] as $row): ?>
      <button
        type="button"
        class="choice"
        data-choice-id="<?= e($row['id']) ?>"
        data-correct="<?= !empty($row['correct']) ? '1' : '0' ?>"
      >
        <?= e($row['label']) ?>
      </button>
    <?php endforeach; ?>
  </div>
  <p class="js-scenario-feedback" hidden></p>
  <?= resource_tagger('scenario:' . $study['id'], true) ?>
  <p>
    <a href="<?= e(url('/scenarios')) ?>">All scenarios</a>
    ·
    <a href="<?= e(Tracks::hrefForTrack($study['track'])) ?>">
      <?= $study['track'] === 'quick' ? 'Track A' : 'Track B' ?>
    </a>
  </p>
  <?= json_script('scenario-payload', $study) ?>
</section>
