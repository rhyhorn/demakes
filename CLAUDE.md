# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Спілкуйся з користувачем українською.

## Структура

Це набір незалежних браузерних ігор на TypeScript + Vite. Компоненти ігор пишуться на React 19 (`.tsx`). Хаб (`src/`) — звичайний TypeScript без React. Технічно це один Vite-проєкт із кількома сторінками:

- `index.html` + `src/` — головна сторінка (хаб) зі списком посилань на ігри. Список ігор задано в `src/main.ts`.
- `games/<id>/index.html` + `games/<id>/src/` — кожна гра є окремим SPA, доступним за адресою `/games/<id>/`.
- `scripts/games.mjs` — `listGames()`, автоматичне виявлення ігор: кожна папка `games/<id>/` з власним `index.html`. Цю функцію використовують `vite.config.mjs` (точки входу збірки), `eslint.config.mjs` (зони ізоляції) і `scripts/game.mjs` (запуск однієї гри).

Ігри та хаб не мають спільних файлів. Імпорти між `games/a` і `games/b`, а також між `src/` і `games/` заборонені правилом `import-x/no-restricted-paths`, тож лінтер на них упаде. Спільного коду поки немає. Якщо він знадобиться, це окреме рішення, яке треба узгодити з користувачем.

Щоб додати гру, створи `games/<id>/index.html` (точку входу підключай відносним шляхом, наприклад `./src/app/index.tsx`) саму точку входу і `games/<id>/tsconfig.json` (скопіюй із `sol-cesto`: він розширює кореневий і задає аліас `@/` → `./src/*`), а потім додай посилання в `src/main.ts`. Збірка й лінтер підхоплять гру автоматично. За бажанням додай у `package.json` скрипт `dev:<id>`.

Для роутингу всередині гри використовуй хеш (`#/...`). Інакше dev-сервер і статичний хостинг не знайдуть сторінку за глибоким посиланням.

## Ігри

### Sol Cesto (`sol-cesto`)

Roguelike, зроблений за референсним скріншотом `games/sol-cesto/design/reference.webp` (1920×1080). Це головне джерело для дизайну: переглядай його перед роботою над версткою, UI чи ігровими механіками. Папка `design/` не входить у збірку. Є базова розмітка сцени (порожні слоти панелей і порожнє поле 4×4). Ігрової логіки ще немає, тож не додавай її, поки користувач не попросить.

- У центрі поле 4×4 з карток-кімнат підземелля. На кожній картці є вміст і бейдж з іконкою та числом:
  - **ворог**: значення атаки або магії (наприклад, меч 3 чи спіраль 1);
  - **скриня**: невідома нагорода (`?`);
  - **полуниця**: лікування.
- Ліва панель: портрет або повідомлення, ряд зубів (ймовірно, лічильник ресурсу), інвентар предметів (зілля, зброя) і книга модифікаторів у відсотках (атака, магія, HP, скрині, шипи тощо).
- Права панель: героїня зі здоров'ям (серце `5/5`), лічильник `0/4`, кольорові ключі або руни, власні атака й магія, двері під замком `0/5` та жаба-скарбничка з монетами.

Код у `games/sol-cesto/src/` організовано за Feature-Sliced Design:

- `app/` — `index.tsx` (на нього посилається `index.html`) монтує `<App />` у `#app` через `createRoot` у `StrictMode`. `App.tsx` — кореневий компонент.
- `pages/<slice>/` — сторінки. Зараз є одна, `home` (`HomePage`): вона збирає головну сцену з трьох колонок (375 / 1170 / 375 дизайн-пікселів).
- `widgets/` — `left-sidebar`, `dungeon-board` (поле `BOARD_SIZE`×`BOARD_SIZE`), `right-sidebar`.
- `shared/` — код без бізнес-логіки: `shared/config` (зокрема `SCENE_WIDTH`/`SCENE_HEIGHT` = 1920×1080) і `shared/ui` (`ScaledStage`).
- `entities/` — `board`: `BOARD_SIZE`, `CELL_COUNT`, хелпери рядків (`getRowCells`, `getAvailableCells`, `getCellChance`) і Zustand-стор `useBoardStore`. У сторі є `cells` (16 клітинок по рядках, поки просто числа), `playerIndex` (`null`, поки гравця не видно) і `visited` (відвідані клітинки, включно з поточною).
- Шар `features/` поки не створено. Додавай його, коли з'явиться відповідний код.

Базова механіка: гравець клікає на рядок поля (кожен рядок — це `<button>` на `grid-cols-subgrid`), і `enterRow(row)` ставить гравця на випадкову ще не відвідану клітинку цього рядка. На відвідану клітинку повернутися не можна. Рядок без вільних клітинок вимикається. У правому верхньому куті кожної клітинки показано, з якою ймовірністю гравець потрапить на неї, якщо обере її рядок (`getCellChance`): вільні клітинки рядка мають рівні шанси. На відвіданих клітинках (шанс 0) мітки немає. `enterRow` приймає необов'язковий `random` (за замовчуванням `Math.random`), щоб у тестах вибір був детермінованим.

Стан гри зберігай у Zustand-сторах (`create<State>()(...)`) у `model/` відповідного зрізу. Компоненти читають стан через селектори: `useBoardStore((state) => state.cells)`.

