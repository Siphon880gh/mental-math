<?php

use Reflex\Catalog\Guides;

/** @var array<string, mixed> $toolbox */

$guideLinks = static function (array $familyIds): string {
    $links = [];
    foreach ($familyIds as $familyId) {
        $guide = Guides::forFamilyOne($familyId);
        if ($guide === null) {
            continue;
        }
        $links[] = '<a href="' . e(url('/guides/' . $guide['slug'])) . '">' . e($guide['title']) . '</a>';
    }

    return implode(' · ', $links);
};
?>
<article>
  <p class="eyebrow">Toolbox</p>
  <h2>Twelve master techniques</h2>
  <p class="lede"><?= e($toolbox['intro']) ?></p>
  <ol class="cards">
    <?php foreach ($toolbox['masters'] as $master): ?>
      <li>
        <p><strong><?= e($master['title']) ?>.</strong> <?= e($master['rule']) ?></p>
        <p class="example"><?= $guideLinks($master['familyIds']) ?></p>
      </li>
    <?php endforeach; ?>
  </ol>

  <h2>Suggested progression</h2>
  <p>Work these in order. Each step leans on the one before it.</p>
  <ol class="cards">
    <?php foreach ($toolbox['progression'] as $step): ?>
      <li>
        <p><strong><?= e((string) $step['step']) ?>. <?= e($step['title']) ?></strong></p>
        <p class="example"><?= $guideLinks($step['familyIds']) ?></p>
      </li>
    <?php endforeach; ?>
  </ol>

  <h2>A note on history</h2>
  <?php foreach ($toolbox['notes'] as $note): ?>
    <div class="shortcut">
      <p class="shortcut-label"><?= e($note['title']) ?></p>
      <p><?= e($note['body']) ?></p>
    </div>
  <?php endforeach; ?>

  <p><a href="<?= e(url('/track-a')) ?>">Track A</a> · <a href="<?= e(url('/drills/foundations')) ?>">Foundations drills</a></p>
</article>
