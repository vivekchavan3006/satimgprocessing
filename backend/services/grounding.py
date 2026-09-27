import os
import urllib.request
import torch
from PIL import Image
import numpy as np

# Grounding DINO imports
from groundingdino.util.inference import load_model, predict
import groundingdino.datasets.transforms as T
from services.image_processor import load_image_bytes

WEIGHTS_URL = "https://github.com/IDEA-Research/GroundingDINO/releases/download/v0.1.0-alpha/groundingdino_swint_ogc.pth"
WEIGHTS_PATH = os.path.join(os.path.dirname(__file__), "..", "weights", "groundingdino_swint_ogc.pth")
CONFIG_PATH = os.path.join(os.path.dirname(__file__), "..", "venv", "Lib", "site-packages", "groundingdino", "config", "GroundingDINO_SwinT_OGC.py")

# Fallback config path for source installations or different structures
FALLBACK_CONFIG_PATH = os.path.join(os.path.dirname(__file__), "..", "GroundingDINO", "groundingdino", "config", "GroundingDINO_SwinT_OGC.py")

class GroundingService:
    def __init__(self):
        self.model = None
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self._initialize_model()

    def _download_weights(self):
        weights_dir = os.path.dirname(WEIGHTS_PATH)
        os.makedirs(weights_dir, exist_ok=True)
        if not os.path.exists(WEIGHTS_PATH):
            print(f"Downloading Grounding DINO weights to {WEIGHTS_PATH}...")
            urllib.request.urlretrieve(WEIGHTS_URL, WEIGHTS_PATH)
            print("Download complete.")

    def _get_config_path(self):
        if os.path.exists(CONFIG_PATH):
            return CONFIG_PATH
        
        # Try to find config in the current python environment
        import groundingdino
        base_dir = os.path.dirname(groundingdino.__file__)
        candidate = os.path.join(base_dir, "config", "GroundingDINO_SwinT_OGC.py")
        if os.path.exists(candidate):
            return candidate
            
        if os.path.exists(FALLBACK_CONFIG_PATH):
            return FALLBACK_CONFIG_PATH
            
        raise FileNotFoundError(f"Could not find Grounding DINO config file. Checked {CONFIG_PATH} and {candidate}")

    def _initialize_model(self):
        try:
            self._download_weights()
            config_path = self._get_config_path()
            print(f"Loading Grounding DINO model on {self.device}...")
            self.model = load_model(config_path, WEIGHTS_PATH, device=self.device)
            print("Model loaded successfully.")
        except Exception as e:
            print(f"Failed to initialize Grounding DINO: {e}")
            self.model = None

    def is_loaded(self):
        return self.model is not None

    def _transform_image(self, image_pil):
        transform = T.Compose([
            T.RandomResize([800], max_size=1333),
            T.ToTensor(),
            T.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
        ])
        image_tensor, _ = transform(image_pil, None)
        return image_tensor

    def predict(self, image_bytes: bytes, text_prompt: str, box_threshold: float = 0.3, text_threshold: float = 0.25):
        if not self.is_loaded():
            raise RuntimeError("Model is not loaded.")

        # Load image
        image_pil = load_image_bytes(image_bytes)
        image_tensor = self._transform_image(image_pil)
        
        # Predict
        boxes, logits, phrases = predict(
            model=self.model,
            image=image_tensor,
            caption=text_prompt,
            box_threshold=box_threshold,
            text_threshold=text_threshold,
            device=self.device
        )
        
        # Grounding DINO returns boxes in cxcywh format normalized to 0-1
        # Convert to x1y1x2y2 format for the frontend (which expects percentages 0-100 or relative)
        # Wait, the frontend expects:
        # { x, y, width, height } as percentages
        
        results = []
        for idx in range(len(boxes)):
            cx, cy, w, h = boxes[idx].tolist()
            confidence = float(logits[idx].item())
            label = phrases[idx]
            
            # cx, cy, w, h are normalized 0-1
            # Frontend wants: x, y (top-left), width, height as percentages (0-100)
            x_left = (cx - w / 2) * 100
            y_top = (cy - h / 2) * 100
            width = w * 100
            height = h * 100
            
            # Map colors deterministically or based on label
            color = "#38bdf8" # default cyan
            if "building" in label:
                color = "#38bdf8"
            elif "car" in label or "vehicle" in label:
                color = "#f59e0b"
            elif "water" in label or "river" in label:
                color = "#3b82f6"
            elif "road" in label:
                color = "#10b981"
            elif "tree" in label or "vegetation" in label:
                color = "#22c55e"
                
            results.append({
                "id": f"det-{idx}",
                "className": label.title(),
                "confidence": round(confidence * 100, 1),
                "x": round(x_left, 2),
                "y": round(y_top, 2),
                "width": round(width, 2),
                "height": round(height, 2),
                "color": color
            })
            
        return results
