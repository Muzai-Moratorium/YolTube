import cv2
import numpy as np
import os
from ultralytics import YOLO
from PIL import ImageFont, ImageDraw, Image

PERSON_CLASS_ID = 0
CONFIDENCE_THRESHOLD = 0.5

_model = None

def get_model() -> YOLO:
    global _model
    if _model is None:
        model_path = os.path.join(os.path.dirname(__file__), "yolov8n.onnx")
        _model = YOLO(model_path, task="detect")
    return _model

def draw_korean_text(image, text, position, font_size=20, color=(0, 0, 0)):
    # OpenCV 이미지를 PIL 이미지로 변환
    image_pil = Image.fromarray(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
    draw = ImageDraw.Draw(image_pil)
    
    # 윈도우 기본 맑은 고딕 폰트 경로 (시스템 환경에 따라 다를 수 있음)
    font_path = "C:/Windows/Fonts/malgun.ttf"
    if not os.path.exists(font_path):
        # 폰트가 없을 경우 기본 폰트 사용
        font = ImageFont.load_default()
    else:
        font = ImageFont.truetype(font_path, font_size)
    
    # 글자 그리기
    draw.text(position, text, font=font, fill=color[::-1]) # RGB -> BGR
    
    # 다시 OpenCV 이미지로 변환
    return cv2.cvtColor(np.array(image_pil), cv2.COLOR_RGB2BGR)

def detect_persons(frame: np.ndarray) -> tuple[np.ndarray, int]:
    model = get_model()

    results = model(frame, verbose=False, conf=CONFIDENCE_THRESHOLD)
    result = results[0]

    person_count = 0
    boxes = result.boxes

    for box in boxes:
        cls_id = int(box.cls[0])
        if cls_id != PERSON_CLASS_ID:
            continue

        person_count += 1
        conf = float(box.conf[0])
        x1, y1, x2, y2 = map(int, box.xyxy[0])

        # 바운딩 박스 (유튜브 레드 느낌의 색상으로 변경: BGR 기준)
        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 255), 2)

        # 한글 라벨 렌더링
        label = f"사람 {conf:.0%}"
        
        # 라벨 배경 박스
        cv2.rectangle(frame, (x1, y1 - 30), (x1 + 80, y1), (0, 0, 255), -1)
        
        # PIL을 이용한 한글 출력
        frame = draw_korean_text(frame, label, (x1 + 5, y1 - 28), font_size=16, color=(255, 255, 255))

    return frame, person_count
