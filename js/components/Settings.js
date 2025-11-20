import { html } from 'https://esm.sh/htm/preact';
import { useState, useEffect } from 'https://esm.sh/preact/hooks';

const Settings = () => {
    const [keys, setKeys] = useState([]);
    const [newKey, setNewKey] = useState('');

    useEffect(() => {
        const storedKeys = JSON.parse(localStorage.getItem('gemini_api_keys') || '[]');
        setKeys(storedKeys);
    }, []);

    const addKey = () => {
        if (!newKey.trim()) return;
        const updatedKeys = [...keys, newKey.trim()];
        setKeys(updatedKeys);
        localStorage.setItem('gemini_api_keys', JSON.stringify(updatedKeys));
        setNewKey('');
    };

    const removeKey = (index) => {
        const updatedKeys = keys.filter((_, i) => i !== index);
        setKeys(updatedKeys);
        localStorage.setItem('gemini_api_keys', JSON.stringify(updatedKeys));
    };

    return html`
        <div class="flex flex-col gap-4">
            <div class="card">
                <div class="bilingual-text mb-4">
                    <span class="text-fa">تنظیمات API</span>
                    <span class="text-en">API Settings</span>
                </div>
                
                <div class="input-group">
                    <label class="text-en" style="display: block; margin-bottom: 8px; font-size: 0.9em;">Google Gemini API Key</label>
                    <div class="flex gap-2">
                        <input 
                            type="password" 
                            value=${newKey} 
                            onInput=${(e) => setNewKey(e.target.value)}
                            placeholder="Paste API Key here..."
                        />
                        <button class="btn" onClick=${addKey}>Add</button>
                    </div>
                </div>

                <div class="flex flex-col gap-2 mt-4">
                    ${keys.map((key, index) => html`
                        <div class="flex justify-between items-center p-2" style="background: var(--bg-secondary); border-radius: 8px;">
                            <span style="font-family: monospace; font-size: 0.9em;">
                                ${key.substring(0, 8)}...${key.substring(key.length - 4)}
                            </span>
                            <button 
                                onClick=${() => removeKey(index)}
                                style="background: none; border: none; color: #ff6b6b; cursor: pointer;"
                            >
                                🗑️
                            </button>
                        </div>
                    `)}
                    ${keys.length === 0 && html`
                        <p class="text-center text-secondary" style="font-size: 0.9em; opacity: 0.7;">
                            No API keys added. Please add a Gemini API key to use the AI features.
                        </p>
                    `}
                </div>
            </div>

            <div class="card">
                <div class="bilingual-text">
                    <span class="text-fa">درباره ما</span>
                    <span class="text-en">About</span>
                </div>
                <p class="text-center mt-4" style="font-size: 0.9em;">
                    Developed by Muneeb Wani<br/>
                    <a href="https://github.com/muneebwanee" target="_blank" style="color: var(--accent)">github.com/muneebwanee</a>
                </p>
            </div>
        </div>
    `;
};

export default Settings;