Масштабування: `ScaledStage` вписує сцену в екран зі збереженням пропорцій 16:9 і центрує її. Усередині розміри задавай у дизайн-пікселях референсу через `calc(N * var(--px))`, тоді вся сцена масштабується разом. Стилі: Tailwind CSS 4 (підключено через `@tailwindcss/vite`, імпорт `@import 'tailwindcss' source('../..')` у `app/styles/index.css` сканує лише `src` гри) і CSS Modules (`ui/<Name>.module.css` поруч із компонентом) для складнішого. Розміри в Tailwind задавай довільними значеннями, наприклад `text-[length:calc(72*var(--px))]`. Префікс `length:` потрібен для `text-`/`border-` з `calc`, інакше Tailwind може прийняти значення за колір.

Правила FSD: шар може імпортувати лише з шарів, нижчих за нього (`app → pages → widgets → features → entities → shared`). Зрізи одного шару не імпортують один одного. Ззовні до зрізу звертаються лише через його `index.ts` (публічний API з іменованими експортами), а не напряму до `ui/...`. Лінтер ці правила поки не перевіряє, тож дотримуйся їх сам. Імпорти між шарами й зрізами пиши через аліас `@/` (`@/` = `games/sol-cesto/src`), наприклад `import { ScaledStage } from '@/shared/ui'`. Усередині одного зрізу (і в межах `app/`) імпорти відносні: `./HomePage.module.css`, `../config`.

React-компоненти — це функції з іменованим експортом. Компонент лежить у `ui/<Name>.tsx` свого зрізу.

## Команди

```bash
npm run dev              # хаб + усі ігри (гра відкривається за /games/<id>/)
npm run game -- <id>     # dev-сервер лише однієї гри (корінь = games/<id>)
npm run dev:sol-cesto    # те саме для sol-cesto
npm run build            # перевірка типів + збірка хаба й усіх ігор у dist/
npm run preview          # перегляд зібраного dist/
npm run typecheck        # лише перевірка типів
npm run lint             # ESLint (Airbnb), lint:fix — з автовиправленням
npm run format           # Prettier --write, format:check — лише перевірка
npm test                 # усі тести Vitest (одноразово)
npm run test:watch       # Vitest у watch-режимі
npx vitest run games/sol-cesto           # тести однієї гри
npx vitest run path/to/file.test.ts      # один файл тестів
npx vitest run -t "назва тесту"          # тести за назвою
```

Тести Vitest шукає за шаблоном `**/*.{test,spec}.{ts,tsx}`. Тести кладуть поруч із кодом (`model/boardStore.test.ts`). Перед кожним тестом скидай стан Zustand-стора через `setState`.

## Технічні нотатки

- `vite.config.mjs` має два режими. Без змінної `GAME` коренем є корінь репозиторію, і збираються всі сторінки. З `GAME=<id>` (її виставляє `scripts/game.mjs` через Vite API) коренем стає `games/<id>`, тож гра працює як самостійний додаток за адресою `/`.
- `@vitejs/plugin-react` підключено в обох режимах, тож Fast Refresh працює і в `npm run dev`, і в `npm run game`.
- Версії: TypeScript 6.0, React 19, Vite 8, Tailwind CSS 4, Zustand 5, Vitest 5, ESLint 9, Node 24. Не оновлюй TypeScript до 7 і ESLint до 10: `typescript-eslint` підтримує лише TS < 6.1, а `eslint-config-airbnb-extended` — лише ESLint 9.
- Лінтинг: `eslint.config.mjs` (flat config) підключає `eslint-config-airbnb-extended` (`configs.base.all` + `configs.react.all`, тобто Airbnb для JS, TS і React, включно з hooks та a11y). Для `games/**` вимкнено `import-x/prefer-default-export` (FSD використовує іменовані експорти), а також `react/react-in-jsx-scope` і `react/jsx-uses-react`, бо `"jsx": "react-jsx"` не вимагає імпортувати React. Оригінальний `eslint-config-airbnb-base` з ESLint 9 не працює. Останнім у конфігу має стояти `eslint-config-prettier`: він вимикає стильові правила, а форматування повністю на Prettier (`.prettierrc.json`: одинарні лапки, крапки з комою, ширина 100).
- TypeScript: кореневий `tsconfig.json` охоплює лише хаб (`src`). Кожна гра має власний `games/<id>/tsconfig.json`, який розширює кореневий, задає свій `include` і аліас `@/`. Vite (`resolve.tsconfigPaths`) і ESLint (резолвер імпортів і project service) беруть найближчий до файлу tsconfig, тому `@/` у кожній грі вказує на її власну `src`. `npm run typecheck` (`scripts/typecheck.mjs`) запускає `tsc --noEmit` для хаба й для кожної гри.
- Лінтер працює з type-aware правилами, тому кожен `.ts`-файл має входити до `include` найближчого `tsconfig.json`. Інакше з'явиться помилка «was not found by the project service».
- Інструменти збірки (`vite.config.mjs`, `scripts/*.mjs`) написано на JS (ESM), щоб не тягнути `@types/node` і окремий tsconfig. Для них у лінтері ввімкнено Node-глобали, а розширення `.mjs` в імпортах обов'язкові.
- Кінці рядків завжди LF: це задано в `.gitattributes` і `.prettierrc.json`.
