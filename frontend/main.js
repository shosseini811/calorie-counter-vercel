document.addEventListener('DOMContentLoaded', () => {
    const imageUpload = document.getElementById('imageUpload');
    const imagePreview = document.getElementById('imagePreview');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    const analyzeButton = document.getElementById('analyzeButton');
    const analysisText = document.getElementById('analysisText');
    const resultsContainer = document.getElementById('results');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const errorMessagesDiv = document.getElementById('errorMessages');
    const errorTextP = document.getElementById('errorText');
    console.log("Top_analysisText", analysisText.textContent);
    let currentFile = null;
    if (!imageUpload || !imagePreview || !analyzeButton || !analysisText || !resultsContainer || !imagePreviewContainer || !loadingIndicator || !errorMessagesDiv || !errorTextP) {
        console.error('One or more essential HTML elements are missing.');
        if (errorMessagesDiv && errorTextP) {
            errorTextP.textContent = 'Initialization error: Page elements missing. Please contact support.';
            errorMessagesDiv.style.display = 'block';
        }
        return;
    }
    analyzeButton.disabled = true; // Disable button initially
    imageUpload.addEventListener('change', (event) => {
        const files = event.target.files;
        console.log("Event target", event.target);
        console.log("Files", files);
        // If files is indeed a FileList (a list of files), the .length property tells you how many files are in that list.
        console.log("Files length", files?.length);
        console.log("Current file", currentFile);
        console.log("Image preview", imagePreview);
        console.log("Image preview container", imagePreviewContainer);
        console.log("Analyze button", analyzeButton);
        console.log("Analysis text", analysisText);
        if (files && files.length > 0) {
            console.log("Files_v2", files);
            currentFile = files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target && e.target.result) {
                    imagePreview.src = e.target.result;
                    imagePreview.style.display = 'block';
                    imagePreviewContainer.style.display = 'flex'; // Show container
                    analyzeButton.disabled = false; // Enable button when image is selected
                    analysisText.textContent = 'Image loaded. Click \"Analyze Image\".';
                    resultsContainer.style.display = 'none'; // Hide previous results
                    errorMessagesDiv.style.display = 'none'; // Hide previous errors
                }
            };
            reader.readAsDataURL(currentFile);
        }
        else {
            currentFile = null;
            imagePreview.style.display = 'none';
            imagePreviewContainer.style.display = 'none';
            analyzeButton.disabled = true;
            analysisText.textContent = 'Waiting for analysis...';
        }
    });
    analyzeButton.addEventListener('click', async () => {
        if (!currentFile) {
            errorTextP.textContent = 'Please select an image file first.';
            errorMessagesDiv.style.display = 'block';
            return;
        }
        const formData = new FormData();
        formData.append('image', currentFile);
        // Show loading indicator and disable button
        loadingIndicator.style.display = 'block';
        analyzeButton.disabled = true;
        resultsContainer.style.display = 'none';
        errorMessagesDiv.style.display = 'none';
        analysisText.textContent = ''; // Clear previous analysis
        try {
            // API endpoint that works both locally and when deployed
            const apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:5001/upload' : '/api/upload';
            const response = await fetch(apiUrl, {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) {
                let errorMsg = `Error: ${response.status} ${response.statusText}`;
                try {
                    const errorData = await response.json();
                    errorMsg = errorData.error || errorMsg;
                }
                catch (e) {
                    // If parsing error JSON fails, use the status text
                }
                throw new Error(errorMsg);
            }
            const result = await response.json();
            console.log("result", result);
            if (result.analysis) {
                analysisText.textContent = result.analysis;
                console.log("analysisText", analysisText);
            }
            else if (result.error) {
                analysisText.textContent = `Analysis Error: ${result.error}`;
            }
            else {
                analysisText.textContent = 'Received an unexpected response from the server.';
            }
            resultsContainer.style.display = 'block';
        }
        catch (error) {
            console.error('Error uploading or analyzing image:', error);
            errorTextP.textContent = `An error occurred: ${error.message || 'Unknown error'}`;
            errorMessagesDiv.style.display = 'block';
            analysisText.textContent = 'Failed to get analysis.'; // Update main analysis text too
            resultsContainer.style.display = 'block'; // Show results container to display this message
        }
        finally {
            // Hide loading indicator and re-enable button
            loadingIndicator.style.display = 'none';
            // Only re-enable if there's a file selected, otherwise it should remain disabled
            if (currentFile) {
                analyzeButton.disabled = false;
            }
        }
    });
});
