# KiriKiri Web — Complete Architecture Deep Dive

**Written for a Vue developer who has never touched React.**

This document traces every decision point in the KiriKiri Web codebase: how data flows from a raw `.ks` script file all the way to pixels and sound on screen. Where a React concept appears, it is immediately translated into the Vue equivalent so you always have a mental model to anchor to.

---

## Table of Contents

1. [React ↔ Vue Glossary](#1-react--vue-glossary)
2. [Application Bootstrap](#2-application-bootstrap)
3. [Global Options — The "Provide/Inject" Pattern](#3-global-options--the-provideinject-pattern)
4. [Routing](#4-routing)
5. [The Home Page & Scene Graph](#5-the-home-page--scene-graph)
6. [The Reader — Where VN Reading Happens](#6-the-reader--where-vn-reading-happens)
7. [Script Loading Pipeline](#7-script-loading-pipeline)
8. [The Tokenizer — Turning Text Into Tokens](#8-the-tokenizer--turning-text-into-tokens)
9. [The Interpreter — Macros, Jumps, and State](#9-the-interpreter--macros-jumps-and-state)
10. [The Renderer — Tokens Into Visuals](#10-the-renderer--tokens-into-visuals)
11. [Scroll Watcher — User Progression](#11-scroll-watcher--user-progression)
12. [ScrollDetect — The Section Boundary Sensor](#12-scrolldetect--the-section-boundary-sensor)
13. [Animation — Layers, Keyframes, and CSS Transitions](#13-animation--layers-keyframes-and-css-transitions)
14. [Audio — BGM, Voice, and Sound Effects](#14-audio--bgm-voice-and-sound-effects)
15. [Choice/Branching — End-of-Page Navigation](#15-choicebranching--end-of-page-navigation)
16. [Resource Lookup — Dynamic Asset Resolution](#16-resource-lookup--dynamic-asset-resolution)
17. [Full Data Flow Diagram](#17-full-data-flow-diagram)
18. [Key Design Decisions & Why They Were Made](#18-key-design-decisions--why-they-were-made)

---

## 1. React ↔ Vue Glossary

Before diving in, here is a reference card. Every time you see a React concept below, refer back here.

| React Concept | Vue 3 Equivalent | What it does |
| :--- | :--- | :--- |
| `class Component` with `render()` | `<script setup>` or Options API component | Defines a component |
| `this.state` / `this.setState({})` | `ref()` / `reactive()` | Local reactive state |
| `props` | `defineProps()` | Data passed from parent to child |
| `React.createContext()` + `Provider` + `Consumer` | `provide()` / `inject()` | Share data across the tree without prop drilling |
| `withOptions(Component)` (Higher-Order Component / HOC) | `inject('options')` inside `<script setup>` | Wraps a component to inject context values as props |
| `componentDidMount()` | `onMounted()` | Run code after component is in the DOM |
| `componentDidUpdate()` | `watch()` or `onUpdated()` | React to prop/state changes |
| `componentWillUnmount()` | `onUnmounted()` | Clean up (remove listeners, timers) |
| `<>{children}</>` (Fragments) | `<template>` (implicit fragment in Vue 3) | Render multiple root elements |
| `withRouter(Component)` | `useRouter()` / `useRoute()` | Access route params and navigation |
| `<BrowserRouter>` / `<Route>` / `<Switch>` | `createRouter()` / `<RouterView>` | Declarative routing |
| `<Link to={path}>` | `<RouterLink :to="path">` | Client-side navigation link |
| `React.createRef()` / `this.ref` | `ref()` / template refs | Reference a DOM element directly |
| `key={...}` on elements | `:key="..."` on elements | Force re-creation of component when key changes |

> **The single biggest pattern in this codebase** is the Higher-Order Component (`withOptions`). In Vue, you would simply `inject('options')` inside any component that needs access to global settings. In React, they wrap every component that needs options with `withOptions(MyComponent)`, which injects `this.props.options` automatically.

---

## 2. Application Bootstrap

**Files:** `index.js` → `App.js` → `router/router.js`

The boot sequence is dead simple:

```
index.js
  └── Renders <App /> into #root
        └── App.js is just: <Router />
              └── router.js defines <Options> wrapping <BrowserRouter>
```

**Vue equivalent:** This is like your `main.js` calling `createApp(App).use(router).use(pinia).mount('#app')`. The key difference is that in KiriKiri Web, there is no Pinia — **all global state lives in React Context** (the `Options` component and the `ScrollWatcher` component act as the global stores).

---

## 3. Global Options — The "Provide/Inject" Pattern

**File:** `options/options.js` + `reader/debug.js`

This is the closest thing KiriKiri Web has to a Pinia store. It manages:
- Audio volume levels (BGM, Voice, SFX) — each as a 0-100 slider
- BGM version preference (Vita / PS2 / Original soundtrack)
- Language (English / Japanese)
- Content maturity level
- Debug level (0 = off, 1 = basic, 2 = verbose)
- UI state (`showMenu`, `canAutoplay`)

**How it works:**
1. `debug.js` creates a React Context: `const {Provider, Consumer} = React.createContext({debugLevel: 0})`
   - **Vue equivalent:** `provide('options', reactiveOptionsObject)` in a root component.
2. `options.js` is a class component that wraps the entire app in `<Provider value={...}>`.
   - It reads initial values from **browser cookies** (not localStorage!). This is a deliberate choice — cookies persist across sessions and can be read server-side if needed.
   - It exposes a `setSaveState(val)` method that both updates React state AND writes cookies with a 10-year expiry.
3. Any child component that needs options is wrapped with the `withOptions()` HOC, which injects `this.props.options`.
   - **Vue equivalent:** Any child component calls `const options = inject('options')`.

**Decision Point — Why Cookies Instead of localStorage?**
The KiriKiri Web team chose cookies because the save state is minimal (just preference flags), and cookies allow the server proxy to potentially read user preferences during SSR or asset proxying. Your MNEMOSYNE uses `localStorage` which is perfectly fine for a client-only app.

**The Settings Menu (`options/menu/menu.js`):**
A simple overlay with range sliders and radio buttons. Toggled by pressing `Escape`. In Vue terms, this would be a `<Teleport to="body">` modal component.

---

## 4. Routing

**File:** `router/router.js`

The router defines just two route patterns:

```
Route 1: Home Page
  Paths: /:route(prologue|fate|saber|ubw|rin|hf|sakura|...) or /
  Component: <Home />

Route 2: Reader (VN scene)
  Paths: /:route/:day/:chapter or /:route/:chapter or /:script
  Component: <ResetReader /> → <Reader />
```

**Decision Point — The `ResetReader` wrapper:**
`ResetReader` is a tiny component whose only job is to compute a `key` from the route params (`route/day/chapter/script`) and pass it to `<Reader>`. When the URL changes, the `key` changes, which **forces React to destroy and re-create the entire Reader from scratch**. This is the nuclear option for ensuring no stale state leaks between scenes.

**Vue equivalent:** You would use `:key="route.fullPath"` on your `<RouterView>` to achieve the same forced re-mount behavior.

---

## 5. The Home Page & Scene Graph

**Files:** `home/home.js`, `home/introduction/introduction.js`, `home/graph/graph.js`, `home/graph/section/section.js`, `home/graph/arrows/arrows.js`

The home page has three layers stacked vertically:
1. **Background** — A static decorative background.
2. **Introduction** — Collapsible text sections (How to Use, Acknowledgements). Uses cookie state to remember if sections are open/closed.
3. **Graph** — An interactive visual map of every scene in Fate/Stay Night.

**The Scene Graph is the most impressive part of the home page.**

It renders hundreds of scene nodes (from `scene-index.js`, a ~12,000 line generated file) as clickable `<Link>` elements arranged in a recursive vertical/horizontal grid. The data structure looks like:

```js
sections = {
  v: [           // vertical stack
    { section: "プ1", v: [{id: "プ1-001", eng: "Prologue Day 1"}, ...] },
    { h: [       // horizontal row (for parallel routes)
      { v: [...] },  // Fate route
      { v: [...] },  // UBW route
      { v: [...] },  // HF route
    ]}
  ]
}
```

**Connectivity Arrows:**
An `<svg>` overlay draws Bézier curves between scene nodes to show which scenes connect to which. On hover, the `graph.js` component builds forward (`next`) and reverse (`prev`) lookup maps and highlights connected nodes.

**Decision Point — Why a graph instead of a simple list?**
Fate/Stay Night has a complex branching structure with three parallel routes, shared prologue days, and cross-route dependencies. A flat list cannot represent this. MNEMOSYNE's current "story card" approach works for a simpler structure, but if you ever build something with parallel routes, this graph approach is worth studying.

---

## 6. The Reader — Where VN Reading Happens

**File:** `reader/reader.js`

The Reader is the core "game view". It composes three child systems:

```
<ScrollWatcher>                        ← Controls user progression
  <Animation freezeFrame={...} />      ← Background layers + audio
  <div className="text-area">
    <ScriptLoader ... />               ← Loads, parses, and renders the script
    <Choice ... />                     ← End-of-scene branching buttons
  </div>
  <div className="click-to-start">     ← Initial overlay before user interaction
    Click to start / Tap to start
  </div>
</ScrollWatcher>
```

**Vue equivalent structure:**
```vue
<ScrollWatcher>
  <AnimationLayer :freeze="!canAutoplay" />
  <div class="text-area">
    <ScriptRenderer />
    <ChoiceButtons />
  </div>
  <div v-if="!canAutoplay" class="click-to-start">...</div>
</ScrollWatcher>
```

**Decision Point — The "Click to Start" Gate:**
Browsers block autoplay of audio until the user has interacted with the page. The "click to start" overlay exists specifically to capture that first user gesture so that BGM can play. Your MNEMOSYNE handles this the same way — the `firstClick` flag in `DialogueBox.vue` serves the identical purpose.

---

## 7. Script Loading Pipeline

**File:** `interpreter/script-loader.js`

This is the orchestrator that ties parsing to rendering. The flow is:

```
1. componentDidMount() → calls load()
2. load():
   a. Fetches the macro file (マクロ.ks.gz) — a base library of reusable script macros
   b. Fetches the actual scene script (e.g., "セ1-001.ks.gz")
   c. Both are fetched as compressed text over the network
   d. Calls preRender(file, macroFile)
3. preRender():
   a. Builds a gameState object with a "stack frame" pointing to the file text
   b. If this is the first load, prepends the macro file as a "call" that returns to the scene
   c. Calls Tokenize(tokens, gameState, target) — THE PARSER
   d. Calls Render(tokens, ...) — TOKENS → REACT ELEMENTS
   e. Logs performance: "tokenize: 12ms  render: 8ms"
   f. Stores both tokens and rendered output in state
```

**Vue equivalent:** This would be an `onMounted()` hook that fetches the script, runs it through your parser composable, and stores the result in a Pinia store.

**Decision Point — Why fetch macros separately?**
KiriKiri scripts use a macro system (like `#define` in C). The macro file `マクロ.ks` defines shorthand tags that expand into multiple commands. By loading it first and "calling" it before the actual script, all macros are available for the interpreter. This is a clever hack — instead of building a separate macro-loading phase, they just treat the macro file as a script that "returns" to the real script.

---

## 8. The Tokenizer — Turning Text Into Tokens

**File:** `interpreter/parse/tokenize.js`

This is a pure-function lexer. It takes raw `.ks` text and produces an array of token objects.

**The Master Regex:**
The entire tokenizer is driven by one enormous sticky regex (`/y` flag = match at exact position):

```
topLevelRegex matches one of these patterns at the current position:
  ;(.*)$                          → Comment         (lines starting with ;)
  *(.+)$                          → Save point/Link (lines starting with *)
  @(\S+)(.*)$                     → Full-line tag   (lines starting with @)
  [tag args]                      → Inline tag      (square brackets)
  text                            → Regular text    (anything else)
  \s+                             → Whitespace      (ignored)
```

**How it loops:**
```
while (match = topLevelRegex.exec(file)):
  advance fileIndex to regex.lastIndex
  
  switch on first character of match:
    ';' → push {type: ";", text: comment}
    '*' → push {type: "*", id: linkName}
    '@' or '[' → parse arguments, then call InterpretCommand()
          ↑ THIS IS THE KEY DECISION POINT
          InterpretCommand returns true/false:
            false = keep tokenizing
            true  = STOP (we hit a page break, call, or halt)
    default → regular text, also passed to InterpretCommand()
```

**Tag Argument Parsing (`ParseTag`):**
A second regex extracts `key=value` pairs from the tag's argument string:
```
@fadein storage=bg_001 time=500 layer=base
         ↓ ParseTag
{ storage: "bg_001", time: "500", layer: "base" }
```
Quoted strings (`"value"`) have their quotes stripped. A bare `*` becomes `args["*"] = true` (used for macro argument pass-through).

**Decision Point — Why one giant regex instead of a proper lexer?**
Performance. KiriKiri scripts can be thousands of lines. A compiled regex with the sticky flag is one of the fastest ways to tokenize text in JavaScript. The trade-off is readability — that regex is essentially unreadable, but it doesn't need to change because the `.ks` format is frozen.

**Vue relevance:** If you build a custom parser for MNEMOSYNE, you would write a similar function. But since you're designing your own format (not emulating a legacy one), you can use a simpler line-by-line approach.

---

## 9. The Interpreter — Macros, Jumps, and State

**File:** `interpreter/parse/interpreter.js`

The interpreter is called for every tag and text token. It mutates a `gameState` object and decides whether to continue tokenizing or stop.

**The gameState object:**
```js
gameState = {
  macros: {},           // { macroName: [array of tag tokens] }
  stackFrame: {
    storage: "セ1-001", // current file name
    file: "...",        // raw file text
    fileIndex: 1234,    // current position in file
    returnFrame: {...}, // pointer to parent stack frame (for call/return)
    macroBuilder: null, // set during [macro]...[endmacro] blocks
  }
}
```

**The interpretation loop:**

```
InterpretCommand(tokens, gameState, tag):

  1. MACRO BUILDING MODE:
     If stackFrame.macroBuilder is set, we're inside a [macro]...[endmacro] block.
     → Just collect tokens into the macro array.
     → When [endmacro] is hit, save to gameState.macros and exit build mode.

  2. TEXT TOKENS:
     If tag.type === "t" → just push to output tokens, return false (continue).

  3. MACRO EXPANSION:
     If tag.command exists in gameState.macros:
     → Get the macro's token array.
     → For each token in the macro, substitute %argName placeholders
       with the calling tag's actual arguments.
     → Handle the * (splat) argument: pass through all unmatched args.
     → Recursively call InterpretCommand for each expanded token.
     → If any expanded token returns true (halt), propagate the halt.

  4. BUILT-IN COMMANDS:
     switch(tag.command.toLowerCase()):
       "jump":   Push tag to output. (Jump is partially disabled/TODO.)
       "call":   Push a new stack frame. Create a {type:"call"} token
                 that tells the renderer to load another script file.
                 Return TRUE → stop tokenizing this file.
       "return": Pop back to the parent stack frame (returnFrame).
                 Resume tokenizing from where the parent left off.
                 Return TRUE.
       "iscript"/"endscript": Skip embedded TJS script blocks entirely.
       "macro":  Enter macro building mode.
       "erasemacro": Delete a macro.
       "s":      The [s] tag = STOP. This is the page-end marker.
                 Return TRUE → stop tokenizing.
       default:  Push to output, return false (continue).
```

**Decision Point — The Call Stack:**
This is essentially a manually-implemented function call stack. When `[call storage=otherFile.ks]` is encountered:
1. The current position is saved in `stackFrame`.
2. A new `stackFrame` is pushed with `returnFrame` pointing back.
3. The `ScriptLoader` React component sees the `{type: "call"}` token and renders *another* `<ScriptLoader>` component to fetch and parse the called file.
4. When that file hits `[return]`, it pops back to the parent frame.

**Vue equivalent:** You would model this as a recursive composable call or a stack array in your Pinia store.

**Decision Point — Why is [jump] disabled?**
The comment says `"TODO: re-enable jump statements once 'cond' tests are implemented"`. Jump without conditional logic causes infinite loops in some scripts. KiriKiri's original engine had `cond=` (conditional) arguments on tags, which this web port hasn't fully implemented yet.

---

## 10. The Renderer — Tokens Into Visuals

**File:** `interpreter/parse/render.js` (502 lines — the largest and most complex file)

This is the heart of the engine. It takes the flat array of tokens and produces:
1. **React elements** (text, line breaks, debug tags) — Vue equivalent: VNodes or template output
2. **Layer timelines** (arrays of keyframes for visual animations)
3. **BGM timelines** (arrays of keyframes for background music)
4. **SE timelines** (arrays of keyframes for sound effects)

**The Render State:**
```js
renderState = {
  bgm: undefined,            // currently active BGM track name
  se: {},                     // currently active looping sound effects
  sectionID: 0,              // which "page section" we're building
  layers: [],                 // layers[layerIndex] = [{keyframe}, {keyframe}, ...]
  bgmTimeline: [],            // [{time, bgm, fadeTime}, ...]
  seTimeline: [],             // [{time, sounds: {name: {fadeIn, loop, ...}}}, ...]
  buildingSavePoints: [],     // save points being collected for current section
  savePoints: [],             // save points assigned to the previous section
  tokens: [],                 // accumulated tokens awaiting processing
  section: [],                // accumulated React elements for current section
  ruby: null,                 // pending ruby (furigana) annotation
}
```

**The two-pass architecture:**

The `RenderChunk` function processes tokens in TWO passes:

### Pass 1 — Timeline Construction (Visual + Audio commands)
Iterates over all tags and builds the animation/audio timelines:

| Tag | What it does |
|:---|:---|
| `[say storage=voice.ogg]` | Pushes a voice clip to the SE timeline |
| `[playbgm storage=track.ogg]` | Pushes a BGM change to the BGM timeline |
| `[stopbgm]` / `[fadeoutbgm]` | Pushes BGM stop (with optional fade duration) |
| `[playse]` / `[fadeinse]` | Pushes a sound effect (with loop/fade support) |
| `[stopse]` / `[fadeoutse]` | Stops/fades out a sound effect |
| `[image storage=bg.png layer=0]` | Pushes a new keyframe to that layer's timeline (static placement) |
| `[fadein storage=bg.png time=500]` | Duplicates the last keyframe, pushes new image, advances time by 500ms (crossfade) |
| `[dash storage=bg.png cx=c cy=c mag=2]` | Camera zoom effect: pushes a start keyframe at scale 1, advances time, pushes end keyframe at scale 2 |
| `[move layer=3 path=(x,y,opacity) time=1000]` | Path-based sprite movement: parses coordinate nodes from a path string, creates keyframes along the path |
| `[wait time=500]` | Advances the internal `time` counter by 500ms |
| `[wm]` | Waits for all pending move animations to complete |

**Decision Point — The `time` variable:**
The renderer maintains an internal millisecond counter (`time`). Every animation command advances this counter. This is how it knows that "image A should crossfade to image B over 500ms, then 200ms later a sound effect plays." The `time` value is stamped into each keyframe.

**Decision Point — The `generateSection()` boundary:**
When a visual or audio command is encountered, `generateSection()` is called. This wraps everything accumulated so far into a `<ScrollDetect>` component (a section boundary). This is how the engine breaks a continuous script into discrete scroll-triggered segments.

Think of it like this: in your MNEMOSYNE click-to-advance model, every click processes one "line". In KiriKiri Web's scroll model, every scroll boundary processes one "section" (which may contain multiple lines of text but only one set of visual/audio changes).

### Pass 2 — Text Content Rendering
Iterates over the same tokens again and builds the actual visible text:

| Tag | What it renders |
|:---|:---|
| `[r]` | Line break (`<br/>`) — only if we haven't already generated a section boundary |
| `[cm]` | Triple line break (clear-and-margin) |
| `[align anchor=center]` | Centered text block |
| `[ruby text=フリガナ char=1]` | Sets a pending ruby annotation; the next text token will have furigana above it |
| `[ch text="&($0x00FC)"]` | Renders a single Unicode character from hex code |
| `[macro]...[endmacro]` | In debug mode, renders the macro definition |
| `[s]` | Renders "--- page generation halted at [s] ---" |
| `[return]` | No visible output (just a stack operation) |
| `*label` (save point) | Registers a save point anchor for the current section |

**The Ruby (Furigana) System:**
```
[ruby text=まどか char=2]円環
```
This renders as: 円環 with まどか as tiny text above the first 2 characters. The `renderState.ruby` object stores the annotation, and the next `appendText()` call wraps the text in `<ruby><rb>...<rt>...</ruby>` HTML tags.

**Decision Point — Why two passes?**
Animations and audio need to be processed first to build complete timelines before any rendering happens. Text rendering happens second because it needs to know where section boundaries fall (which are determined by animation commands). Separating the passes avoids ordering bugs.

---

## 11. Scroll Watcher — User Progression

**File:** `reader/scroll/watcher.js`

This is the **progression controller** — the equivalent of your `handleClick()` / `store.advance()` in MNEMOSYNE, but for a scroll-based model.

**It creates TWO React Contexts:**
```js
const AnimationProvider  // → consumed by Animation component (visual layers + audio)
const ScrollProvider     // → consumed by ScrollDetect components (section boundaries)
```

**Vue equivalent:** Two separate `provide()` calls:
```js
provide('animation', currentAnimationState)
provide('scroll', currentScrollState)
```

**How it tracks which section is visible:**

1. Each `<ScrollDetect>` component (rendered by `render.js`) registers itself with the watcher via `addAnchor(id, ref, savePoints)`.
2. Each `<ScrollDetect>` uses `IntersectionObserver` (via `react-intersection-observer`) to report when it enters or leaves the viewport.
3. When visibility changes, `onSectionVisibilityChange()` is called:
   - It tracks all currently visible sections in `this.visible`.
   - It picks the **highest-numbered** visible section as the active one.
   - It updates two pieces of state:
     - `nextVisible` — immediately updated (for scroll detector enable/disable logic)
     - `visible` — debounced by 200ms (for expensive animation/asset loading)

**Keyboard navigation:**
The watcher also listens for keyboard events:
- **Space/Enter/Down/Right** → scroll forward one section
- **Shift+Space/Shift+Enter/Up/Left** → scroll backward one section
- It calculates whether to do a full section jump or a partial scroll (40% of viewport height) based on whether the current section's text extends below the screen.

**Decision Point — Two-tier state update (`visible` vs `nextVisible`):**
The `nextVisible` state updates instantly so that nearby `<ScrollDetect>` observers can enable/disable themselves quickly (performance optimization). But `visible` — which triggers expensive image preloading — is debounced by 200ms to avoid loading assets during rapid scrolling. This is a smart performance trick.

**URL sync:**
When the active section changes, the URL hash is updated to include the save point label (e.g., `#scene001`). This means you can bookmark or share a URL and return to the exact scroll position.

---

## 12. ScrollDetect — The Section Boundary Sensor

**File:** `reader/scroll/detect.js`

Each section boundary is wrapped in a `<ScrollDetect>` component that:
1. On mount, registers itself with the `ScrollWatcher` via `addAnchor()`.
2. Wraps its children in an `<InView>` component (from `react-intersection-observer`).
3. When it enters/exits the viewport, it calls `scroll.onSectionChange()` to notify the watcher.

**Performance optimization — selective activation:**
Not all `<ScrollDetect>` observers are active at once. A page might have hundreds of sections, and having hundreds of active `IntersectionObserver`s kills performance. The component uses a mathematical trick:

```js
for (let mul = 1; mul <= Math.max(this.props.id, scrollID); mul *= 4) {
  if (id % mul === 0 && Math.abs(scrollID - id) <= mul) {
    makeActive = true
  }
}
```

This creates a **logarithmic activation pattern**: sections close to the current scroll position have all their observers active, but distant sections only activate every 4th, 16th, 64th observer, etc. This keeps the total active observer count at O(log n) instead of O(n).

**Vue equivalent:** You would implement this as a directive or a composable using `useIntersectionObserver()` from VueUse.

---

## 13. Animation — Layers, Keyframes, and CSS Transitions

**Files:** `reader/animation/animation.js`, `reader/animation/layer/layer.js`

### The Animation Orchestrator (`animation.js`)

When the `ScrollWatcher` updates the active section, the `Animation` component receives new timeline data via context. It then:

1. **Preloads all assets:**
   - Walks through every keyframe in every layer timeline and creates `new Image()` objects, waiting for `onload`.
   - Walks through BGM and SE timelines, creating `new Audio()` objects and waiting for `oncanplaythrough`.
   - Uses `Promise.race([abortPromise, Promise.all(promises)])` — if the user scrolls away before loading finishes, the abort promise resolves first and all half-loaded assets are cleaned up (`img.src = ""`).

2. **Records natural image dimensions:** After preloading, it stamps `naturalWidth` onto each keyframe's contents. This is used to scale images correctly (the original game used 800x600 resolution, so `naturalWidth / 8` gives the percentage width).

3. **Renders multiple Layers + AudioPlayer:**
   ```
   <div class="background-holder">
     <Layer layer=0 animation=[keyframes...] />    ← background
     <Layer layer=1 animation=[keyframes...] />    ← character sprite
     <Layer layer=2 animation=[keyframes...] />    ← overlay
     ...
   </div>
   <AudioPlayer bgmTimeline=[...] seTimeline=[...] />
   ```

4. **The blur hack:** The background is rendered FOUR times in different holders (`left`, `right`, `bottom`, `main`). The three extra copies are blurred and extend beyond the main viewport to create a soft-focus border effect (similar to Instagram's landscape photo backgrounds).

### The Layer Component (`layer.js`)

Each `Layer` receives an array of keyframes and plays through them using async/await:

```
async animate():
  1. Set initial keyframe (time=0, no transition)
  2. Force a browser repaint (requestAnimationFrame)
  3. For each subsequent keyframe:
     a. Calculate duration = keyframe.time - previousTime
     b. Update state with new keyframe (React re-renders the <img>)
     c. Sleep for `duration` ms (or until aborted)
```

**The CSS transition trick:**
The `<img>` element has its `style` set to:
```js
style={{
  transition: `all ${duration}ms ${easing}`,
  top: keyframe.top / 6 + "%",
  left: keyframe.left / 8 + "%",
  width: keyframe.contents.naturalWidth + "%",
  transform: keyframe.transform,
  opacity: keyframe.opacity,
}}
```

When React updates these style values, the browser's CSS transition engine smoothly interpolates between old and new values. **No JavaScript animation loop needed** — the browser does all the tweening natively.

**Crossfade between different images:**
When the image source changes (e.g., background swap), the component renders TWO `<img>` elements simultaneously:
- The **new** image with the new keyframe's styles
- The **old** image fading to `opacity: 0` over the transition duration

The `key` prop on each `<img>` includes a boolean `contents.key` that alternates (`true`/`false`) to force React to create a new DOM element for the new image rather than reusing the old one.

**Vue equivalent:** You would use a `<Transition>` component with `mode="out-in"` or manually manage two image elements with CSS transitions in your template.

---

## 14. Audio — BGM, Voice, and Sound Effects

**Files:** `reader/animation/audio/audio-player.js`, `reader/animation/audio/audio.js`

### AudioPlayer (`audio-player.js`) — The Mixer

The AudioPlayer manages three categories of audio simultaneously:
- `playingBgm` — a single BGM track (or null)
- `playingSe[]` — array of currently playing sound effects
- `fadingOut[]` — array of sounds that are fading out (about to be removed)

**Each sound gets a unique numeric ID** from a pool (`getSoundIDPool`), which prevents React from confusing audio elements when sounds start/stop rapidly.

**BGM Timeline Playback:**
```
async runBGMTimeline():
  for each keyframe in bgmTimeline:
    sleep(keyframe.time - previousTime)
    if BGM changed:
      move current playingBgm → fadingOut (with fade duration)
      set new playingBgm
```

**SE Timeline Playback:**
```
async runSeTimeline():
  clear all non-looping SEs (move to fadingOut)
  for each keyframe in seTimeline:
    sleep(keyframe.time - previousTime)
    stop sounds marked for stopping (move to fadingOut)
    start new sounds (add to playingSe)
    skip adding looping sounds that are already playing
```

**iOS Workaround:**
iOS limits the number of concurrent `<audio>` elements. The code pre-creates 12 audio slots on iOS (`[...Array(12).keys()]`) and reuses them, while on other platforms it dynamically creates/destroys elements.

### Audio (`audio.js`) — The Individual Player

Each `<Audio>` component wraps a `<ReactAudioPlayer>` (which wraps the native `<audio>` element) and handles:
- **Fade-in:** A `setInterval` loop that ramps volume from 0 to target over `fadeIn` ms (in 5ms steps).
- **Fade-out:** The reverse — ramps from current volume to 0, then calls `onEnded()` to remove itself.
- **Volume calculation:** `0.5 * categoryVolume * fadeIn * fadeOut` — so the user's volume slider, fade-in progress, and fade-out progress all multiply together.
- **Multiple formats:** Each audio element has two `<source>` children (`.ogg` and `.m4a`) for cross-browser compatibility.

**Decision Point — Why manual fade loops instead of Web Audio API?**
The Web Audio API's `GainNode.linearRampToValueAtTime()` would be more efficient, but using simple `<audio>` elements with manual fading is far more compatible across browsers and requires no AudioContext management. Your MNEMOSYNE already uses the Web Audio API (via `GameAudioEngine`), which is more modern but requires the user-gesture gate you already handle.

---

## 15. Choice/Branching — End-of-Page Navigation

**File:** `reader/choice/choice.js`

After the script finishes rendering (the `[s]` stop tag is hit and `onPageReady()` fires), the `<Choice>` component renders navigation buttons at the bottom of the page.

It reads from `graphLogic` (a pre-generated object in `scene-index.js`) which maps each scene ID to its branching structure:

```js
graphLogic = {
  "セ1-001": {
    goto: "セ1-002"              // simple: one "Continue" button
  },
  "セ3-005": {
    choices: [                    // branching: multiple buttons
      { eng: "Go to school", jp: "学校に行く", then: { goto: "セ3-006" } },
      { eng: "Stay home",    jp: "家にいる",   then: { goto: "セ3-007" } },
    ]
  },
  "セ5-010": {
    conditions: [                 // conditional: depends on game flags
      { if: "saber_alive", then: { goto: "セ5-011" } },
      { if: null,          then: { goto: "セ5-012" } },  // else
    ]
  }
}
```

The `renderLogic()` function recursively renders this structure:
- `goto` → a single `<Link>` button ("Continue" or the choice text)
- `choices` → multiple buttons, one per choice
- `conditions` → nested rendering (in debug mode, shows the condition; normally just follows the path)

**Decision Point — Pre-generated branching vs. runtime:**
KiriKiri Web pre-computes ALL branching logic into `scene-index.js` at build time. This means the web version **does not actually track player flags or game state** — it just shows all possible paths. This is a deliberate simplification: the project's goal is to let people read/share specific scenes, not to replicate the full game-state system.

Your MNEMOSYNE takes the opposite (and better) approach for an interactive VN: affinity is tracked at runtime and routing is dynamically computed from actual player choices.

---

## 16. Resource Lookup — Dynamic Asset Resolution

**File:** `resources/lookup.js`

This module resolves logical asset names to actual URLs. It handles multiple variants of every asset:

**Script lookup (`LocateScript`):**
```
LocateScript("セ1-001", "eng")
  → Is it in sharedScriptsMap? → /static/scripts/セ1-001.ks.gz
  → Is it an H-script?        → /static/scripts/eng/h/セ1-001.ks.gz
  → Default                   → /static/scripts/eng/セ1-001.ks.gz
```

**BGM lookup (`LocateBGM`):**
```
LocateBGM("bgm01", "vita")
  → Check if Vita version exists in BGM dictionary
  → If not, fall back: vita → ps2 → original
  → /static/bgm/vita/bgm01
```

**Image lookup (`LocateImage`):**
```
LocateImage("bg_church", "eng", mature=true, h=2, hArtist="1")
  → English override exists?  → /static/images/eng/bg_church.webp
  → Mature variant exists?    → /static/images/mature/bg_church.webp
  → H-scene, specific artist? → /static/images/h/bishopcruz/bg_church.webp
  → H-scene, generic?         → /static/images/h/bg_church.webp
  → Default                   → /static/images/bg_church.webp
```

**Route/Path conversion helpers:**
- `PathToID({route: "fate", day: "3", chapter: "5"})` → `"セ3-5"`
- `IDToPath("セ3-5", "eng")` → `"fate/3rd-day/5"`

These conversions handle English ordinal suffixes (`1st`, `2nd`, `3rd`, `4th`...) and Japanese day formats (`3日目`).

**Decision Point — Why this level of asset indirection?**
Fate/Stay Night has been released on multiple platforms over 20 years, each with different art, music, and translations. The lookup system lets users choose their preferred version of each asset category through the settings menu, and the engine seamlessly resolves the correct file. Your MNEMOSYNE doesn't need this complexity since you control all assets, but the pattern of centralizing asset resolution into one module is worth adopting.

---

## 17. Full Data Flow Diagram

```
User navigates to /fate/3rd-day/5
        │
        ▼
    ┌─────────┐
    │ Router  │  Matches /:route/:day/:chapter
    └────┬────┘
         │ key="fate/3/5" (forces fresh mount)
         ▼
    ┌─────────┐
    │ Reader  │  Renders ScrollWatcher + Animation + ScriptLoader + Choice
    └────┬────┘
         │
         ▼
  ┌──────────────┐
  │ ScriptLoader │
  └──────┬───────┘
         │ 1. fetch(マクロ.ks.gz)    ← macro library
         │ 2. fetch(セ3-005.ks.gz)   ← scene script
         │
         ▼
  ┌───────────┐     Calls InterpretCommand() for each tag/text
  │ Tokenize  │──────────────────────────────────────────────────┐
  └─────┬─────┘                                                  │
        │ produces: [{type:"@", command:"image", args:{...}},    │
        │           {type:"t", text:"Shirou looked up..."},      │
        │           {type:"@", command:"playbgm", args:{...}},   │
        │           ...]                                          │
        ▼                                                        ▼
  ┌──────────┐                                           ┌─────────────┐
  │  Render  │  Pass 1: Build timelines                  │ Interpreter │
  │          │  Pass 2: Build text content               │  (macros,   │
  │          │                                           │  call/ret,  │
  │          │  Outputs:                                 │  state)     │
  │          │   • React elements (text sections)        └─────────────┘
  │          │   • layers[] (visual keyframes)
  │          │   • bgmTimeline[] (music keyframes)
  │          │   • seTimeline[] (sound keyframes)
  └────┬─────┘
       │
       │ Each section wrapped in <ScrollDetect>
       ▼
  ┌───────────────┐
  │ ScrollWatcher │  Tracks which section is in viewport
  │               │  Updates active section via Context
  └───────┬───────┘
          │
     ┌────┴─────┐
     ▼          ▼
┌──────────┐ ┌─────────────┐
│Animation │ │ AudioPlayer │
│          │ │             │
│ Layer 0  │ │ BGM stream  │
│ Layer 1  │ │ Voice stream│
│ Layer 2  │ │ SFX streams │
│  ...     │ │             │
│ (CSS     │ │ (fade in/out│
│ transit) │ │  loops)     │
└──────────┘ └─────────────┘
```

---

## 18. Key Design Decisions & Why They Were Made

| # | Decision | Why | MNEMOSYNE Relevance |
|:--|:---------|:----|:--------------------|
| 1 | **Scroll-based progression** instead of click-to-advance | Designed for reading/sharing scenes from an existing VN, not for interactive gameplay. Scrolling lets you skim. | You prefer click-to-advance (proper VN feel). Could offer scroll as an optional "read mode." |
| 2 | **No global state store** (no Redux/Pinia equivalent) | The app's state is simple enough to live in React Context. There are only two "stores": Options and ScrollWatcher. | Your Pinia stores (dialogue, affinity, save) are more appropriate for an interactive VN with actual game state. |
| 3 | **Pre-generated scene index** instead of runtime parsing of game logic | The VN's branching structure is static and known at build time. Pre-computing it avoids runtime complexity. | Your runtime affinity system is better for a dynamic/interactive experience. |
| 4 | **CSS transitions for animation** instead of Canvas/WebGL | Dead simple, works everywhere, no animation library needed. Browser does all the tweening. | Excellent approach to adopt. CSS transitions are framework-agnostic and work identically in Vue. |
| 5 | **`<audio>` elements with manual fade** instead of Web Audio API | Maximum browser compatibility. Web Audio API has quirks on Safari/iOS. | You already use Web Audio API which gives you more control (panning, effects). Keep it, but consider `<audio>` fallback. |
| 6 | **Single monolithic regex tokenizer** | Performance for parsing large legacy script files. | You're designing your own format — use a cleaner line-by-line parser for maintainability. |
| 7 | **Macro system via call/return stack** | KiriKiri's `.ks` format relies heavily on macros. The web port must support them to parse existing scripts. | You could implement a simpler "template" or "include" system without the full call stack. |
| 8 | **Assets fetched on-demand from CDN** | The full game's assets are ~10GB. Can't bundle them. Lazy loading via network proxy is the only option. | You bundle assets with Vite, which is simpler and faster for a smaller project. |
| 9 | **Cookies for settings persistence** | Lightweight, accessible from server during proxy requests. | Your `localStorage` approach is cleaner for a client-only app. |
| 10 | **`key` prop forcing component re-creation on route change** | Guarantees zero state leakage between scenes. | Use `:key="route.path"` on your `<RouterView>` for the same guarantee. |
