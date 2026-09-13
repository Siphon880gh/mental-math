<?php

use Reflex\Catalog\Cases;

/** @var list<array{id: string, title: string, summary: string}> $packs */
?>
<section data-filter-section="cases">
  <h2>Cases</h2>
  <div class="js-cases-locked">
    <?= peek_banner('cases', true) ?>
    <p>
      Graded cases stay locked until the timed fluency gate: ≥80% on
      /drills/percents (median ≤5s) and /drills/conversions (median ≤6s).
    </p>
  </div>
  <p class="lede js-cases-lede js-cases-open">Conversation prompt, commit a number, then see the chain. SAMPLE only.</p>
  <div class="js-cases-open">
    <?= peek_banner('cases', true) ?>
  </div>
  <div class="js-cases-open">
    <?= pass_filter_bar() ?>
  </div>
  <?php foreach ($packs as $pack): ?>
    <?php $allRows = Cases::forPack($pack['id']); ?>
    <section class="track-block">
      <h3><?= e($pack['title']) ?></h3>
      <p class="lede"><?= e($pack['summary']) ?></p>
      <p class="example js-pack-locked">Pack locked behind the percents + conversions timed gate.</p>
      <p class="example js-empty-filter" hidden>No resources with that tag.</p>
      <?php if ($allRows === []): ?>
        <p class="example js-cases-open">No cases in this pack yet.</p>
      <?php else: ?>
        <ul class="cards js-cases-open">
          <?php foreach ($allRows as $row): ?>
            <li data-resource-key="case:<?= e($row['id']) ?>">
              <a href="<?= e(url('/cases/' . $row['id'])) ?>"><?= e($row['id']) ?></a>
              <p>
                <?= e($row['difficulty']) ?> · <?= e($row['thinkingMode']) ?>
              </p>
              <?= resource_tagger('case:' . $row['id']) ?>
            </li>
          <?php endforeach; ?>
        </ul>
      <?php endif; ?>
    </section>
  <?php endforeach; ?>
  <p>
    <a href="<?= e(url('/')) ?>">Home</a>
  </p>
</section>
