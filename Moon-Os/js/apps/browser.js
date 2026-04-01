function openBrowser() {
    const html = `
        <div style="display: flex; flex-direction: column; height: 100%; background: #f3f4f6;">
            <div style="display: flex; gap: 5px; padding: 5px; background: #e5e7eb; border-bottom: 1px solid #d1d5db;">
                <input type="text" id="browser-url" value="https://www.bing.com" style="flex-grow: 1; padding: 5px; border: 1px solid #ccc; border-radius: 4px; outline: none;">
                <button onclick="navigateBrowser()" style="padding: 5px 15px; background: #3B82F6; color: white; border: none; border-radius: 4px; cursor: pointer;">Ir</button>
            </div>
            <iframe id="browser-iframe" src="https://www.bing.com" style="flex-grow: 1; border: none; background: white;"></iframe>
        </div>
    `;

    WindowManager.createWindow('browser', 'Navegador', html, 800, 600);

    // Permitir navegar al presionar Enter en el input
    setTimeout(() => {
        const input = document.getElementById('browser-url');
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') navigateBrowser();
        });
    }, 100);
}

window.navigateBrowser = function() {
    const urlInput = document.getElementById('browser-url').value;
    const iframe = document.getElementById('browser-iframe');
    
    let targetUrl = urlInput;
    // Autocompletar protocolo si falta
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
        targetUrl = 'https://' + targetUrl;
    }
    
    iframe.src = targetUrl;
};