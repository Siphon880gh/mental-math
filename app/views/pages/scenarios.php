<?php

use Reflex\Catalog\Tracks;

/** @var list<array<string, mixed>> $quick */
/** @var list<array<string, mixed>> $stakeholder */

$blocks = ['quick' => $quick, 'stakeholder' => $stakeholder];
?>
<section data-filter-section="scenarios">
  <h2>Scenarios</h2>
  <p class="lede">
    Multi-skill stories. Hint when stuck, Cheat for the full chain, then pick
    a number. Separate from conversation Cases.
  </p>
  <?= pass_filter_bar() ?>
  <?php foreach ($blocks as $track => $rows): ?>
    <section class="track-block">
      <h3><?= e(Tracks::LABEL[$track]) ?></h3>
      <p class="example js-empty-filter" hidden>No resources with that tag.</p>
      <ul class="cards">
        <?php foreach ($rows as $row): ?>
          <li data-resource-key="scenario:<?= e($row['id']) ?>">
            <a href="<?= e(url('/scenarios/' . $row['id'])) ?>"><?= e($row['title']) ?></a>
            <p>
              <?= skill_links($row['skillIds'], null) ?>
              · SAMPLE
            </p>
            <?= resource_tagger('scenario:' . $row['id']) ?>
          </li>
        <?php endforeach; ?>
      </ul>
    </section>
  <?php endforeach; ?>
</section>
