---
name: add-coaching-session
description: >-
  Add one Mental Math Trainer step-by-step coaching tree for a guide slug.
  Use when authoring or pairing `/coach/:slug` with a guide / familyId.
---

# Add a coaching session

One valid decision graph per guide. Slug = `familyId` = guide slug. No runtime LLM.

## Files

- New: `data/coaching/<slug>.json` (source of truth; auto-loaded)
- Optional builder: `Reflex\Coaching\BuildMethodTree::fromSpec` in `app/Coaching/BuildMethodTree.php` — dump JSON once, then keep the file
- Validate: `Reflex\Coaching\Validate::session` in `app/Coaching/Validate.php`

No register step. `Reflex\Coaching\Sessions` loads every `data/coaching/*.json`.

## Shape

Use `BuildMethodTree::fromSpec` or write the JSON by hand to match an existing file such as `data/coaching/anchors.json`.

Minimum: `start` + two more continue layers, ≥2 `wrong` nodes with `rewind_to`, ≥1 `success` with empty choices.

`meta.familyId` = slug. Tags must include `beginner` or `intermediate`. First message is a SAMPLE setup. Teach **which shortcut to pick**, not a quiz restated as buttons.

Wrong nodes: explanation + empty `choices` + `rewind_to` back to the continue layer.

## Verify

`Validate::session` must pass. Then `./vendor/bin/phpunit`.

Quick check:

```bash
php -r 'require "app/bootstrap.php";
$s = json_decode(file_get_contents("data/coaching/<slug>.json"), true);
$r = Reflex\Coaching\Validate::session($s);
fwrite(STDERR, $r["ok"] ? "ok\n" : print_r($r["issues"], true));
exit($r["ok"] ? 0 : 1);'
```

Guide CTA `/coach/<slug>` should play the tree, not show “not authored yet.”
