// Copy this file when creating a new dialogue scene.
// Choice affinity changes are applied by the dialogue store.
// The nextScene function receives the live affinity store state.
import characterNeutral from '@/assets/sprites/rin/rin-normal.png'
import background from '@/assets/Chaldea_HQ_Hallway.webp'

export default {
    bgMusic: '/assets/bgms/bgm.mp3',
    lines: [
        {
            speaker: 'Character',
            text: 'Opening line.',
            sprite: characterNeutral,
            spritePos: 'left',
            background,
        },
        {
            speaker: 'Character',
            text: 'Choose your response.',
            sprite: characterNeutral,
            spritePos: 'left',
            choices: [
                {
                    label: 'Kind response',
                    next: 2,
                    affinity: { char: 'rin', love: 1 },
                },
                {
                    label: 'Cold response',
                    next: 2,
                    affinity: { char: 'rin', hate: 1 },
                },
            ],
        },
        {
            speaker: 'Character',
            text: 'The scene ends here.',
            sprite: characterNeutral,
            spritePos: 'left',
            background,
        },
    ],
    nextScene: (affinity) => {
        const character = affinity.characters.rin ?? { love: 0, hate: 0 }
        return character.love > character.hate
            ? '/rin-good-end'
            : '/rin-bad-end'
    },
}
