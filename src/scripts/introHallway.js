import rinAngry from '@/assets/sprites/rin/rin-angry.png'
import rinFlustered from '@/assets/sprites/rin/rin-flustered.png'
import rinNormal from '@/assets/sprites/rin/rin-normal.png'
import rinCasualBlushClose from '@/assets/sprites/rin/rin-casual-06b-blush-close.png'


export default {
    lines: [
        {
            speaker: 'Rin',
            text: "I love you, Sakura. I was always watching you, and I always wanted you to smile. ...Yeah. I wanted to believe that the harder it was for me, the easier it would be for you. Because of that...I never even had time to think that anything was painful.",
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
    nextScene: (affinity) => {
        const rin = affinity.characters.rin;
        if( rin.love >= 5 && rin.hate <= 2) return '/rin-love-route-1b'
        if( rin.love >= 5 && rin.hate >= 3) return '/rin-love-route-1c'
        if( rin.love <= 3 && rin.hate >= 3) return '/rin-bad-route-1b'
        return '/rin-neutral'
    }
}
