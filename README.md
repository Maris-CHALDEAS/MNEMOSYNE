# MNEMOSYNE

A browser-based visual-novel experience set in the Chaldea universe (Type-Moon / Fate). Land in the Chaldea data center, walk its halls, and talk your way through branching dialogue with Rin Tohsaka — your choices shift her affinity toward you and decide which ending you walk out to.

MNEMOSYNE is the engine + a first scenario. It is *not* a portfolio or a hiring funnel — it is a navigation/date-style experience built purely for vibes, themed around the Chaldea aesthetic.

> Built with Vue 3 + Vite + Pinia + Vue Router. No backend. State lives in memory (localStorage planned per the design doc).

## What it does

- **Cinematic entry** — A Chaldea-style PA announcement sequence greets and authenticates you (`IntroScene`).
- **Dialogue engine** — A single reusable `DialogueBox.vue` + `useDialogueStore` drive every scene from a plain script object of `{ speaker, text, sprite?, spritePos?, choices? }` lines.
- **Typewriter text** — Lines type out character-by-character; click once to skip-reveal, click again to advance.
- **Branching choices** — Choices can jump to any line index and mutate an `affinity` store (`love` / `hate` per character).
- **Affinity-driven routing** — A scene's `nextScene` may be a string *or* a function of the live affinity state, so the same scene can route you to a good / neutral / bad ending based on cumulative choices across scenes.
- **Scene transitions** — `useSceneTransition()` watches the dialogue store and pushes the next route when a script finishes, resolving dynamic targets against current affinity.
- **Sprite + background rendering** — Each scene composes a fixed background (`Chaldea_HQ_*`) with positioned character sprites (`left` / `center` / `right`).

## Architecture

```
src/
├── main.js                  # createApp + Pinia + router
├── App.vue                  # <router-view /> shell
├── router/index.js          # route-per-scene, lazy-loaded views
├── components/
│   └── DialogueBox.vue      # typewriter text + choice buttons (the only VN UI you need)
├── composables/
│   └── useSceneTransition.js # watches dialogue store → router.push(nextScene)
├── stores/
│   ├── dialogue.js          # script/lineIndex/currentLine/advance/choose
│   ├── affinity.js          # per-character { love, hate } ledger
│   └── counter.js           # scaffold (unused in the Rin scenario)
├── scripts/                 # plain data objects — the actual "game content"
│   ├── intro.js             # PA announcement sequence → /IntroHallway
│   ├── introHallway.js      # first Rin encounter → /RinHallway2
│   └── rinHallway2.js       # branching Rin hallway, function-routed ending
└── views/scenes/             # one .vue per route; loads a script + renders bg/sprite/DialogueBox
    ├── IntroScene.vue
    ├── IntroHallway.vue
    ├── RinHallway2.vue
    ├── RinGoodEnd.vue
    └── RinBadEnd.vue
```

### The script contract

A script is a single exported object:

```js
export default {
  lines: [
    { speaker: 'Rin', text: '...', sprite: rinSprite, spritePos: 'left' },
    { speaker: 'Rin', text: '...', sprite: rinSprite, spritePos: 'left',
      choices: [
        { label: 'Walk with her.', next: 3, affinity: { char: 'rin', love: 1 } },
        { label: 'You can manage.', next: 7, affinity: { char: 'rin', hate: 1 } },
      ] },
  ],
  nextScene: '/RinHallway2'                // static string, OR
  nextScene: (affinity) => isGood(affinity) ? '/rin-good-end' : '/rin-bad-end'
}
```

Adding a new scene is "new script + new view that calls `store.loadScript(...)` + `useSceneTransition()`" — no engine code changes. Choices, affinity deltas, and routing all live in the data, not the components.

### Current scenario flow

```
/ (IntroScene)  ──PA announcement──►  /IntroHallway  ──first Rin talk──►  /RinHallway2
                                                                          │
                          affinity-based nextScene(affinity) ─────────────┤
                                                                          ├─► /rin-good-end
                                                                          ├─► /rin-neutral-end  (planned)
                                                                          └─► /rin-bad-end
```

`rinHallway2.js` contains four choice points (walk/ditch, promise/no-promise, apologise/walk-faster, will-be-here/maybe/can't) whose cumulative `love`/`hate` totals pick the ending.

## Design notes

- **Data over code.** All branching logic, affinity deltas and routing decisions live in script objects. The engine (`DialogueBox`, `dialogue` store, `useSceneTransition`) is character-agnostic and reusable for any future character.
- **Mechanics derived from canon.** Per the concept doc, a character's gate mechanic should come from their actual in-universe powers — e.g. the planned BB reject-loop draws on her time control. Not every marker needs a special mechanic.
- **Fan project.** Sprites and assets are FGO-derived fan material for personal use.

## Project setup

```sh
npm install
```

### Develop (hot-reload)

```sh
npm run dev
```

### Build for production

```sh
npm run build
```

### Preview the production build

```sh
npm run preview
```

### Run unit tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run end-to-end tests with [Playwright](https://playwright.dev)

```sh
# First run: install browsers
npx playwright install

# On CI, build first
npm run build
npm run test:e2e
# Chromium only
npm run test:e2e -- --project=chromium
# Single file
npm run test:e2e -- tests/example.spec.js
# Debug mode
npm run test:e2e -- --debug
```

### Lint and format

```sh
npm run lint      # oxlint + eslint, both with --fix
npm run format    # oxfmt on src/
```

## Recommended editor / browser setup

- **Editor:** [VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (disable Vetur).
- **Chromium browsers:** [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) — also enable *Custom Object Formatter* in DevTools.
- **Firefox:** [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/).

Tooling config: `vite.config.js`, `vitest.config.js`, `playwright.config.js`, `eslint.config.js`, `.oxlintrc.json`, `.oxfmtrc.json`, `.editorconfig`.

**Node requirement:** `^22.18.0 || >=24.12.0`.

## Roadmap

Per the concept doc, the near-term plan is:

1. Generalise the engine and add Mash (hub navigator) + Ritsuka / masterrecord.
2. Expand marker by marker — each new character's mechanic chosen from their canon kit.
3. localStorage persistence: `mash_intro_seen`, per-project rejection counts, per-project visited flags.

---

## License

Copyright (C) 2026 souls-syntax (Aakarsh).

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with this program. If not, see https://www.gnu.org/licenses/.

### Additional terms — no AI training consent

The author does not consent to the use of this project, its source code, its binary artifacts, or any derivative work thereof for the training, fine-tuning, evaluation, distillation, or benchmarking of machine learning models, large language models, or any other artificial intelligence system, whether for commercial, academic, or personal purposes. This prohibition applies regardless of license grants above and survives any redistribution or modification of the work. If the law of your jurisdiction treats such a clause as a non-negotiable term, then the license granted herein is void as to you and you must refrain from all use of the work.