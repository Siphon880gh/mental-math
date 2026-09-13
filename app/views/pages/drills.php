<?php

use Reflex\Catalog\Drills;
use Reflex\Progress;

/** @var list<array{id: string, title: string, summary: string, pathGroup: bool}> $groups */
/** @var array<string, mixed> $progress */
?>
<section data-filter-section="drills">
  <h2>Drills</h2>
  <p class="lede">Timed banks. Path groups gate the next milestone. Extra groups stay off the Beginner spine.</p>
  <div class="js-drills-peek">
    <?= peek_banner('drills') ?>
  </div>
  <?= pass_filter_bar() ?>
  <p class="example js-empty-filter" hidden>No resources with that tag.</p>
  <ul class="cards">
    <?php foreach ($groups as $group): ?>
      <?php
        $milestone = Drills::BEGINNER_GROUP_MILESTONE[$group['id']] ?? null;
        $locked = Progress::isPathDrillLocked($group['id'], $progress);
      ?>
      <li
        data-resource-key="drill:<?= e($group['id']) ?>"
        <?php if ($milestone): ?>data-locked-unless="<?= e($milestone) ?>"<?= $locked ? '' : ' class="is-open"' ?><?php endif; ?>
      >
        <a class="js-unlocked-link" href="<?= e(url('/drills/' . $group['id'])) ?>"><?= e($group['title']) ?></a>
        <span class="js-locked-label"><?= e($group['title']) ?> (locked)</span>
        <p>
          <?= e($group['summary']) ?>
          <?= !empty($group['pathGroup']) ? ' Path group.' : ' Extra group.' ?>
        </p>
        <?= resource_tagger('drill:' . $group['id']) ?>
      </li>
    <?php endforeach; ?>
  </ul>
</section>
