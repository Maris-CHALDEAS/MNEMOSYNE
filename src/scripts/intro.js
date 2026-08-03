import rinAngry from '@/assets/sprites/rin/rin-angry.png'
import rinFlustered from '@/assets/sprites/rin/rin-flustered.png'
import rinNormal from '@/assets/sprites/rin/rin-normal.png'
import rinCasualBlushClose from '@/assets/sprites/rin/rin-casual-06b-blush-close.png'

export default [
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
      { label: "Apologize again", next: 3 },
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
    text: "...",
    sprite: rinCasualBlushClose,
    spritePos: 'right',
  },
]
