<?php

use Reflex\Catalog\Tracks;

/** @var string $slug */
/** @var ?array<string, mixed> $guide */
?>
<section>
  <p class="eyebrow">
    <?= e($guide ? Tracks::LABEL[$guide['track']] : 'Step-by-step coach') ?>
  </p>
  <h2><?= e($guide ? $guide['title'] . ' — coach' : $slug) ?></h2>
  <p>
    Step-by-step coach for this guide is not authored yet. The page stays
    so every guide already has a coach slot.
  </p>
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
</section>
