FROM node:24-slim

WORKDIR /app

COPY package*.json ./

RUN npm install --force

COPY . .

EXPOSE 3000

CMD [ "sh", "-c", "if [ \"$NODE_ENV\" = \"production\" ]; then npm run vite-build && npx serve -s dist -l 3000; else npm run vite-dev -- --host 0.0.0.0; fi" ]

