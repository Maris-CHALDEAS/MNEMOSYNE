import rinAngry         from '@/assets/sprites/rin/rin-angry.png'
import rinNormal        from '@/assets/sprites/rin/rin-normal.png'
import rinFlustered     from '@/assets/sprites/rin/rin-flustered.png'
import rinBlush         from '@/assets/sprites/rin/rin-casual-06b-blush-close.png'
import rinSmug          from '@/assets/sprites/rin/rin-casual-03a-close.png'
import rinSurprised     from '@/assets/sprites/rin/rin-casual-08b-close.png'
import rinSad           from '@/assets/sprites/rin/rin-casual-11a-close.png'
import rinSadBlush      from '@/assets/sprites/rin/rin-casual-11a-blush-close.png'
import rinCold          from '@/assets/sprites/rin/rin-casual-01a-close.png'
import rinHappy         from '@/assets/sprites/rin/rin-casual-02a-close.png'

//  Line index map (for choice.next references):
//  0  – Rin catches up to you
//  1  – "I didn't expect you to follow"
//  2  – CHOICE A: follow / ditch her
//  3  –   (followed) "Don't read too much into it"
//  4  –   CHOICE B: "Promise?" / "Don't make promises"
//  5  –     (promised)  "...Fine."
//  6  –     (no promise) "You're hopeless."
//  7  –   (ditched) "Where do you think you're going?"
//  8  –   CHOICE C: apologise / walk faster
//  9  –     (apologised) "...At least you're honest."
//  10 –     (walked faster) "..."  [Rin gives up]
//  11 – Rin stops at the door — shared converge
//  12 – "Come back tomorrow."
//  13 – CHOICE D: "I will." / "Maybe." / "I can't."
//  14 –   (will)  "Good."   [love+1]
//  15 –   (maybe) "..."     [neutral]
//  16 –   (can't) "Then don't." [hate+1]
//  17 – END line — "Just go." [converge from 14/15/16]

export default {
    lines: [
        // 0
        {
            speaker: 'Rin',
            text: "Hey. Wait.",
            sprite: rinAngry,
            spritePos: 'left',
        },
        // 1
        {
            speaker: 'Rin',
            text: "I didn't expect you to actually stick around after that.",
            sprite: rinSurprised,
            spritePos: 'left',
        },
        // 2 — CHOICE A
        {
            speaker: 'Rin',
            text: "Well? Are you going to walk with me or not?",
            sprite: rinCold,
            spritePos: 'left',
            choices: [
                { label: "Walk with her.",    next: 3,  affinity: { char: 'rin', love: 1 } },
                { label: "You can manage.",   next: 7,  affinity: { char: 'rin', hate: 1 } },
            ],
        },
        // 3
        {
            speaker: 'Rin',
            text: "Don't read too much into it. I just need someone to carry these.",
            sprite: rinSmug,
            spritePos: 'left',
        },
        // 4 — CHOICE B
        {
            speaker: 'Rin',
            text: "Try not to be useless for once.",
            sprite: rinSmug,
            spritePos: 'left',
            choices: [
                { label: '"I\'ll do my best."', next: 5, affinity: { char: 'rin', love: 1 } },
                { label: '"No promises."',      next: 6, affinity: { char: 'rin', hate: 1 } },
            ],
        },
        // 5
        {
            speaker: 'Rin',
            text: "...Fine. Just don't slow me down.",
            sprite: rinBlush,
            spritePos: 'left',
        },
        // 6
        {
            speaker: 'Rin',
            text: "You're hopeless.",
            sprite: rinAngry,
            spritePos: 'left',
        },
        // 7
        {
            speaker: 'Rin',
            text: "Where do you think you're going?",
            sprite: rinAngry,
            spritePos: 'left',
        },
        // 8 — CHOICE C
        {
            speaker: 'Rin',
            text: "I'm talking to you.",
            sprite: rinAngry,
            spritePos: 'left',
            choices: [
                { label: '"Sorry. I wasn\'t thinking."', next: 9,  affinity: { char: 'rin', love: 1 } },
                { label: '(Keep walking.)',              next: 10, affinity: { char: 'rin', hate: 2 } },
            ],
        },
        // 9
        {
            speaker: 'Rin',
            text: "...At least you're honest.",
            sprite: rinSad,
            spritePos: 'left',
        },
        // 10
        {
            speaker: 'Rin',
            text: "...",
            sprite: rinSad,
            spritePos: 'left',
        },
        // 11 — converge point: Rin stops at the door
        {
            speaker: 'Rin',
            text: "This is my stop.",
            sprite: rinNormal,
            spritePos: 'left',
        },
        // 12
        {
            speaker: 'Rin',
            text: "Come back tomorrow. There's more to sort out.",
            sprite: rinCold,
            spritePos: 'left',
        },
        // 13 — CHOICE D (final)
        {
            speaker: 'Rin',
            text: "Well?",
            sprite: rinCold,
            spritePos: 'left',
            choices: [
                { label: '"I\'ll be here."',      next: 14, affinity: { char: 'rin', love: 1 } },
                { label: '"...Maybe."',           next: 15 },
                { label: '"I can\'t promise that."', next: 16, affinity: { char: 'rin', hate: 1 } },
            ],
        },
        // 14
        {
            speaker: 'Rin',
            text: "Good.",
            sprite: rinHappy,
            spritePos: 'left',
        },
        // 15
        {
            speaker: 'Rin',
            text: "...",
            sprite: rinSadBlush,
            spritePos: 'left',
        },
        // 16
        {
            speaker: 'Rin',
            text: "Then don't.",
            sprite: rinAngry,
            spritePos: 'left',
        },
        // 17 — final shared line
        {
            speaker: 'Rin',
            text: "Just go.",
            sprite: rinCold,
            spritePos: 'left',
        },
    ],

    // Dynamic routing based on cumulative affinity across BOTH hallway scenes
    nextScene: (affinity) => {
        const rin = affinity.characters.rin
        const { love = 0, hate = 0 } = rin

        if (love >= 4 && hate <= 1) return '/rin-good-end'
        if (love >= 3 && hate <= 3) return '/rin-neutral-end'
        if (hate >= 4)              return '/rin-bad-end'
        return '/rin-neutral-end'
    },
}
