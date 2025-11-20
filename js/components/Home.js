import { html } from 'https://esm.sh/htm/preact';

const Home = ({ setView }) => {
    return html`
        <div class="flex flex-col gap-4">
            <div class="card animate-fade-in">
                <div class="bilingual-text text-center">
                    <span class="text-fa" style="font-size: 1.4em; font-weight: 700;">خوش آمدید به LiveeviL</span>
                    <span class="text-en">Welcome to LiveeviL</span>
                </div>
                <p class="text-center mt-4" style="color: var(--text-secondary)">
                    Your AI-powered bilingual SOAP assistant.
                </p>
            </div>

            <div class="card" onClick=${() => setView('details')} style="cursor: pointer; border-left: 4px solid var(--accent);">
                <div class="flex items-center justify-between">
                    <div class="bilingual-text">
                        <span class="text-fa">بیمار جدید</span>
                        <span class="text-en">New Patient</span>
                    </div>
                    <span style="font-size: 24px">➕</span>
                </div>
            </div>

            <div class="card" style="opacity: 0.7">
                <div class="flex items-center justify-between">
                    <div class="bilingual-text">
                        <span class="text-fa">تاریخچه</span>
                        <span class="text-en">History (Coming Soon)</span>
                    </div>
                    <span style="font-size: 24px">📂</span>
                </div>
            </div>
        </div>
    `;
};

export default Home;
