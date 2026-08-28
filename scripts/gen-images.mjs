// Range-aware batch image generator. Usage: bun scripts/gen-images.mjs <start> <end>
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const OUT_DIR = 'public/photos';
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const jobs = [
  { name: 'sunset.png', prompt: 'Dreamy pastel pink and orange sunset sky with soft fluffy clouds, anime scenery style, ethereal warm light, bokeh, no text, high quality' },
  { name: 'strawberry-milk.png', prompt: 'Strawberry milk in a clear plastic cup with pink straw and domed lid, kawaii aesthetic product photo, pastel pink background, soft light, no text' },
  { name: 'sakura-branch.png', prompt: 'Close up of cherry blossom branch with delicate pale pink sakura flowers, soft focus, bright daylight, anime scenery, no text' },
  { name: 'sketchbook.png', prompt: 'Open sketchbook with a pencil sketch of an anime girl face, art supplies, cozy desk, warm light, pastel tones, no text' },
  { name: 'window.png', prompt: 'View through a window of cherry blossom trees in bloom, soft pastel pink, dreamy anime scenery, sunlight, no text' },
  { name: 'bouquet.png', prompt: 'Bouquet of soft pink roses wrapped in craft paper, romantic aesthetic, pastel background, soft light, no text' },
  { name: 'cityscape.png', prompt: 'Cityscape silhouette at sunset sunrise, pastel pink and purple sky, anime scenery, dreamy atmosphere, no text' },
  { name: 'teddy.png', prompt: 'Cute plush teddy bear light brown tan colour, sitting on soft pastel pink blanket, cozy aesthetic, soft light, no text' },
];

const start = parseInt(process.argv[2] || '0', 10);
const end = parseInt(process.argv[3] || String(jobs.length), 10);
const slice = jobs.slice(start, end);

async function main() {
  const zai = await ZAI.create();
  for (const j of slice) {
    const out = path.join(OUT_DIR, j.name);
    if (fs.existsSync(out)) { console.log(`skip ${j.name}`); continue; }
    try {
      const r = await zai.images.generations.create({ prompt: j.prompt, size: '1024x1024' });
      fs.writeFileSync(out, Buffer.from(r.data[0].base64, 'base64'));
      console.log(`ok ${j.name}`);
    } catch (e) {
      console.error(`fail ${j.name}: ${e.message}`);
    }
  }
  console.log(`DONE ${start}-${end}`);
}
main();
