<?php

use Reflex\Catalog\Tracks;

/** @var string $track */
/** @var list<array<string, mixed>> $guides */
?>
<section data-filter-section="<?= $track === 'quick' ? 'track-a' : 'track-b' ?>">
  <p class="eyebrow"><?= $track === 'quick' ? 'Track A' : 'Track B' ?></p>
  <h2><?= e(Tracks::LABEL[$track]) ?></h2>
  <p class="lede"><?= e(Tracks::BLURB[$track]) ?></p>
  <?= pass_filter_bar() ?>
  <p class="example js-empty-filter" hidden>No resources with that tag.</p>
  <ul class="cards">
    <?php foreach ($guides as $guide): ?>
      <li data-resource-key="guide:<?= e($guide['slug']) ?>">
        <a href="<?= e(url('/guides/' . $guide['slug'])) ?>"><?= e($guide['title']) ?></a>
        <p><?= e($guide['summary']) ?></p>
        <?= resource_tagger('guide:' . $guide['slug']) ?>
      </li>
    <?php endforeach; ?>
  </ul>
</section>
