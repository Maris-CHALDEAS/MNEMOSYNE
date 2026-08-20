import aozaki from '@/assets/sprites/aozaki/AKI_T01A.png'
import background from '@/assets/backgrounds/BG_03A.jpg'

export default {
    lines: [
        { speaker: 'Aozaki', text: '[SCENE 02 • INSERT BRIEFING DIALOGUE]', sprite: aozaki, spritePos: 'right', background },
        {
            speaker: 'Aozaki',
            text: '[SCENE 02 • INSERT INVESTIGATION PROMPT]',
            sprite: aozaki,
            spritePos: 'right',
            choices: [
                { label: '[INVESTIGATE]', next: 2, affinity: { char: 'aozaki', love: 1 } },
                { label: '[WAIT]', next: 2, affinity: { char: 'aozaki', hate: 1 } },
            ],
        },
        { speaker: 'Aozaki', text: '[SCENE 02 • INSERT CLUE REVEAL]', sprite: aozaki, spritePos: 'right', background },
    ],
    nextScene: '/demo/hallway',
}
