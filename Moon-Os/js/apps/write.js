function openWrite(fileId = null, fileName = 'Sin título.moon', initialContent = '') {
    const winId = fileId ? `write_${fileId}` : `write_new_${Date.now()}`;
    
    const html = `
        <div style="display: flex; flex-direction: column; height: 100%; background: #ffffff; color: #000;">
            <div style="background: #f3f4f6; padding: 8px 10px; border-bottom: 1px solid #d1d5db; display: flex; gap: 8px; align-items: center;">
                <button onclick="document.execCommand('bold', false, null)" style="width: 30px; height: 30px; font-weight: bold; cursor:pointer; border: 1px solid #ccc; background: white; border-radius: 4px;">N</button>
                <button onclick="document.execCommand('italic', false, null)" style="width: 30px; height: 30px; font-style: italic; cursor:pointer; border: 1px solid #ccc; background: white; border-radius: 4px;">K</button>
                <button onclick="document.execCommand('underline', false, null)" style="width: 30px; height: 30px; text-decoration: underline; cursor:pointer; border: 1px solid #ccc; background: white; border-radius: 4px;">S</button>
                
                <div style="width: 1px; height: 20px; background: #ccc; margin: 0 5px;"></div>
                
                <input type="text" id="write-filename-${winId}" value="${fileName}" style="padding: 6px; border: 1px solid #ccc; border-radius: 3px; font-size: 14px; outline: none; flex-grow: 1;" placeholder="Nombre del documento.moon">
                
                <button id="save-btn-${winId}" onclick="saveWriteFile('${fileId}', '${winId}')" style="padding: 6px 15px; cursor:pointer; background: #3B82F6; color: white; border: none; border-radius: 3px; font-weight: bold; font-size: 13px;">💾 Guardar</button>
            </div>
            
            <div style="flex-grow: 1; padding: 30px 40px; background: #fafafa; overflow-y: auto; display: flex; justify-content: center;">
                <div id="write-editor-${winId}" contenteditable="true" style="background: white; width: 100%; max-width: 800px; min-height: 100%; padding: 40px; box-shadow: 0 0 10px rgba(0,0,0,0.1); outline: none; font-family: 'Segoe UI', Arial, sans-serif; font-size: 15px; line-height: 1.6;">${initialContent}</div>
            </div>
        </div>
    `;

    WindowManager.createWindow(winId, `Write - ${fileName}`, html, 750, 550);
}

window.saveWriteFile = function(fileId, winId) {
    const content = document.getElementById(`write-editor-${winId}`).innerHTML;
    const name = document.getElementById(`write-filename-${winId}`).value || 'Sin título.moon';
    const btn = document.getElementById(`save-btn-${winId}`);

    if (fileId && fileId !== 'null') {
        MoonVFS.updateFile(fileId, content, name);
        btn.innerText = "¡Guardado!";
        setTimeout(() => btn.innerText = "💾 Guardar", 1500);
    } else {
        const newId = MoonVFS.createFile(name, 'write', content);
        btn.onclick = () => saveWriteFile(newId, winId);
        btn.innerText = "¡Guardado!";
        setTimeout(() => btn.innerText = "💾 Guardar", 1500);
    }
};