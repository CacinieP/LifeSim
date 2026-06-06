"""FastAPI 静态服务，供魔搭 Docker 创空间在 7860 端口托管前端。"""

import os
from pathlib import Path

import uvicorn
from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI(title="LifeSim")
DIST = Path(__file__).parent / "dist"

if (DIST / "assets").exists():
    app.mount("/assets", StaticFiles(directory=DIST / "assets"), name="assets")

if (DIST / "images").exists():
    app.mount("/images", StaticFiles(directory=DIST / "images"), name="images")


@app.get("/")
async def index() -> FileResponse:
    return FileResponse(DIST / "index.html")


@app.get("/{path:path}")
async def static_or_spa(path: str) -> FileResponse:
    file_path = DIST / path
    if file_path.is_file():
        return FileResponse(file_path)
    return FileResponse(DIST / "index.html")


if __name__ == "__main__":
    if not (DIST / "index.html").is_file():
        raise SystemExit(f"Missing frontend build: {DIST / 'index.html'}")
    port = int(os.environ.get("PORT", 7860))
    print(f"[LifeSim] serving {DIST} on 0.0.0.0:{port}", flush=True)
    uvicorn.run(app, host="0.0.0.0", port=port)
