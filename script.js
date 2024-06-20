if ('webkitSpeechRecognition' in window) {
    const micButton = document.getElementById('micButton');
    const outputText = document.getElementById('outputText');

    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        outputText.textContent = `You said: ${transcript}`;

        try {
            const geminiResponse = await sendToGemini(transcript);
            outputText.textContent = `Gemini: ${geminiResponse}`;
        } catch (error) {
            console.error('Error processing Gemini request:', error);
            outputText.textContent = 'Error processing request. Please try again later.';
        }
    };

    recognition.onerror = (event) => {
        outputText.textContent = `Error: ${event.error}`;
    };

    recognition.onend = () => {
        micButton.disabled = false;
    };

    micButton.addEventListener('click', () => {
        micButton.disabled = true;
        outputText.textContent = 'Listening...';
        recognition.start();
    });

} else {
    alert('Web Speech API is not supported in this browser.');
}

async function sendToGemini(text) {
    const endpoint = 'YOUR_GEMINI_API_ENDPOINT'; // Replace with your Gemini API endpoint
    const apiKey = 'YOUR_GEMINI_API_KEY'; // Replace with your Gemini API key

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${APIKEY}`
            },
            body: JSON.stringify({
                input: text
                // Add any additional parameters as required by Gemini API
            })
        });

        if (!response.ok) {
            throw new Error('Gemini API request failed');
        }

        const data = await response.json();
        return data.result; // Adjust parsing based on Gemini API response structure

    } catch (error) {
        throw new Error('Error sending request to Gemini API');
    }
}
