import { html } from 'https://esm.sh/htm/preact';

const Navigation = ({ currentView, setView }) => {
    const navItems = [
        { id: 'home', icon: 'home', label: 'Home' },
        { id: 'details', icon: 'plus-circle', label: 'New' },
        { id: 'settings', icon: 'settings', label: 'Settings' }
    ];

    // We use lucide icons via the global `lucide` object since we imported the script in index.html
    // Or we can just use emoji for now if lucide isn't init properly, but let's try to use lucide.createIcons() or similar.
    // Actually, standard Lucide in browser replaces <i data-lucide="name"></i>.
    // So we will render <i> tags and call lucide.createIcons() in useEffect.
    // However, in Preact, we can just use SVG strings or a helper.
    // For simplicity in this no-build env, I'll use simple SVGs or Emojis for now to ensure it works immediately.
    // I'll use Emojis for the MVP to guarantee no broken icons, then upgrade if needed.

    const icons = {
        home: '🏠',
        'plus-circle': '➕',
        settings: '⚙️'
    };

    return html`
        <nav class="fixed-bottom" style="
            position: fixed; 
            bottom: 0; 
            left: 0; 
            right: 0; 
            background: var(--bg-card); 
            border-top: 1px solid var(--border); 
            display: flex; 
            justify-content: space-around; 
            padding: 12px; 
            z-index: 100;
            max-width: 600px;
            margin: 0 auto;
        ">
            ${navItems.map(item => html`
                <button 
                    onClick=${() => setView(item.id)}
                    style="
                        background: none; 
                        border: none; 
                        color: ${currentView === item.id ? 'var(--accent)' : 'var(--text-secondary)'};
                        font-size: 24px;
                        cursor: pointer;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 4px;
                    "
                >
                    <span>${icons[item.icon]}</span>
                    <span style="font-size: 10px; font-weight: 500;">${item.label}</span>
                </button>
            `)}
        </nav>
    `;
};

export default Navigation;
