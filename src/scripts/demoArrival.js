import mash from '@/assets/sprites/mash/st_face_0020_000.png'
import background from '@/assets/backgrounds/BG_01A.jpg'

export default {
    lines: [
        { speaker: 'Mash', text: '[SCENE 01 • INSERT ARRIVAL DIALOGUE]', sprite: mash, spritePos: 'left', background },
        {
            speaker: 'Mash',
            text: '[SCENE 01 • INSERT FIRST CHOICE PROMPT]',
            sprite: mash,
            spritePos: 'left',
            choices: [
                { label: '[CHOICE A]', next: 2, affinity: { char: 'mash', love: 1 } },
                { label: '[CHOICE B]', next: 2, affinity: { char: 'mash', hate: 1 } },
            ],
        },
        { speaker: 'Mash', text: '[SCENE 01 • INSERT CONVERGENCE DIALOGUE]', sprite: mash, spritePos: 'left', background },
    ],
    nextScene: '/demo/briefing',
}
