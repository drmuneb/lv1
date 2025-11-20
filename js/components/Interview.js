import { html } from 'https://esm.sh/htm/preact';
import { useState, useEffect, useRef } from 'https://esm.sh/preact/hooks';
import { GeminiService } from '../services/gemini.js';

const Interview = ({ setView, patientData }) => {
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [customAnswer, setCustomAnswer] = useState('');
    const [customImage, setCustomImage] = useState(null);
    const [interviewHistory, setInterviewHistory] = useState([]);
    const geminiRef = useRef(new GeminiService());

    useEffect(() => {
        startInterview();
    }, []);

    const startInterview = async () => {
        try {
            const firstQ = await geminiRef.current.startInterview(patientData);
            setQuestion(firstQ);
            setLoading(false);
        } catch (error) {
            alert('Error starting interview: ' + error.message);
            setLoading(false);
        }
    };

    const handleAnswer = async (answerText) => {
        setLoading(true);
        const qaPair = { question: question, answer: answerText, image: customImage };
        setInterviewHistory(prev => [...prev, qaPair]);

        try {
            const nextQ = await geminiRef.current.sendMessage(answerText, customImage);
            if (nextQ.is_finished) {
                localStorage.setItem('last_interview', JSON.stringify([...interviewHistory, qaPair]));
                setView('soap');
            } else {
                setQuestion(nextQ);
                setCustomAnswer('');
                setCustomImage(null);
            }
        } catch (error) {
            alert('Error sending answer: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCustomImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    if (loading) {
        return html`
            <div class="flex flex-col items-center justify-center h-full" style="min-height: 50vh">
                <div class="animate-pulse text-center">
                    <div class="text-fa text-xl mb-2">...درحال فکر کردن</div>
                    <div class="text-en text-lg">AI is thinking...</div>
                </div>
            </div>
        `;
    }

    if (!question) return null;

    return html`
        <div class="flex flex-col gap-4 animate-fade-in" style="padding-bottom: 100px">
            <!-- Chat History -->
            <div class="flex flex-col gap-2 opacity-50" style="max-height: 150px; overflow-y: auto;">
                ${interviewHistory.slice(-2).map(item => html`
                    <div class="card p-2" style="background: var(--bg-secondary)">
                        <div class="text-xs text-secondary">Q: ${item.question.question_en}</div>
                        <div class="text-xs font-bold">A: ${item.answer}</div>
                        ${item.image && html`<div class="text-xs text-accent">📷 Image attached</div>`}
                    </div>
                `)}
            </div>

            <!-- Current Question -->
            <div class="card" style="border-top: 4px solid var(--accent)">
                <div class="bilingual-text mb-4">
                    <span class="text-fa" style="font-size: 1.3em; font-weight: 600; color: var(--text-primary)">${question.question_fa}</span>
                    <span class="text-en" style="font-size: 1.1em; color: var(--text-primary)">${question.question_en}</span>
                </div>
            </div>

            <!-- Options -->
            <div class="grid gap-3">
                ${question.options && question.options.map(opt => html`
                    <button 
                        class="card text-left hover:border-accent transition-colors"
                        style="cursor: pointer; margin-bottom: 0; display: flex; flex-direction: column; gap: 4px;"
                        onClick=${() => handleAnswer(opt.text_en)}
                    >
                        <span class="text-fa font-medium">${opt.text_fa}</span>
                        <span class="text-en text-sm text-secondary">${opt.text_en}</span>
                    </button>
                `)}
            </div>

            <!-- Free Text Input -->
            <div class="card mt-4">
                <div class="bilingual-text mb-2">
                    <span class="text-fa">توضیحات خود را بنویسید</span>
                    <span class="text-en">Describe your own answer</span>
                </div>
                
                <!-- Image Preview -->
                ${customImage && html`
                    <div class="relative mb-2">
                        <img src=${customImage} style="max-height: 100px; border-radius: 8px;" />
                        <button 
                            onClick=${() => setCustomImage(null)}
                            style="position: absolute; top: -5px; left: -5px; background: red; color: white; border-radius: 50%; width: 20px; height: 20px; border: none; cursor: pointer;"
                        >x</button>
                    </div>
                `}

                <div class="flex gap-2">
                    <button class="btn" style="padding: 0 12px; background: var(--bg-secondary); color: var(--text-primary); border: 1px solid var(--border)" onClick=${() => document.getElementById('img-upload').click()}>
                        📷
                    </button>
                    <input 
                        type="file" 
                        id="img-upload" 
                        accept="image/*" 
                        style="display: none" 
                        onChange=${handleImageUpload}
                    />
                    
                    <input 
                        value=${customAnswer} 
                        onInput=${(e) => setCustomAnswer(e.target.value)}
                        placeholder="Type your answer..."
                        onKeyDown=${(e) => e.key === 'Enter' && handleAnswer(customAnswer)}
                    />
                    <button class="btn" onClick=${() => handleAnswer(customAnswer)}>
                        Send
                    </button>
                </div>
            </div>

            <button 
                class="btn w-full mt-4" 
                style="background-color: var(--text-secondary)"
                onClick=${() => setView('soap')}
            >
                End Interview & Generate SOAP
            </button>
        </div>
    `;
};

export default Interview;
