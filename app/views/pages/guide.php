<?php

use Reflex\Catalog\Tracks;

/** @var array<string, mixed> $guide */
/** @var list<array<string, mixed>> $shortcuts */
/** @var bool $coachReady */
/** @var string $bodyHtml */
?>
<article>
  <p class="eyebrow"><?= e(Tracks::LABEL[$guide['track']]) ?></p>
  <?php foreach ($shortcuts as $index => $trick): ?>
    <div class="shortcut">
      <p class="shortcut-label"><?= $index === 0 ? 'Shortcut' : 'Also' ?></p>
      <p>
        <strong><?= e($trick['title']) ?>.</strong> <?= e($trick['rule']) ?>
      </p>
      <p class="example"><?= e($trick['example']) ?></p>
    </div>
  <?php endforeach; ?>
  <?= $bodyHtml ?>
  <aside class="coach-cta">
    <h3>Step-by-step coach</h3>
    <p>
      Same slug as this guide. Walk the method: wrong choice explains, then
      rewinds.
    </p>
    <p>
      <a href="<?= e(url('/coach/' . $guide['relatedCoachSlug'])) ?>">
        Open coach: <?= e($guide['relatedCoachSlug']) ?>
      </a>
      ·
      <a href="<?= e(url('/drills')) ?>">Drills</a>
      ·
      <a href="<?= e(url('/games')) ?>">Games</a>
    </p>
    <?php if (!$coachReady): ?>
      <p class="example">
        The decision tree is not authored yet. The page stays so every guide
        already has a coach slot.
      </p>
    <?php endif; ?>
  </aside>
  <?= resource_tagger('guide:' . $guide['slug'], true) ?>
  <p>
    <a href="<?= e(Tracks::hrefForTrack($guide['track'])) ?>">
      <?= $guide['track'] === 'quick' ? 'Track A' : 'Track B' ?>
    </a>
  </p>
</article>
