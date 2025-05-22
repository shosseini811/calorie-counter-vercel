# Calorie Counter Web App

This is a simplified web application that allows users to upload an image of food. The backend, built with Python and Flask, sends this image to the Google Gemini API for analysis, which then returns an estimated calorie count and identified food items. The frontend is built with TypeScript and basic HTML/CSS.

## Project Structure

```
calorie-counter/
├── backend/
│   ├── app.py            # Flask backend logic
│   ├── requirements.txt  # Python dependencies
│   ├── .env.example      # Example for environment variables (API key)
│   └── .env              # Actual environment variables (you need to create this)
├── frontend/
│   ├── index.html        # Main HTML page
│   ├── style.css         # CSS for styling
│   ├── main.ts           # TypeScript for frontend logic
│   ├── tsconfig.json     # TypeScript compiler options
│   └── dist/             # Compiled JavaScript (main.js will be here after compilation)
└── README.md           # This file
```

## Prerequisites

*   Python 3.7+
*   Node.js and npm (for TypeScript compilation and serving frontend)
*   A Google Gemini API Key

## Setup Instructions

### 1. Clone the Repository (if applicable)

If you haven't already, clone the project to your local machine.

```bash
# git clone <repository-url>
cd calorie-counter
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment (recommended):

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
```

Install Python dependencies:

```bash
pip install -r requirements.txt
```

Set up your Gemini API Key:

1.  Rename `.env.example` to `.env`.
2.  Open the `.env` file and replace `YOUR_GEMINI_API_KEY_HERE` with your actual Google Gemini API key.

    ```
    GEMINI_API_KEY=your_actual_api_key_goes_here
    ```

    **Important**: You can obtain a Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

### 3. Frontend Setup

Navigate to the frontend directory:

```bash
cd ../frontend  # If you are in the backend directory
# or cd frontend if you are in the root calorie-counter directory
```

Install TypeScript and a simple HTTP server (if you don't have one globally):

```bash
npm install typescript --save-dev
npm install http-server -g # Or use any other local server you prefer
```

Compile the TypeScript code:

```bash
npx tsc
```

This will compile `main.ts` and output `main.js` into a `dist` folder within the `frontend` directory, as specified in `tsconfig.json`.

## Running the Application

### 1. Start the Backend Server

Navigate to the `backend` directory and run the Flask app:

```bash
cd backend # if not already there
python app.py
```

The backend server will start, usually on `http://127.0.0.1:5001`.

### 2. Start the Frontend Server

Open a **new terminal window/tab**.

Navigate to the `frontend` directory:

```bash
cd frontend # if not already there
```

Serve the `index.html` file using a simple HTTP server:

```bash
http-server .
```

This will typically serve the frontend on `http://127.0.0.1:8080` (or another port if 8080 is busy). The server will show you the exact URL.

### 3. Access the Application

Open your web browser and go to the URL provided by your frontend HTTP server (e.g., `http://127.0.0.1:8080`).

## How to Use

1.  Click the "Choose File" button to select an image of food from your computer.
2.  A preview of the image will be displayed.
3.  Click the "Analyze Image" button.
4.  Wait for the Gemini API to process the image.
5.  The estimated calorie count and identified food items will be displayed below the button.

## Important Notes

*   **API Key Security**: Never commit your actual `.env` file with the API key to a public repository.
*   **CORS**: The Flask backend has `Flask-CORS` enabled to allow requests from the frontend (which will be on a different port).
*   **Error Handling**: Basic error handling is in place. Check the browser console and backend terminal for more detailed error messages if something goes wrong.
*   **Simplification**: This is a simplified version. Production applications would require more robust error handling, security measures, user authentication, a database, better UI/UX, etc.

## Deploying to Vercel

This application can be deployed to Vercel by following these steps:

### 1. Install Vercel CLI (Optional)

You can use the Vercel CLI for deployment:

```bash
npm install -g vercel
```

### 2. Prepare Your Project

The project has been configured for Vercel deployment with the following files:

* `vercel.json` - Configuration for routing and builds
* `backend/api/index.py` - Serverless API endpoint
* Updated frontend code to use the correct API endpoints

### 3. Set Up Environment Variables

You'll need to set up your Gemini API key as an environment variable in Vercel:

1. Create a Vercel account at [vercel.com](https://vercel.com) if you don't have one
2. Install the Vercel CLI and login: `vercel login`
3. Create a secret for your API key: `vercel secrets add gemini_api_key YOUR_ACTUAL_API_KEY`

### 4. Deploy to Vercel

You can deploy using one of these methods:

#### Using Vercel CLI

```bash
vercel
```

Follow the prompts to deploy your project.

#### Using Vercel Dashboard

1. Push your code to a GitHub, GitLab, or Bitbucket repository
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "New Project" and import your repository
4. Configure the project settings:
   * Set the Framework Preset to "Other"
   * Set the Root Directory to the project root
   * Add your environment variable: `GEMINI_API_KEY` (link it to your secret)
5. Click "Deploy"

### 5. Verify Your Deployment

Once deployed, Vercel will provide you with a URL for your application. Visit this URL to ensure everything is working correctly.

### 6. Custom Domain (Optional)

You can add a custom domain to your Vercel project through the Vercel dashboard under the "Domains" section of your project settings.