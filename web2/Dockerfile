FROM node:22-alpine3.21 AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN yarn install --frozen-lockfile --no-audit --no-fund
COPY . .

RUN yarn build

FROM node:22-alpine3.21 AS runner
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app /app

COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/build /app/build
COPY --from=build /app/package.json /app/package.json

# ADICIONE ESTA LINHA TEMPORARIAMENTE para debug:
RUN ls -lR /app/src/assets/imagens/logo/

ENV PORT=4173
EXPOSE 4173
CMD ["sh", "-c", "npm run preview -- --host 0.0.0.0 --port $PORT"]




