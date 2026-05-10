# Образ уже содержит Chromium и системные зависимости Playwright.
# Версия должна совпадать с зависимостью `playwright` в package.json.
FROM mcr.microsoft.com/playwright:v1.49.1-jammy

WORKDIR /app

ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
ENV NODE_ENV=production

# `npm ci` падает, если lock не синхронизирован с package.json (часто после ручного изменения deps).
# Ставим из package.json; для воспроизводимости локально делайте `npm install` и коммитьте package-lock.json.
COPY package.json ./
RUN npm install --omit=dev --no-audit --no-fund

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

CMD ["node", "dist/index.js"]
