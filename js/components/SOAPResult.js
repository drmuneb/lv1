import { html } from 'https://esm.sh/htm/preact';
import { useState, useEffect } from 'https://esm.sh/preact/hooks';
import { GeminiService } from '../services/gemini.js';

const SOAPResult = ({ setView, patientData }) => {
    const [soap, setSoap] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const history = JSON.parse(localStorage.getItem('last_interview') || '[]');
        if (history.length === 0 && !patientData) {
            // If no history, maybe just show empty or redirect
            // For demo, we might want to generate even with empty history if patient data exists
        }
        generate(history);
    }, []);

    const generate = async (history) => {
        const gemini = new GeminiService();
        try {
            const result = await gemini.generateSOAP(history, patientData);
            setSoap(result);
        } catch (error) {
            alert('Error generating SOAP: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return html`
            <div class="flex flex-col items-center justify-center h-full">
                <div class="animate-pulse text-center">
                    <div class="text-fa text-xl mb-2">...درحال تحلیل و نگارش</div>
                    <div class="text-en text-lg">Analyzing and writing SOAP note...</div>
                </div>
            </div>
        `;
    }

    if (!soap) return html`<div>Error loading SOAP.</div>`;

    return html`
        <div class="flex flex-col gap-4 animate-fade-in">
            <div class="flex justify-between items-center no-print">
                <h2 class="text-xl font-bold">SOAP Note</h2>
                <button class="btn" onClick=${handlePrint}>
                    <span>🖨️</span> Export PDF
                </button>
            </div>

            <!-- Printable Area -->
            <div id="printable-soap" class="flex flex-col gap-4">
                <!-- Header with Patient Info -->
                <div class="card" style="border-bottom: 4px solid var(--accent)">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <div class="text-xs text-secondary">Patient Name</div>
                            <div class="font-bold">${patientData?.firstName} ${patientData?.lastName}</div>
                        </div>
                        <div>
                            <div class="text-xs text-secondary">Date</div>
                            <div class="font-bold">${patientData?.admissionDate}</div>
                        </div>
                        <div>
                            <div class="text-xs text-secondary">ID/Bed</div>
                            <div class="font-bold">${patientData?.bed}</div>
                        </div>
                    </div>
                </div>

                <!-- Subjective -->
                <div class="card">
                    <div class="bilingual-text mb-2 border-b pb-2">
                        <span class="text-fa font-bold text-lg">Subjective (S) / ذهنی</span>
                    </div>
                    <div class="bilingual-text gap-4">
                        <p class="text-fa text-right" style="line-height: 1.6">${soap.subjective_fa}</p>
                        <p class="text-en text-left text-secondary">${soap.subjective_en}</p>
                    </div>
                </div>

                <!-- Objective -->
                <div class="card">
                    <div class="bilingual-text mb-2 border-b pb-2">
                        <span class="text-fa font-bold text-lg">Objective (O) / عینی</span>
                    </div>
                    <div class="bilingual-text gap-4">
                        <p class="text-fa text-right" style="line-height: 1.6">${soap.objective_fa}</p>
                        <p class="text-en text-left text-secondary">${soap.objective_en}</p>
                    </div>
                </div>

                <!-- Assessment -->
                <div class="card">
                    <div class="bilingual-text mb-2 border-b pb-2">
                        <span class="text-fa font-bold text-lg">Assessment (A) / ارزیابی</span>
                    </div>
                    <div class="bilingual-text gap-4">
                        <p class="text-fa text-right" style="line-height: 1.6">${soap.assessment_fa}</p>
                        <p class="text-en text-left text-secondary">${soap.assessment_en}</p>
                    </div>
                    
                    <!-- DDx List -->
                    <div class="mt-4 bg-secondary p-4 rounded-lg" style="background: var(--bg-secondary)">
                        <h4 class="font-bold mb-2">Differential Diagnosis</h4>
                        <ul class="flex flex-col gap-2">
                            ${soap.ddx?.map(dx => html`
                                <li class="flex justify-between items-center border-b pb-1" style="border-color: var(--border)">
                                    <div class="bilingual-text">
                                        <span class="text-fa font-bold">${dx.name_fa}</span>
                                        <span class="text-en text-sm">${dx.name_en}</span>
                                    </div>
                                    <span class="badge" style="background: var(--accent); color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.8em;">
                                        ${dx.probability}
                                    </span>
                                </li>
                            `)}
                        </ul>
                    </div>
                </div>

                <!-- Plan -->
                <div class="card">
                    <div class="bilingual-text mb-2 border-b pb-2">
                        <span class="text-fa font-bold text-lg">Plan (P) / طرح درمان</span>
                    </div>
                    <div class="bilingual-text gap-4">
                        <p class="text-fa text-right" style="line-height: 1.6">${soap.plan_fa}</p>
                        <p class="text-en text-left text-secondary">${soap.plan_en}</p>
                    </div>
                </div>
                
                <div class="text-center mt-8 opacity-50 text-sm">
                    Generated by LiveeviL AI Assistant
                </div>
            </div>
        </div>
    `;
};

export default SOAPResult;
