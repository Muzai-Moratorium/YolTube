import asyncio
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
import cv2

from youtube import get_stream_url, get_video_info, extract_video_id
from detector import detect_persons, get_model

app = FastAPI(title="YOLO Person Detector")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    get_model()


@app.get("/api/health")
async def health():
    return {"status": "ok", "model": "yolov8n"}


@app.get("/api/video-info")
async def video_info(url: str = Query(..., description="YouTube URL")):
    try:
        info = get_video_info(url)
        return JSONResponse(content=info)
    except Exception as e:
        return JSONResponse(status_code=400, content={"error": str(e)})


def generate_frames(youtube_url: str):
    stream_url = get_stream_url(youtube_url)
    cap = cv2.VideoCapture(stream_url)

    if not cap.isOpened():
        return

    fps = cap.get(cv2.CAP_PROP_FPS) or 30
    frame_delay = 1.0 / fps

    try:
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            frame = cv2.resize(frame, (854, 480))

            annotated, count = detect_persons(frame)

            _, buffer = cv2.imencode(".jpg", annotated, [cv2.IMWRITE_JPEG_QUALITY, 80])
            frame_bytes = buffer.tobytes()

            yield (
                b"--frame\r\n"
                b"Content-Type: image/jpeg\r\n\r\n" + frame_bytes + b"\r\n"
            )
    finally:
        cap.release()


@app.get("/api/detect")
async def detect(url: str = Query(..., description="YouTube URL")):
    try:
        extract_video_id(url)
    except Exception:
        return JSONResponse(status_code=400, content={"error": "Invalid YouTube URL"})

    return StreamingResponse(
        generate_frames(url),
        media_type="multipart/x-mixed-replace; boundary=frame",
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
