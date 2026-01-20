from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse
from pathlib import Path
from uuid import uuid4
import json
import shutil

router = APIRouter()

UPLOAD_DIR = Path(__file__).resolve().parents[1] / "uploads"
TMP_DIR = UPLOAD_DIR / "tmp"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
TMP_DIR.mkdir(parents=True, exist_ok=True)


def _safe_ext(filename: str) -> str:
    # Keep a simple, safe extension (e.g. jpg/png/webp). Default to .bin.
    if not filename or "." not in filename:
        return ".bin"
    ext = "." + filename.rsplit(".", 1)[1].lower()
    if len(ext) > 10:
        return ".bin"
    return ext


@router.post("/uploads/init", response_model=dict)
async def init_upload(filename: str = Form(...), total_chunks: int = Form(...)):
    """Initialize a chunked upload session."""
    try:
        upload_id = str(uuid4())
        ext = _safe_ext(filename)
        final_name = f"{upload_id}{ext}"

        session_dir = TMP_DIR / upload_id
        session_dir.mkdir(parents=True, exist_ok=True)

        meta = {
            "upload_id": upload_id,
            "filename": filename,
            "final_name": final_name,
            "total_chunks": int(total_chunks),
            "next_index": 0,
        }
        (session_dir / "meta.json").write_text(json.dumps(meta), encoding="utf-8")

        return {"success": True, "upload_id": upload_id, "final_name": final_name}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/uploads/chunk", response_model=dict)
async def upload_chunk(
    upload_id: str = Form(...),
    index: int = Form(...),
    chunk: UploadFile = File(...),
):
    """Upload a single chunk (must be sent sequentially)."""
    try:
        session_dir = TMP_DIR / upload_id
        meta_path = session_dir / "meta.json"
        if not meta_path.exists():
            raise HTTPException(status_code=404, detail="Upload session not found")

        meta = json.loads(meta_path.read_text(encoding="utf-8"))
        expected = int(meta.get("next_index", 0))
        if int(index) != expected:
            raise HTTPException(
                status_code=400,
                detail=f"Unexpected chunk index. Expected {expected}, got {index}",
            )

        part_path = session_dir / "file.part"
        data = await chunk.read()
        with part_path.open("ab") as f:
            f.write(data)

        meta["next_index"] = expected + 1
        meta_path.write_text(json.dumps(meta), encoding="utf-8")

        done = meta["next_index"] >= int(meta["total_chunks"])
        if done:
            final_path = UPLOAD_DIR / meta["final_name"]
            shutil.move(str(part_path), str(final_path))
            shutil.rmtree(session_dir, ignore_errors=True)

            return {
                "success": True,
                "done": True,
                "url": f"/api/uploads/{meta['final_name']}",
            }

        return {"success": True, "done": False, "next_index": meta["next_index"]}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/uploads/{file_name}")
async def get_upload(file_name: str):
    """Serve uploaded files."""
    file_path = UPLOAD_DIR / file_name
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path)
