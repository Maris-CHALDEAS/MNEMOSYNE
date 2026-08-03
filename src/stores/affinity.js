import { defineStore } from "pinia";


export const useAffinityStore = defineStore('affinity', {
    state: () => ({
        characters: {
            mash: { love: 0, hate: 0 },
            rin: { love:0, hate: 0 }
        }
    })
})
