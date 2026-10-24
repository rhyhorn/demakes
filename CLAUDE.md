# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Спілкуйся з користувачем українською.

## Проєкт

Браузерна roguelike-гра у вигляді SPA на TypeScript + Vite (без UI-фреймворку). Зараз це лише каркас: `index.html` з контейнером `#app` і точка входу `src/main.ts`. Верстку та ігрову логіку ще не почали, тож не додавай їх, поки користувач не попросить.

### Концепція гри (за референсним скріншотом)

- У центрі поле 4×4 з карток-кімнат підземелля. На кожній картці є вміст і бейдж з іконкою та числом:
  - **ворог**: значення атаки або магії (наприклад, меч 3 чи спіраль 1);
  - **скриня**: невідома нагорода (`?`);
  - **полуниця**: лікування.
- Ліва панель: портрет або повідомлення, ряд зубів (ймовірно, лічильник ресурсу), інвентар предметів (зілля, зброя) і книга модифікаторів у відсотках (атака, магія, HP, скрині, шипи тощо).
- Права панель: героїня зі здоров'ям (серце `5/5`), лічильник `0/4`, кольорові ключі або руни, власні атака й магія, двері під замком `0/5` та жаба-скарбничка з монетами.

## Команди

```bash
npm run dev          # dev-сервер Vite
npm run build        # перевірка типів (tsc --noEmit) + продакшн-збірка в dist/
npm run preview      # перегляд зібраного dist/
npm run typecheck    # лише перевірка типів
npm run lint         # ESLint (Airbnb), lint:fix — з автовиправленням
npm run format       # Prettier --write, format:check — лише перевірка
npm test             # усі тести Vitest (одноразово)
npm run test:watch   # Vitest у watch-режимі
npx vitest run path/to/file.test.ts      # один файл тестів
npx vitest run -t "назва тесту"          # тести за назвою
```

Тести Vitest шукає за шаблоном `**/*.{test,spec}.ts`. Тестів поки немає, тому `npm test` без них завершиться помилкою; щоб цього уникнути, додай `--passWithNoTests`.

## Технічні нотатки

- Версії: TypeScript 6.0, Vite 8, Vitest 5, ESLint 9, Node 24. Не оновлюй TypeScript до 7 і ESLint до 10: `typescript-eslint` підтримує лише TS < 6.1, а `eslint-config-airbnb-extended` — лише ESLint 9.
- Лінтинг: `eslint.config.mjs` (flat config) підключає `eslint-config-airbnb-extended` (`configs.base.all`, тобто Airbnb для JS і TS). Оригінальний `eslint-config-airbnb-base` з ESLint 9 не працює. Останнім у конфігу має стояти `eslint-config-prettier`: він вимикає стильові правила, а форматування повністю на Prettier (`.prettierrc.json`: одинарні лапки, крапки з комою, ширина 100).
- Лінтер працює з type-aware правилами, тому кожен `.ts`-файл має входити до `include` у `tsconfig.json` (зараз це лише `src`). Інакше з'явиться помилка «was not found by the project service». Якщо додаватимеш `vite.config.ts` тощо, розшир `include`.
- `tsconfig.json` увімкнено в режимі `strict` разом із `noUnusedLocals`, `noUnusedParameters` та `verbatimModuleSyntax`. Тому імпорти лише типів пиши як `import type`.
- `tsc` нічого не генерує (`noEmit`): збирає Vite, а `tsc` тільки перевіряє типи.
