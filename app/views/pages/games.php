<?php

/** @var list<array<string, mixed>> $games */
?>
<section data-filter-section="games">
  <h2>Mini-games</h2>
  <p class="lede">One mechanic each. Not another typed drill.</p>
  <?= pass_filter_bar() ?>
  <p class="example js-empty-filter" hidden>No resources with that tag.</p>
  <ul class="cards">
    <?php foreach ($games as $game): ?>
      <li data-resource-key="game:<?= e($game['slug']) ?>">
        <a href="<?= e(url('/games/' . $game['slug'])) ?>"><?= e($game['title']) ?></a>
        <p><?= e($game['summary']) ?></p>
        <?= resource_tagger('game:' . $game['slug']) ?>
      </li>
    <?php endforeach; ?>
  </ul>
</section>
