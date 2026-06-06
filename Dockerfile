FROM node:20-alpine AS frontend-builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
ENV MODELSCOPE=true
RUN npm run build

FROM python:3.10-slim

WORKDIR /app

RUN pip install --no-cache-dir fastapi==0.115.6 "uvicorn[standard]==0.32.1"

COPY app.py start.sh ./
COPY --from=frontend-builder /app/dist ./dist

RUN chmod +x start.sh

ENV PORT=7860
EXPOSE 7860

CMD ["./start.sh"]
