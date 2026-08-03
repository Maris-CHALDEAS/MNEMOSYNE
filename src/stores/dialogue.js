import { defineStore } from "pinia";

export const useDialogueStore = defineStore('dialogue', {
    state: () => ({
        scriptId: null,
        lineIndex: 0,
        script: [],
    }),

    getters: {
        currentLine(state) {
            return state.script[state.lineIndex] || null;
        },
        isEnd(state) {
            return state.lineIndex >= state.script.length -1;
        },
    },

    actions: {
        loadScript(id, lines) {
            this.scriptId = id;
            this.script = lines;
            this.lineIndex = 0;
        },

        advance() {
            if (this.currentLine?.choices) return;
            if (!this.isEnd) this.lineIndex++;
        },

        choose(nextIndex) {
            this.lineIndex = nextIndex;
        }
    }
})
