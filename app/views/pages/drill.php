<?php

/** @var array{id: string, title: string, summary: string, pathGroup: bool} $group */
/** @var string $groupId */
/** @var list<array<string, mixed>> $items */
/** @var bool $gated */
/** @var ?string $milestone */
?>
<section
  class="js-drill-player<?= $gated ? ' js-drill-gated' : '' ?>"
  <?= $milestone ? 'data-locked-unless="' . e($milestone) . '"' : '' ?>
  <?= $gated ? '' : ' data-open="1"' ?>
>
  <div class="js-drill-locked">
    <h2><?= e($group['title']) ?></h2>
    <?= peek_banner('drill') ?>
    <?= resource_tagger('drill:' . $groupId, true) ?>
    <p>
      <a href="<?= e(url('/')) ?>">Home</a>
      ·
      <a href="<?= e(url('/drills')) ?>">All drills</a>
    </p>
  </div>
  <div class="js-drill-play" <?= $gated ? 'hidden' : '' ?>>
    <?php if ($gated): ?>
      <?= peek_banner('drill') ?>
    <?php endif; ?>
    <?php if ($items === []): ?>
      <p>Empty group.</p>
      <a href="<?= e(url('/drills')) ?>">All drills</a>
    <?php else: ?>
      <div class="js-drill-run">
            <p class="js-drill-meta eyebrow"><?= e($group['title']) ?> · 1/<?= count($items) ?> · 0s</p>
        <h2 class="js-drill-prompt"><?= e($items[0]['prompt']) ?></h2>
        <p class="example js-drill-skill">Skill: <?= lesson_link($items[0]['familyId']) ?></p>
        <form class="js-drill-form">
          <label>
            Answer
            <input name="answer" inputmode="decimal" />
          </label>
          <p class="example js-drill-unit" hidden></p>
          <p class="coach-controls js-drill-submit-row">
            <button type="submit">Submit</button>
          </p>
          <div class="js-drill-reveal" hidden></div>
        </form>
        <?= resource_tagger('drill:' . $groupId, true) ?>
        <p>
          <a href="<?= e(url('/drills')) ?>">All drills</a>
        </p>
      </div>
      <div class="js-drill-done" hidden></div>
      <?= json_script('drill-payload', ['group' => $group, 'items' => $items, 'gated' => $gated]) ?>
    <?php endif; ?>
  </div>
</section>
