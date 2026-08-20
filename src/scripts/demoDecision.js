import mash from '@/assets/sprites/mash/st_face_0020_202.png'
import background from '@/assets/backgrounds/BG_11A.jpg'
import bgMusic from './demoBgm'

export default {
    bgMusic,
    lines: [
        { speaker: 'Mash', text: '[SCENE 05 • INSERT FINAL SETUP DIALOGUE]', sprite: mash, spritePos: 'left', background },
        {
            speaker: 'Mash',
            text: '[SCENE 05 • INSERT FINAL DECISION PROMPT]',
            sprite: mash,
            spritePos: 'left',
            choices: [
                { label: '[TRUST]', next: 2, affinity: { char: 'mash', love: 1 } },
                { label: '[DOUBT]', next: 2, affinity: { char: 'mash', hate: 1 } },
            ],
        },
        { speaker: 'Mash', text: '[SCENE 05 • INSERT ROUTE HANDOFF]', sprite: mash, spritePos: 'left', background },
    ],
    nextScene: (affinity) => {
        const values = Object.values(affinity.characters)
        const love = values.reduce((total, character) => total + (character.love ?? 0), 0)
        const hate = values.reduce((total, character) => total + (character.hate ?? 0), 0)
        return love >= hate ? '/rin-good-end' : '/rin-bad-end'
    },
}
