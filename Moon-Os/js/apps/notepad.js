// js/apps/notepad.js

function openNotepad(fileId = null, fileName = 'Sin título.txt', initialContent = '') {
    const winId = fileId ? `notepad_${fileId}` : `notepad_new_${Date.now()}`;
    
    const html = `
        <div style="display: flex; flex-direction: column; height: 100%; background: #ffffff; color: #000;">
            <div style="background: #f3f4f6; padding: 5px 10px; border-bottom: 1px solid #d1d5db; display: flex; align-items: center; gap: 10px;">
                <input type="text" id="notepad-filename-${winId}" value="${fileName}" style="padding: 5px; border: 1px solid #ccc; border-radius: 3px; font-size: 14px; outline: none; flex-grow: 1;" placeholder="Nombre del archivo.txt">
                <button id="save-btn-${winId}" onclick="saveNotepadFile('${fileId}', '${winId}')" style="padding: 6px 15px; cursor:pointer; background: #10B981; color: white; border: none; border-radius: 3px; font-weight: bold; font-size: 13px;">💾 Guardar</button>
            </div>
            <textarea id="notepad-editor-${winId}" style="flex-grow: 1; padding: 15px; border: none; outline: none; resize: none; font-family: 'Consolas', monospace; font-size: 14px;">${initialContent}</textarea>
        </div>
    `;

    WindowManager.createWindow(winId, `Bloc de Notas - ${fileName}`, html, 600, 400);
}

window.saveNotepadFile = function(fileId, winId) {
    const content = document.getElementById(`notepad-editor-${winId}`).value;
    const name = document.getElementById(`notepad-filename-${winId}`).value || 'Sin título.txt';
    const btn = document.getElementById(`save-btn-${winId}`);

    if (fileId && fileId !== 'null') {
        MoonVFS.updateFile(fileId, content, name);
        btn.innerText = "¡Guardado!";
        setTimeout(() => btn.innerText = "💾 Guardar", 1500);
    } else {
        const newId = MoonVFS.createFile(name, 'txt', content);
        btn.onclick = () => saveNotepadFile(newId, winId); // Actualiza el botón para futuras guardadas
        btn.innerText = "¡Guardado!";
        setTimeout(() => btn.innerText = "💾 Guardar", 1500);
    }
};