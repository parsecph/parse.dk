#### 💻 Website source for [parse.dk](https://parse.dk)

Dark-mode-only Next.js site for Parse Copenhagen, showcasing every product the studio has shipped.

- **Stack:** Next.js (App Router), React, Tailwind CSS v4, `lucide-react`, `motion`, `three` + `@react-three/fiber` + `@react-three/drei`
- **3D:** one WebGL box inside the hero (`src/components/scene/`): the product logos as monochrome tiles orbiting a liquid blob. It scrolls away with the hero, pauses when off screen and lowers resolution if the device struggles. Hover (or tap) a tile to bring its colour in; click (or tap again) to open the product
- **Design:** monochrome at rest, small colour accents on interaction. Flat panels with hairline borders, no light mode
- **Content:** every product lives in `src/data/products.ts` — add a new entry there plus a logo in `public/logos/<id>.webp` and it shows up in the hero, the marquee, the grid and the footer

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
npm run lint
```

## Legacy site

The previous site has been moved, unchanged, to [`legacy/`](./legacy). It is a standalone Next.js 13 project with its own `package.json`.

-----------------

| | |
| :- | :- |
| <a href="https://shipixen.com" target="_blank"><img height="60px" src="https://user-images.githubusercontent.com/1515742/281071510-d5c0095d-d336-4857-ad80-d18cf65f4acb.png" alt="Shipixen Logo" /></a> <br/> <b>Shipixen</b> <br/> Create a blog & landing page in minutes with <b>Shipixen</b>. <br/> Get started on <a href="https://shipixen.com">shipixen.com</a>. | <a href="https://shipixen.com" target="_blank"><img width="300px" src="https://user-images.githubusercontent.com/1515742/281077548-57b24773-3c2a-4e89-b088-cc3945d7037b.png" alt="Shipixen Logo" /></a> |

-----------------

<a href="https://apihustle.com" target="_blank">
  <img height="60px" src="https://user-images.githubusercontent.com/1515742/215217833-c07183d2-f688-4d1c-86ea-329f3b28f81c.svg" alt="Apihustle Logo" />
</a>

Check out the Apihustle suite - a collection of tools to test, improve and get to know your API inside and out. <br/>
[apihustle.com](https://apihustle.com) <br/>

|    |    |    |    |
| :- | :- | :- | :- |
| <a href="https://clobbr.app" target="_blank"><img height="70px" src="https://user-images.githubusercontent.com/1515742/215217949-0fe7096c-10f1-47ec-bdc7-91d8047ddc70.svg" alt="Clobbr Logo" /></a> | **Clobbr** | Debug multiple cron expressions on a calendar. | [clobbr.app](https://clobbr.app) |
| <a href="https://crontap.com" target="_blank"><img height="70px" src="https://user-images.githubusercontent.com/1515742/215218037-44233c7d-7e21-4180-8572-6a759a6a118f.svg" alt="Crontap Logo" /></a> | **Crontap** | Schedule API calls using cron syntax. | [crontap.com](https://crontap.com) |
| <a href="https://tool.crontap.com" target="_blank"><img height="70px" src="https://user-images.githubusercontent.com/1515742/215217997-fedcc496-a868-40bd-81f9-d07dabc0597e.svg" alt="CronTool Logo" /></a> | **CronTool** | Debug multiple cron expressions on a calendar. | [tool.crontap.com](https://tool.crontap.com)  |

-----------------
