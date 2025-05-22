document.addEventListener('DOMContentLoaded', () => {
    const imageUpload = document.getElementById('imageUpload') as HTMLInputElement;
    const imagePreview = document.getElementById('imagePreview') as HTMLImageElement;
    const imagePreviewContainer = document.getElementById('imagePreviewContainer') as HTMLDivElement;
    const analyzeButton = document.getElementById('analyzeButton') as HTMLButtonElement;
    const analysisText = document.getElementById('analysisText') as HTMLParagraphElement;
    const resultsContainer = document.getElementById('results') as HTMLDivElement;
    const loadingIndicator = document.getElementById('loadingIndicator') as HTMLDivElement;
    const errorMessagesDiv = document.getElementById('errorMessages') as HTMLDivElement;
    const errorTextP = document.getElementById('errorText') as HTMLParagraphElement;

    let currentFile: File | null = null;

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
        const files = (event.target as HTMLInputElement).files;
        if (files && files.length > 0) {
            currentFile = files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target && e.target.result) {
                    imagePreview.src = e.target.result as string;
                    imagePreview.style.display = 'block';
                    imagePreviewContainer.style.display = 'flex'; // Show container
                    analyzeButton.disabled = false; // Enable button when image is selected
                    analysisText.textContent = 'Image loaded. Click \"Analyze Image\".';
                    resultsContainer.style.display = 'none'; // Hide previous results
                    errorMessagesDiv.style.display = 'none'; // Hide previous errors
                }
            };
            reader.readAsDataURL(currentFile);
        } else {
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
            // Make sure your backend is running on port 5001 or update this URL
            const response = await fetch('http://localhost:5001/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                let errorMsg = `Error: ${response.status} ${response.statusText}`;
                try {
                    const errorData = await response.json();
                    errorMsg = errorData.error || errorMsg;
                } catch (e) {
                    // If parsing error JSON fails, use the status text
                }
                throw new Error(errorMsg);
            }

            const result = await response.json();
            
            if (result.analysis) {
                analysisText.textContent = result.analysis;
            } else if (result.error) {
                analysisText.textContent = `Analysis Error: ${result.error}`;
            } else {
                analysisText.textContent = 'Received an unexpected response from the server.';
            }
            resultsContainer.style.display = 'block';

        } catch (error: any) {
            console.error('Error uploading or analyzing image:', error);
            errorTextP.textContent = `An error occurred: ${error.message || 'Unknown error'}`;
            errorMessagesDiv.style.display = 'block';
            analysisText.textContent = 'Failed to get analysis.'; // Update main analysis text too
            resultsContainer.style.display = 'block'; // Show results container to display this message
        } finally {
            // Hide loading indicator and re-enable button
            loadingIndicator.style.display = 'none';
            // Only re-enable if there's a file selected, otherwise it should remain disabled
            if (currentFile) {
                 analyzeButton.disabled = false;
            }
        }
    });
});
