import aozaki from '@/assets/sprites/aozaki/AKI_T08A.png'
import background from '@/assets/backgrounds/BG_08A.jpg'
import bgMusic from './demoBgm'

export default {
    bgMusic,
    lines: [
        { speaker: 'Aozaki', text: '[SCENE 04 • INSERT OBSERVATION DIALOGUE]', sprite: aozaki, spritePos: 'right', background },
        {
            speaker: 'Aozaki',
            text: '[SCENE 04 • INSERT RISK CHOICE PROMPT]',
            sprite: aozaki,
            spritePos: 'right',
            choices: [
                { label: '[TAKE THE RISK]', next: 2, affinity: { char: 'aozaki', love: 1 } },
                { label: '[PLAY IT SAFE]', next: 2, affinity: { char: 'aozaki', hate: 1 } },
            ],
        },
        { speaker: 'Aozaki', text: '[SCENE 04 • INSERT REVEAL OR CONSEQUENCE]', sprite: aozaki, spritePos: 'right', background },
    ],
    nextScene: '/demo/decision',
}
