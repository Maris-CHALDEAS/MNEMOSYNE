import { defineStore } from "pinia";

export const saveGameState = defineStore('save', {
    state: () => ({
        sceneState: null,
        lineIndex : 0,
        characters: {},
    }),

    getters: {
        currentScene(state) {
            return state.sceneState || null;
        },
        currentLine(state) {
            return state.lineIndex;
        },
    },

    actions: {
        saveGame(pathName, lineIndex, characters) {
            // Accept either affinity.characters or the complete affinity
            // store state, but persist one consistent shape.
            const characterState = characters?.characters ?? characters ?? {};
            this.sceneState = pathName;
            this.lineIndex = lineIndex;
            this.characters = JSON.parse(JSON.stringify(characterState));
            let temp = {sceneState: this.sceneState, lineIndex: this.lineIndex, characters: this.characters}
            let curr = JSON.stringify(temp);
            localStorage.setItem("mnemosyne-save", curr);
        },
        loadGame() {
            let curr = localStorage.getItem("mnemosyne-save");
            if (curr == null) {
                this.sceneState = null;
                this.lineIndex = 0;
                this.characters = {};
            } else {
                curr = JSON.parse(curr);
                this.sceneState = curr.sceneState;
                this.lineIndex = curr.lineIndex;
                // Support older saves that accidentally persisted the whole
                // affinity store under characters.characters.
                this.characters = curr.characters?.characters ?? curr.characters ?? {};
            }
        },
        resetGame() {
            localStorage.removeItem("mnemosyne-save");
            this.$reset();
        }
    }
})
