import { defineStore } from "pinia";


const neutral = { love: 0, hate: 0 }

export const useAffinityStore = defineStore('affinity', {
    state: () => ({
        characters: {
            mash: {...neutral},
            rin: {...neutral}
        },
    }),

    getters: {
        get: (state) => (charId) => state.characters[charId] ?? { ...neutral }
    },
    actions: {
        adjust(charId, delta) {
            if (!this.characters[charId]) {
                this.characters[charId] = neutral;
            }
            for (key in delta) {
                this.characters[charId][key] = (this.characters[charId][key] ?? 0) + delta[key]
            }
        }
    }
})
