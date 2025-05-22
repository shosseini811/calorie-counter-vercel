import os
import pathlib
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from PIL import Image
import io

load_dotenv()

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

# Configure the Gemini API key
try:
    gemini_api_key = os.getenv("GEMINI_API_KEY")
    if not gemini_api_key:
        raise ValueError("GEMINI_API_KEY not found in .env file or environment variables.")
    genai.configure(api_key=gemini_api_key)
except ValueError as e:
    print(f"Error: {e}")
    # You might want to exit or handle this more gracefully in a production app
    # For this simplified version, we'll let it proceed but API calls will fail.

# Initialize the Gemini model
# Using gemini-2.5-flash-preview-05-20 for improved image analysis capabilities
# This is a newer model with better performance for food image analysis
model = genai.GenerativeModel('gemini-2.5-flash-preview-05-20')

@app.route('/upload', methods=['POST'])
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
            # The API expects a list of parts, where each part can be text or image data.
            image_parts = [
                {
                    "mime_type": f"image/{img.format.lower()}" if img.format else "image/jpeg", # Ensure format is always 'image/format'
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
                "temperature": 0,  # Lower temperature for more deterministic responses
                "top_p": 0.95,
                "top_k": 0,
                "max_output_tokens": 1024,
            }
            
            # Call the Gemini API with streaming enabled
            print("Sending request to Gemini API...")
            response_stream = model.generate_content(
                prompt_parts,
                generation_config=generation_config,
                stream=True  # Enable streaming
            )
            
            # Collect the streamed response
            analysis_result = ""
            print("Receiving streamed response from Gemini API:")
            for chunk in response_stream:
                if chunk.text:
                    analysis_result += chunk.text
                    print(chunk.text, end="")
            
            print("\nCompleted receiving response from Gemini API.")
            
            # If we somehow got an empty response, provide a fallback message
            if not analysis_result:
                analysis_result = "Could not extract text from Gemini response."
                print("Warning: Empty response received from Gemini API.")
                # Log more details for debugging
                print(f"Response stream details: {response_stream}")

            return jsonify({'analysis': analysis_result})

        except Exception as e:
            print(f"Error processing image or calling Gemini API: {e}")
            return jsonify({'error': str(e)}), 500

    return jsonify({'error': 'Unknown error'}), 500

if __name__ == '__main__':
    # Make sure to create a .env file in this directory with your GEMINI_API_KEY
    # e.g., GEMINI_API_KEY=YOUR_ACTUAL_API_KEY
    if not os.getenv("GEMINI_API_KEY"):
        print("Warning: GEMINI_API_KEY is not set. The application will run but API calls will fail.")
        print("Please create a .env file in the 'backend' directory with your GEMINI_API_KEY.")
        print("Example .env file content: GEMINI_API_KEY=YOUR_API_KEY_HERE")
    app.run(debug=True, port=5001) # Changed port to 5001 to avoid common conflicts
