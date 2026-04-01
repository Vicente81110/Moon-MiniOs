// js/apps/imageviewer.js

function openImageViewer(fileId, fileName, base64Content) {
    const winId = `img_${fileId}`;
    
    const html = `
        <div style="display: flex; flex-direction: column; height: 100%; background: #222; color: white;">
            <div style="padding: 10px; background: #111; border-bottom: 1px solid #333; display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 13px;">${fileName}</span>
            </div>
            <div style="flex-grow: 1; display: flex; justify-content: center; align-items: center; overflow: hidden; padding: 10px;">
                <img src="${base64Content}" style="max-width: 100%; max-height: 100%; object-fit: contain; box-shadow: 0 5px 15px rgba(0,0,0,0.5);">
            </div>
        </div>
    `;

    WindowManager.createWindow(winId, `Visor de Imágenes - ${fileName}`, html, 600, 450);
}