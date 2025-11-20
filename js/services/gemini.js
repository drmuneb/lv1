const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export class GeminiService {
    constructor() {
        this.apiKey = this.getApiKey();
        this.history = [];
    }

    getApiKey() {
        const keys = JSON.parse(localStorage.getItem('gemini_api_keys') || '[]');
        return keys[0] || null; // Use first key for now, rotation logic can be added later
    }

    async startInterview(patientData) {
        this.history = [];
        const systemPrompt = `
            You are an expert medical AI assistant conducting a clinical interview for a SOAP note.
            Patient Data: ${JSON.stringify(patientData)}.
            
            Your goal is to gather the Subjective (S) part of the SOAP note.
            Ask ONE question at a time.
            
            OUTPUT FORMAT:
            You must output a JSON object strictly. Do not output markdown code blocks.
            {
                "question_en": "English question text",
                "question_fa": "Persian translation of question",
                "options": [
                    {"text_en": "Option 1", "text_fa": "Persian Option 1"},
                    {"text_en": "Option 2", "text_fa": "Persian Option 2"},
                    {"text_en": "Option 3", "text_fa": "Persian Option 3"},
                    {"text_en": "Option 4", "text_fa": "Persian Option 4"}
                ],
                "is_finished": false
            }
            
            If you have gathered enough information, set "is_finished": true and leave other fields empty.
            The first question should be about the Chief Complaint: "${patientData.chiefComplaint}".
            Be empathetic and professional.
        `;

        // We send the system prompt as the first user message for the 'chat' context
        // Or use the system_instruction if supported by the endpoint, but simple prompt is easier for flash.
        return this.sendMessage(systemPrompt);
    }

    async sendMessage(message, imageBase64 = null) {
        if (!this.apiKey) throw new Error('No API Key found');

        const parts = [{ text: message }];
        if (imageBase64) {
            // Remove header if present (e.g., "data:image/jpeg;base64,")
            const base64Data = imageBase64.split(',')[1] || imageBase64;
            parts.push({
                inline_data: {
                    mime_type: "image/jpeg",
                    data: base64Data
                }
            });
        }

        this.history.push({ role: 'user', parts: parts });

        try {
            const response = await fetch(`${API_URL}?key=${this.apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: this.history,
                    generationConfig: {
                        response_mime_type: "application/json"
                    }
                })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error?.message || 'API Error');
            }

            const data = await response.json();
            const text = data.candidates[0].content.parts[0].text;

            this.history.push({ role: 'model', parts: [{ text: text }] });

            return JSON.parse(text);
        } catch (error) {
            console.error('Gemini Error:', error);
            throw error;
        }
    }

    async generateSOAP(interviewHistory, patientData) {
        // Logic to generate final SOAP note
        const prompt = `
            Generate a bilingual (English & Persian) SOAP note based on this interview.
            Patient: ${JSON.stringify(patientData)}
            Interview: ${JSON.stringify(interviewHistory)}
            
            Output JSON:
            {
                "subjective_en": "...",
                "subjective_fa": "...",
                "objective_en": "...",
                "objective_fa": "...",
                "assessment_en": "...",
                "assessment_fa": "...",
                "plan_en": "...",
                "plan_fa": "...",
                "ddx": [
                    {"name_en": "Dx1", "name_fa": "Persian Dx1", "probability": "High", "rationale": "..."}
                ]
            }
        `;
        // We create a new instance or just one-off call
        // For simplicity, we'll just use a fresh call
        return this.sendMessage(prompt);
    }
}
