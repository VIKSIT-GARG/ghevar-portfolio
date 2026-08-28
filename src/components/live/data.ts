'use client'

export type Letter = {
  id: number
  date: string
  title: string
  body: string
  signature: string
  hue: string
}

export const LETTERS: Letter[] = [
  {
    id: 7,
    date: 'May 26, 2024',
    title: 'a little something',
    body: 'Just wanted to remind you how special you are. You mean the world to me, more than you\u2019ll ever know. Every quiet moment with you feels like a chapter I never want to finish reading.',
    signature: '\u2014 always, me',
    hue: 'from-[#fbcfe8] to-[#f9a8d4]',
  },
  {
    id: 6,
    date: 'May 20, 2024',
    title: 'today, again',
    body: 'I keep thinking about the way you laugh at your own jokes before you even finish them. It\u2019s my favourite sound. I\u2019d rewind every day just to hear it once more.',
    signature: '\u2014 yours',
    hue: 'from-[#fde2e8] to-[#fbcfe8]',
  },
  {
    id: 5,
    date: 'May 14, 2024',
    title: 'rainy afternoon',
    body: 'The rain reminded me of you. Soft, warm, and making everything outside feel a little more possible. I hope wherever you are, you\u2019re warm and thinking of me too.',
    signature: '\u2014 p.s. i miss you',
    hue: 'from-[#fce7f3] to-[#fbcfe8]',
  },
  {
    id: 4,
    date: 'May 9, 2024',
    title: 'half past eleven',
    body: 'It\u2019s 11:30 and the city is quiet. I caught myself smiling at the ceiling because I was remembering the way you tilt your head when you\u2019re pretending to think. Goodnight, love.',
    signature: '\u2014 sleep well',
    hue: 'from-[#f9d5e8] to-[#fda4af]',
  },
  {
    id: 3,
    date: 'May 3, 2024',
    title: 'the train ride home',
    body: 'I watched the lights blur past the window and all I could think was \u2014 I want every late train ride to be with you. Quiet, warm, yours.',
    signature: '\u2014 see you tomorrow',
    hue: 'from-[#fbcfe8] to-[#c4b5fd]',
  },
]

export type Shot = {
  src: string
  label: string
  caption: string
  fallback: string
}

export const SHOTS: Shot[] = [
  { src: '/photos/sunset.png', label: 'golden sky', caption: 'the sky was yours that day', fallback: 'from-[#fda4af] to-[#fbbf24]' },
  { src: '/photos/strawberry-milk.png', label: 'sweet', caption: 'you + your strawberry milk', fallback: 'from-[#f9a8d4] to-[#fbcfe8]' },
  { src: '/photos/sakura-branch.png', label: 'in bloom', caption: 'first sakura of the season', fallback: 'from-[#fbcfe8] to-[#f9a8d4]' },
  { src: '/photos/sketchbook.png', label: 'doodles', caption: 'you drew me again', fallback: 'from-[#fde2e8] to-[#fbcfe8]' },
  { src: '/photos/window.png', label: 'the view', caption: 'our window, our spring', fallback: 'from-[#f9a8d4] to-[#fda4af]' },
  { src: '/photos/bouquet.png', label: 'for you', caption: 'i brought you flowers', fallback: 'from-[#fbcfe8] to-[#fda4af]' },
  { src: '/photos/cityscape.png', label: 'that day', caption: 'the whole city, ours', fallback: 'from-[#c4b5fd] to-[#f9a8d4]' },
  { src: '/photos/teddy.png', label: 'soft', caption: 'your bear misses you', fallback: 'from-[#fde2e8] to-[#fbbf24]' },
]
