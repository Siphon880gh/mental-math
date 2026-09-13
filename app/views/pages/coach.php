<?php

use Reflex\Catalog\Tracks;
use Reflex\Coaching\Navigate;

/** @var string $slug */
/** @var ?array<string, mixed> $guide */
/** @var array<string, mixed> $session */
/** @var array{currentNodeId: string, history: list<string>} $state */
/** @var array<string, mixed> $node */

$showChoices = ($node['outcome'] ?? '') === 'continue' && !empty($node['choices']);
$backAvailable = Navigate::canStepBack($session['tree'], $state);
$label = $guide ? Tracks::LABEL[$guide['track']] : 'Step-by-step coach';
?>
<section class="coach js-coach">
  <p class="eyebrow"><?= e($label) ?></p>
  <h2><?= e($session['meta']['title']) ?></h2>
  <p class="example"><?= e($session['meta']['summary']) ?></p>

  <div class="coach-panel coach-<?= e($node['outcome']) ?>" id="coach-message" tabindex="-1">
    <p class="shortcut-label js-coach-label">
      <?= $node['outcome'] === 'continue' ? 'Decide' : ($node['outcome'] === 'wrong' ? 'Wrong · review' : 'Success') ?>
    </p>
    <p class="coach-message js-coach-message"><?= e($node['message']) ?></p>
  </div>

  <ul class="coach-choices js-coach-choices"<?= $showChoices ? '' : ' hidden' ?>>
    <?php foreach ($node['choices'] ?? [] as $choice): ?>
      <li>
        <button type="button" data-choice-id="<?= e($choice['id']) ?>"><?= e($choice['label']) ?></button>
      </li>
    <?php endforeach; ?>
  </ul>

  <p class="coach-controls">
    <button type="button" class="js-coach-rewind"<?= ($node['outcome'] ?? '') === 'wrong' ? '' : ' hidden' ?>>Rewind and try again</button>
    <button type="button" class="js-coach-back"<?= ($node['outcome'] ?? '') !== 'wrong' && $backAvailable ? '' : ' hidden' ?>>Step back</button>
    <button type="button" class="js-coach-restart">Restart</button>
  </p>

  <details class="coach-trail" open>
    <summary>Path trail</summary>
    <ol class="js-coach-trail">
      <li class="current">You are here</li>
    </ol>
  </details>

  <?php if ($guide): ?>
    <?= resource_tagger('guide:' . $guide['slug'], true) ?>
  <?php endif; ?>

  <p>
    <?php if ($guide): ?>
      <a href="<?= e(url('/guides/' . $guide['slug'])) ?>">Back to guide</a>
      ·
    <?php endif; ?>
    <a href="<?= e(Tracks::hrefForTrack($guide['track'] ?? 'quick')) ?>">
      <?= ($guide['track'] ?? 'quick') === 'stakeholder' ? 'Track B' : 'Track A' ?>
    </a>
  </p>
  <?= json_script('coach-session', $session) ?>
  <?= json_script('coach-slug', $slug) ?>
</section>
