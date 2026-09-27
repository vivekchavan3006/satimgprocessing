import os
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from services.grounding import GroundingService
from services.query_parser import parse_query
import uvicorn
from io import BytesIO
from PIL import Image

app = FastAPI(title="SatQuery API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

grounding_service = None

@app.on_event("startup")
def startup_event():
    global grounding_service
    grounding_service = GroundingService()

@app.get("/api/health")
def health_check():
    if grounding_service and grounding_service.is_loaded():
        return {"status": "ok", "model": "Grounding DINO loaded"}
    return {"status": "starting", "model": "Model is loading or failed"}

@app.post("/api/analyze")
async def analyze_image(
    image: UploadFile = File(...),
    query: str = Form(...)
):
    if not image:
        raise HTTPException(status_code=400, detail="No image provided")
    if not query.strip():
        raise HTTPException(status_code=400, detail="No query provided")

    try:
        content = await image.read()
        parsed_query = parse_query(query)
        
        # Grounding DINO predicts
        result = grounding_service.predict(content, parsed_query)
        
        return {
            "success": True,
            "task": "visual_grounding",
            "query": query,
            "parsed_query": parsed_query,
            "model": "Grounding DINO",
            "count": len(result),
            "detections": result
        }
    except Exception as e:
        print(f"Error during analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
