import io
import rasterio
from PIL import Image
import numpy as np

def load_image_bytes(image_bytes: bytes) -> Image.Image:
    """
    Loads image bytes into a PIL Image.
    Handles standard formats (JPEG/PNG) and GeoTIFFs.
    """
    try:
        # Try loading as standard PIL image (JPEG/PNG)
        img = Image.open(io.BytesIO(image_bytes))
        if img.mode != 'RGB':
            img = img.convert('RGB')
        return img
    except IOError:
        pass
        
    try:
        # Try loading as GeoTIFF using rasterio via memory file
        with rasterio.MemoryFile(image_bytes) as memfile:
            with memfile.open() as dataset:
                # Read RGB bands (assuming first 3 bands for now)
                # Rasterio reads as (bands, height, width)
                # We need to convert it to (height, width, bands) for PIL
                count = dataset.count
                if count >= 3:
                    red = dataset.read(1)
                    green = dataset.read(2)
                    blue = dataset.read(3)
                    
                    # Normalize if 16-bit
                    if red.dtype == np.uint16:
                        red = (red / 256).astype(np.uint8)
                        green = (green / 256).astype(np.uint8)
                        blue = (blue / 256).astype(np.uint8)
                        
                    rgb_array = np.dstack((red, green, blue))
                    return Image.fromarray(rgb_array)
                else:
                    # Single band (Grayscale)
                    band = dataset.read(1)
                    if band.dtype == np.uint16:
                        band = (band / 256).astype(np.uint8)
                    return Image.fromarray(band).convert('RGB')
    except Exception as e:
        raise ValueError(f"Could not read image file: {str(e)}")
