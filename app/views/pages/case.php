<?php

/** @var array<string, mixed> $study */
/** @var string $tip */
?>
<section class="js-case-player">
  <div class="js-cases-locked">
    <h2>Cases locked</h2>
    <?= peek_banner('case', true) ?>
    <?= resource_tagger('case:' . $study['id'], true) ?>
  </div>
  <div class="js-cases-open">
    <?= peek_banner('case', true) ?>
    <p class="eyebrow">
      <?= e($study['packId']) ?> · <?= e($study['difficulty']) ?> · <?= e($study['thinkingMode']) ?>
    </p>
    <h2><?= e($study['prompt']) ?></h2>
    <p class="example">
      Skill: <?= lesson_link($study['familyId']) ?>
    </p>
    <form class="js-case-form">
      <label>
        Your number
        <input name="answer" inputmode="decimal" />
      </label>
      <p class="coach-controls js-case-submit-row">
        <button type="submit">Submit</button>
      </p>
      <div class="js-case-reveal" hidden></div>
    </form>
    <?= resource_tagger('case:' . $study['id'], true) ?>
    <p>
      <a href="<?= e(url('/cases')) ?>">All cases</a>
    </p>
  </div>
  <?= json_script('case-payload', ['study' => $study, 'tip' => $tip]) ?>
</section>
