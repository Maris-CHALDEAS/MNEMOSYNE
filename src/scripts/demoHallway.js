import rin from '@/assets/sprites/rin/rin-normal.png'
import background from '@/assets/backgrounds/BG_05A.jpg'

export default {
    lines: [
        { speaker: 'Rin', text: '[SCENE 03 • INSERT HALLWAY ENCOUNTER]', sprite: rin, spritePos: 'left', background },
        {
            speaker: 'Rin',
            text: '[SCENE 03 • INSERT RELATIONSHIP CHOICE PROMPT]',
            sprite: rin,
            spritePos: 'left',
            choices: [
                { label: '[HELP]', next: 2, affinity: { char: 'rin', love: 1 } },
                { label: '[REFUSE]', next: 2, affinity: { char: 'rin', hate: 1 } },
            ],
        },
        { speaker: 'Rin', text: '[SCENE 03 • INSERT SHARED OUTCOME]', sprite: rin, spritePos: 'left', background },
    ],
    nextScene: '/demo/observation',
}
