# Calorie Counter Web App - Vercel Deployment

This is a web application that allows users to upload food images for AI-powered calorie analysis. Built with Python Flask (serverless) backend and TypeScript frontend, optimized for **Vercel deployment**.

🌐 **Live Demo**: [https://calorie-counter-vercel-lrd4zgumb-shosseini811s-projects.vercel.app](https://calorie-counter-vercel-lrd4zgumb-shosseini811s-projects.vercel.app)

## Features

- 📸 Upload food images for analysis
- 🤖 AI-powered calorie estimation using Google Gemini API
- 🍎 Food item identification
- ⚡ Serverless backend deployment on Vercel
- 📱 Responsive web interface

## Project Structure

```
calorie-counter-vercel/
├── backend/
│   ├── api/
│   │   └── index.py          # Vercel serverless function
│   ├── app.py                # Local development server
│   ├── vercel_app.py         # Alternative local server
│   ├── requirements.txt      # Python dependencies
│   ├── .env.example          # Environment variables template
│   └── .env                  # Your API key (local only)
├── frontend/
│   ├── index.html            # Main HTML page
│   ├── style.css             # Styling
│   ├── main.ts               # TypeScript source
│   ├── main.js               # Compiled JavaScript (for deployment)
│   └── tsconfig.json         # TypeScript configuration
├── vercel.json               # Vercel deployment configuration
├── package.json              # Node.js dependencies
└── README.md                 # This file
```

## Prerequisites

- Google Gemini API Key ([Get one here](https://aistudio.google.com/app/apikey))
- Vercel account ([Sign up here](https://vercel.com))
- Node.js (for TypeScript compilation)

## Quick Deploy to Vercel

### Method 1: One-Click Deploy (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/calorie-counter-vercel)

### Method 2: Manual Deployment

1. **Clone this repository**
   ```bash
   git clone <your-repo-url>
   cd calorie-counter-vercel
   ```

2. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

3. **Login to Vercel**
   ```bash
   vercel login
   ```

4. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

5. **Set Environment Variable**
   - Go to your [Vercel Dashboard](https://vercel.com/dashboard)
   - Select your deployed project
   - Navigate to **Settings** → **Environment Variables**
   - Add: `GEMINI_API_KEY` = `your_actual_api_key`
   - Click **Save**

6. **Redeploy** (to apply environment variables)
   ```bash
   vercel --prod
   ```

## Local Development

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and add your GEMINI_API_KEY
   ```

4. **Run local server**
   ```bash
   python app.py
   ```
   Server runs on `http://localhost:5001`

### Frontend Setup

1. **Compile TypeScript** (if modified)
   ```bash
   npx tsc frontend/main.ts --outDir frontend
   ```

2. **Serve frontend** (any HTTP server)
   ```bash
   cd frontend
   python -m http.server 8080
   ```
   Frontend available at `http://localhost:8080`

## How It Works

### Architecture
- **Frontend**: Static HTML/CSS/JS served by Vercel
- **Backend**: Python Flask serverless function at `/api/upload`
- **AI**: Google Gemini API for image analysis
- **Deployment**: Fully serverless on Vercel

### API Endpoints
- `POST /api/upload` - Upload and analyze food images

### Smart Environment Detection
The frontend automatically detects the environment:
- **Local**: Calls `http://localhost:5001/upload`
- **Production**: Calls `/api/upload`

## Usage

1. 📸 **Upload Image**: Click "Choose File" and select a food image
2. 👀 **Preview**: Image preview appears automatically
3. 🔍 **Analyze**: Click "Analyze Image" button
4. ⏳ **Wait**: AI processes the image (few seconds)
5. 📊 **Results**: View calorie count and identified food items

## Configuration Files Explained

### `vercel.json`
```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/**/*",
      "use": "@vercel/static"
    },
    {
      "src": "backend/api/index.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/api/index.py"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/$1"
    }
  ]
}
```

### Environment Variables
- `GEMINI_API_KEY`: Your Google Gemini API key (required)

## Troubleshooting

### Common Issues

1. **"GEMINI_API_KEY not found"**
   - Ensure environment variable is set in Vercel dashboard
   - Redeploy after adding environment variables

2. **"Failed to analyze image"**
   - Check if API key is valid
   - Verify image format (JPEG, PNG supported)
   - Check Vercel function logs

3. **Frontend not loading**
   - Ensure `main.js` is compiled from `main.ts`
   - Check browser console for errors

### Viewing Logs
- Go to Vercel Dashboard → Your Project → Functions tab
- Click on the function to view logs and errors

## Security Notes

- ✅ API key stored securely in Vercel environment variables
- ✅ CORS enabled for cross-origin requests
- ✅ No sensitive data exposed in frontend code
- ⚠️ Never commit `.env` files to version control

## Tech Stack

- **Frontend**: HTML5, CSS3, TypeScript/JavaScript
- **Backend**: Python 3.9, Flask, Google Generative AI
- **Deployment**: Vercel (Serverless)
- **AI**: Google Gemini 2.5 Flash Preview

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally and on Vercel
5. Submit a pull request

## License

MIT License - see LICENSE file for details

---

**Made with ❤️ for Vercel deployment**