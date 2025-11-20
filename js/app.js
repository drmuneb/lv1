import { h, render } from 'https://esm.sh/preact';
import { useState, useEffect } from 'https://esm.sh/preact/hooks';
import { html } from 'https://esm.sh/htm/preact';

// Components
import Home from './components/Home.js';
import PatientDetails from './components/PatientDetails.js';
import Interview from './components/Interview.js';
import SOAPResult from './components/SOAPResult.js';
import Settings from './components/Settings.js';
import Navigation from './components/Navigation.js';

const App = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [view, setView] = useState('home');
    const [patientData, setPatientData] = useState(null);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const renderView = () => {
        switch(view) {
            case 'home': return html`<${Home} setView=${setView} />`;
            case 'details': return html`<${PatientDetails} setView=${setView} setPatientData=${setPatientData} />`;
            case 'interview': return html`<${Interview} setView=${setView} patientData=${patientData} />`;
            case 'soap': return html`<${SOAPResult} setView=${setView} patientData=${patientData} />`;
            case 'settings': return html`<${Settings} setView=${setView} />`;
            default: return html`<${Home} setView=${setView} />`;
        }
    };

    return html`
        <div class="app-container">
            <header class="flex justify-between items-center p-4 border-b" style="border-color: var(--border)">
                <div class="flex items-center gap-2" onClick=${() => setView('home')} style="cursor: pointer">
                    <h1 style="font-size: 1.5rem; font-weight: 700; background: linear-gradient(45deg, var(--accent), #ff6b6b); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">LiveeviL</h1>
                </div>
                <button class="btn" style="padding: 8px; background: transparent; color: var(--text-primary)" onClick=${toggleTheme}>
                    ${theme === 'light' ? '🌙' : '☀️'}
                </button>
            </header>

            <main class="p-4 animate-fade-in" style="padding-bottom: 80px">
                ${renderView()}
            </main>

            <${Navigation} currentView=${view} setView=${setView} />
        </div>
    `;
};

render(html`<${App} />`, document.getElementById('app'));
