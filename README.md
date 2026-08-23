# MNEMOSYNE

A browser-based visual novel set in the Chaldea universe (Type-Moon / Fate). Explore the facility, read branching dialogue, and make choices that change Rin's affinity and determine the ending.

MNEMOSYNE contains both the reusable dialogue engine and its demo scenarios. It has no backend; progress is restored from `localStorage`.

> Built with Vue 3, Vite, Pinia, and Vue Router.

## What it does

- **Dialogue engine** — A single reusable `DialogueBox.vue` + `useDialogueStore` drive every scene from a plain script object of `{ speaker, text, sprite?, spritePos?, choices?, background? }` lines.
- **Typewriter text** — Lines type out character-by-character; click once to skip-reveal, click again to advance.
- **Branching choices** — Choices can jump to any line index and mutate an `affinity` store (`love` / `hate` per character).
- **Affinity-driven routing** — A scene's `nextScene` may be a string *or* a function of the live affinity state, so the same scene can route you to a good / neutral / bad ending based on cumulative choices across scenes.
- **Scene transitions** — `useSceneTransition()` watches the dialogue store and pushes the next route when a script finishes, resolving dynamic targets against current affinity.
- **Persistence** — The save store restores the current scene, line index, and character affinities from the `mnemosyne-save` `localStorage` entry.
- **Audio** — `bgmManager.js` loads and loops scene BGM through the Web Audio API. Browsers may require user interaction before playback starts.

## Architecture

```text
src/
├── main.js                   # createApp + Pinia + router + Save Hydration
├── App.vue                   # <router-view /> shell
├── router/index.js           # route-per-scene and save-state redirects
├── components/
│   ├── DialogueBox.vue       # typewriter text + choice buttons + Modals
│   └── ConfirmationModal.vue # reusable UI for save/reset/BGM pauses
├── composables/
│   ├── useSceneTransition.js # watches dialogue store → router.push(nextScene)
│   └── bgmManager.js         # audio playback controller
├── stores/
│   ├── dialogue.js           # script/lineIndex/currentLine/advance/choose
│   ├── affinity.js           # per-character { love, hate } ledger
│   └── save.js               # localStorage persistence logic
├── scripts/                  # plain data objects: the actual game content
│   ├── sceneTemplate.js      # base template for building new scenes
│   ├── demoArrival.js        # Current demo route flow
│   ├── demoBriefing.js
│   ├── demoHallway.js
│   ├── demoObservation.js
│   └── demoDecision.js       # Calculates final affinity for the ending
└── views/
    ├── home/Home.vue         # story library and story cards
    └── demo/
        ├── template.vue      # shared demo scene template
        └── scenes/            # demo scene views
            ├── Arrival.vue
            ├── Briefing.vue
            ├── Decision.vue
            └── ...
```

### The script contract

A script is a single exported object. It acts as a Domain-Specific Language (DSL) that defines the scene without touching UI logic:

```js
import characterNeutral from '@/assets/sprites/rin/rin-normal.png'
import background from '@/assets/backgrounds/Chaldea_HQ_Hallway.webp'
import bgMusic from './demoBgm'

export default {
    bgMusic, // Optional BGM
    lines: [
        {
            speaker: 'Character',
            text: 'Choose your response.',
            sprite: characterNeutral,
            spritePos: 'left',
            background,
            choices: [
                { label: 'Kind response', next: 2, affinity: { char: 'rin', love: 1 } },
                { label: 'Cold response', next: 2, affinity: { char: 'rin', hate: 1 } },
            ],
        },
    ],
    // Dynamic routing based on cumulative affinity
    nextScene: (affinity) => {
        const character = affinity.characters.rin ?? { love: 0, hate: 0 }
        return character.love > character.hate ? '/rin-good-end' : '/rin-bad-end'
    },
}
```

Adding a new scene normally means adding a script, a route/view under `views/<story>/scenes/` that calls `store.loadScript(...)`, and the story's `views/<story>/template.vue`. Choices, affinity deltas, audio, and routing live in the script data. The home page keeps its story cards in one `stories` array so new stories can be added without changing the card markup.

## Demo flow

The current playable route sequence is:

`/demo/arrival` -> `/demo/briefing` -> `/demo/hallway` -> `/demo/observation` -> `/demo/decision`

The decision scene routes to `/rin-good-end` or `/rin-bad-end` based on accumulated affinity values. `/` opens the story library.

## Project setup

```sh
npm install
```

### Develop (hot-reload)
```sh
npm run dev
```

The dev server prints the local URL, usually `http://localhost:5173`.

### Build for production
```sh
npm run build
npm run preview
```

### Run tests
```sh
npm run test:unit  # Vitest
```

### End-to-end tests (Playwright)
```sh
npx playwright install
npm run build
npm run test:e2e
```

### Lint and format
```sh
npm run lint      # oxlint + eslint, both with --fix
npm run format    # oxfmt on src/
```

The project currently targets Node.js `22.18+` or `24.12+`.

## Roadmap

1. **Rich Text Formatting:** Update the dialogue renderer to support inline styling (bold, italics, colored text, shaking animations).
2. **GUI Authoring Tool:** Build a visual node-based editor to generate the `script.js` files, eliminating the need for manual JSON/JS data entry.
3. **Expand Scenarios:** Expand marker by marker — each new character's mechanic chosen from their canon kit (e.g. BB reject-loop).

---

## License

Copyright (C) 2026 souls-syntax (Aakarsh).

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with this program. If not, see https://www.gnu.org/licenses/.

### Additional terms — no AI training consent

The author does not consent to the use of this project, its source code, its binary artifacts, or any derivative work thereof for the training, fine-tuning, evaluation, distillation, or benchmarking of machine learning models, large language models, or any other artificial intelligence system, whether for commercial, academic, or personal purposes. This prohibition applies regardless of license grants above and survives any redistribution or modification of the work. If the law of your jurisdiction treats such a clause as a non-negotiable term, then the license granted herein is void as to you and you must refrain from all use of the work.
