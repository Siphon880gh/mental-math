# Context apps

Local clones of sibling coaching apps. This folder is reference material for Cursor when building the math trainer (paths, quizzes, cases, coach sessions, and harness-authored artifacts). It is not part of the math app itself.

Clones stay on disk only. They are gitignored and are not redistributed by this repo. Licenses and copyright remain with each upstream project.

## Clone

From the app repo root:

```bash
bash context/clone.sh
```

The script shallow-clones (`--depth 1`) into `context/apps/`. If a folder is already a git clone, it runs `git pull --ff-only`.

## Catalog

| Folder | Upstream | Use for |
|--------|----------|---------|
| `apps/Stocks-Trainer` | [Siphon880gh/Stocks-Trainer](https://github.com/Siphon880gh/Stocks-Trainer) | React/Vite trainer: learning paths, literacy quizzes, graded cases, coach sessions, progress store |
| `apps/leetcode-coach` | [Siphon880gh/leetcode-coach](https://github.com/Siphon880gh/leetcode-coach) | PHP Algo Learning IDE: guides, mini games, step-by-step coaching trees, harness skill |

## Authoring

After cloning, open matching patterns under `context/apps/` when creating math guides, drills, or coaching trees.
