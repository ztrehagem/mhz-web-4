## Architecture
- Languages:
  - `pug`
  - `stylus`
  - modern `javascript`
- Almost following `RSCSS`.
- Each RSCSS components must have same-named pug `mixin`.
- Some RSCSS components have same-named javascript `class`.


## Setup
- `$ npm install`


## Development
- `$ npm run build` ... development build
- `$ npm run prod` ... production build
- `$ npm run clean` ... remove output files
- `$ npm run serve` ... run local server
- `$ npm run watch` ... `build` & watch src changes
- `$ npm run local` ... `watch` & `serve`


## Deployment
1. `$ npm run prod`
2. push submodule `assets`
3. https://ztrehagem.github.io
