from flask import Flask, request, jsonify
import os
import pathlib
import google.generativeai as genai
from flask_cors import CORS
from dotenv import load_dotenv
from PIL import Image
import io

load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure the Gemini API key
try:
    gemini_api_key = os.getenv("GEMINI_API_KEY")
    if not gemini_api_key:
        raise ValueError("GEMINI_API_KEY not found in .env file or environment variables.")
    genai.configure(api_key=gemini_api_key)
except ValueError as e:
    print(f"Error: {e}")

# Initialize the Gemini model
model = genai.GenerativeModel('gemini-2.5-flash-preview-05-20')

@app.route('/api/upload', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400

    file = request.files['image']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file:
        try:
            # Read image bytes
            img_bytes = file.read()
            img = Image.open(io.BytesIO(img_bytes))

            # Prepare the image for the Gemini API
            image_parts = [
                {
                    "mime_type": f"image/{img.format.lower()}" if img.format else "image/jpeg",
                    "data": img_bytes
                }
            ]

            # Create the prompt for Gemini
            prompt_parts = [
                image_parts[0],
                "\n\nAnalyze this image and provide an estimated calorie count for the food items visible. "
                "Also, list the food items you identify. Be concise. "
                "Format your response as: 'Identified food: [list of items]. Estimated calories: [number] kcal.'"
            ]

            # Configure generation parameters
            generation_config = {
                "temperature": 0,
                "top_p": 0.95,
                "top_k": 0,
                "max_output_tokens": 1024,
            }
            
            # Call the Gemini API with streaming enabled
            response_stream = model.generate_content(
                prompt_parts,
                generation_config=generation_config,
                stream=True
            )
            
            # Collect the streamed response
            analysis_result = ""
            for chunk in response_stream:
                if chunk.text:
                    analysis_result += chunk.text
            
            # If we somehow got an empty response, provide a fallback message
            if not analysis_result:
                analysis_result = "Could not extract text from Gemini response."

            return jsonify({'analysis': analysis_result})

        except Exception as e:
            return jsonify({'error': str(e)}), 500

    return jsonify({'error': 'Unknown error'}), 500
