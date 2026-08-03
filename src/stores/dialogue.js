import { defineStore } from "pinia";
import { useAffinityStore  } from '@/stores/affinity'


export const useDialogueStore = defineStore('dialogue', {
    state: () => ({
        scriptId: null,
        lineIndex: 0,
        script: [],
        nextScene: null,
        finished: false,
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
        loadScript(id, scriptData) {
            this.scriptId = id;
            this.script = scriptData.lines;
            this.lineIndex = 0;
            this.nextScene = scriptData.nextScene ?? null;
            this.finished = false
        },

        advance() {
            if (this.currentLine?.choices) return;
            if (this.isEnd) {
                this.lineIndex++;
                this.finished = true;
                return;
            }
            this.lineIndex++;
        },

        choose(choice) {
            if(choice.affinity) {
                const {char, ...deltas} = choice.affinity
                useAffinityStore().adjust(char, deltas)
            }
            this.lineIndex = choice.next;
        }
    }
})
