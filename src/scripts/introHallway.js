import rinAngry from '@/assets/sprites/rin/rin-angry.png'
import rinFlustered from '@/assets/sprites/rin/rin-flustered.png'
import rinNormal from '@/assets/sprites/rin/rin-normal.png'
import rinCasualBlushClose from '@/assets/sprites/rin/rin-casual-06b-blush-close.png'


export default {
    lines: [
        {
            speaker: 'Rin',
            text: "hello i guess",
            sprite: rinAngry,
            spritePos: 'left',
        },
        {
            speaker: 'You',
            text: "Traffic. Sorry.",
            sprite: rinNormal, // sprite persists until a line changes it
            spritePos: 'right',
        },
        {
            speaker: 'Rin',
            text: "Sure. Whatever.",
            sprite: rinFlustered,
            spritePos: 'right',
            choices: [
                { label: "Apologize again", next: 3, affinity: { char: 'rin', love: 2, hate: 1 }},
                { label: "Say nothing", next: 4 },
            ],
        },

    {
            speaker: 'You',
            text: "I really am sorry.",
            sprite: rinFlustered,
            spritePos: 'right',
        },
        {
            speaker: 'Rin',
            text: "Are you going to help me or not?",
            choices: [
                { label: "Of course I will.", next: 5, affinity: { char: 'rin', love: 1 } },
                { label: "Not my problem.",   next: 5, affinity: { char: 'rin', hate: 1 } },
            ],
        },
        {
            speaker: 'Rin',
            text: "...",
            sprite: rinCasualBlushClose,
            spritePos: 'right',
        },
    ],
    nextScene: '/RinHallway2'
}
