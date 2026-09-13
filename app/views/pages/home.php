<?php

/** @var array<string, mixed> $path */
/** @var array<string, mixed> $operatorPath */
/** @var array<string, mixed> $progress */
/** @var ?array<string, mixed> $next */
/** @var string $ctaHref */
/** @var array<string, string> $tips */

use Reflex\Catalog\LearningPaths;
use Reflex\Progress;

$complete = $next === null;
$gated = Progress::areCasesLocked($progress);
?>
<section class="js-dashboard">
  <h2 class="js-path-title"><?= e($path['title']) ?></h2>
  <p class="js-first-run">
    First run: five minutes of reflex training, no calculator. Track A
    shortcuts, then a timed gate, then conversation cases.
  </p>
  <p class="lede js-returning" hidden><?= e($path['description']) ?></p>
  <p class="coach-panel coach-success js-complete" hidden>
    Path complete. You can smell-test SAMPLE numbers in conversation without
    a calculator.
  </p>
  <p class="js-next">
    Next: <?= e((string) ($next['title'] ?? '')) ?>. <?= e((string) ($next['coachTip'] ?? '')) ?>
  </p>
  <p class="coach-controls">
    <a class="js-cta" href="<?= e($ctaHref) ?>"><?= $complete ? 'Browse guides' : 'Continue' ?></a>
  </p>
  <div class="js-cases-gate"<?= $gated ? '' : ' hidden' ?>>
    <?= peek_banner('cases', true) ?>
  </div>
  <h3>Milestones</h3>
  <ul class="cards js-milestones">
    <?php foreach ($path['milestones'] as $node): ?>
      <li data-milestone-id="<?= e($node['id']) ?>">
        <strong><?= e($node['title']) ?></strong>
        <p>
          <span class="js-ms-status"><?= e($progress['milestones'][$node['id']] ?? 'locked') ?></span>
          · <?= e($node['coachTip']) ?>
        </p>
        <p class="example">
          <?php foreach ($node['contentRefs'] as $index => $ref): ?>
            <?= $index > 0 ? ' · ' : '' ?>
            <a href="<?= e(LearningPaths::hrefForRef($ref)) ?>"><?= e(str_replace(':', ' ', $ref)) ?></a>
          <?php endforeach; ?>
        </p>
      </li>
    <?php endforeach; ?>
  </ul>
  <p class="example js-path-note">Beginner path does not name CFO packs in the primary CTA.</p>
  <h3>Switch path</h3>
  <div class="js-switch-preview coach-panel" hidden>
    <p>Switch to <?= e($operatorPath['title']) ?>?</p>
    <ul class="js-switch-list">
      <?php foreach ($operatorPath['milestones'] as $node): ?>
        <li><?= e($node['title']) ?></li>
      <?php endforeach; ?>
    </ul>
    <p class="coach-controls">
      <button type="button" class="js-confirm-switch">Confirm switch</button>
      <button type="button" class="js-cancel-switch">Cancel</button>
    </p>
  </div>
  <p class="coach-controls js-switch-cta">
    <button type="button" class="js-preview-switch">Preview <?= e($operatorPath['title']) ?></button>
  </p>
  <h3>Process tips</h3>
  <ul>
    <?php foreach ($tips as $mode => $tip): ?>
      <li>
        <strong><?= e(str_replace('_', ' ', $mode)) ?>.</strong> <?= e($tip) ?>
      </li>
    <?php endforeach; ?>
  </ul>
  <p class="coach-controls">
    <button type="button" class="js-reset-path">Reset path</button>
  </p>
  <?= json_script('learning-paths', ['beginner' => LearningPaths::BEGINNER, 'operator' => LearningPaths::OPERATOR]) ?>
</section>
