
# app.py (simple Gradio UI for SAM 3D Objects)
import gradio as gr
import sys
sys.path.append("notebook")
from inference import Inference, load_image
from PIL import Image
import numpy as np

# Load model (config from checkpoints)
tag = "hf"
config_path = f"checkpoints/{tag}/pipeline.yaml"
inference = Inference(config_path, compile=False)

def generate_3d(image_rgb, mask_image):
    # Load RGB image
    image = load_image(image_rgb)
    
    # Simple mask loading (assume mask is grayscale; adjust if needed)
    mask_np = np.array(mask_image.convert("L")) > 0  # Binary mask
    
    # Run inference
    output = inference(image, mask_np, seed=42)
    
    # Save and return PLY
    ply_path = "output.ply"
    output["gs"].save_ply(ply_path)
    return ply_path

iface = gr.Interface(
    fn=generate_3d,
    inputs=[
        gr.Image(type="filepath", label="RGB Image"),
        gr.Image(type="pil", label="Mask Image (white on black)")
    ],
    outputs=gr.File(label="Download 3D PLY File"),
    title="SAM 3D Objects Generator",
    description="Upload an RGB image and a mask to generate a 3D model."
)

if __name__ == "__main__":
    iface.launch(server_name="0.0.0.0", server_port=7860)
