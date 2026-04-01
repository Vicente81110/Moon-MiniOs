// js/apps/moondrive.js

let currentExplorerLocation = 'computer'; 

function openMoonDrive() {
    const html = `
        <div style="display: flex; flex-direction: column; height: 100%; background: #ffffff; color: #000000; font-family: 'Segoe UI', Arial, sans-serif; font-size: 12px; position: relative;">
            
            <div style="background: #f5f6f7; padding: 10px; border-bottom: 1px solid #dfdfdf; display: flex; gap: 15px; align-items: center; box-shadow: 0 1px 2px rgba(0,0,0,0.02);">
                <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer;" onclick="document.getElementById('moondrive-import-input').click()">
                    <span style="font-size: 20px;">📥</span><span style="font-size: 10px;">Importar</span>
                    <input type="file" id="moondrive-import-input" style="display: none;" onchange="MoonVFS.importFromPC(event)">
                </div>
                <div style="width: 1px; height: 35px; background: #ccc;"></div>
                <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer;" onclick="inlineCreateInExplorer('folder')">
                    <span style="font-size: 20px;">📁</span><span style="font-size: 10px;">Nueva Carpeta</span>
                </div>
                <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer;" onclick="inlineCreateInExplorer('txt')">
                    <span style="font-size: 20px;">📄</span><span style="font-size: 10px;">Nuevo TXT</span>
                </div>
                <div style="width: 1px; height: 35px; background: #ccc;"></div>
                <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer;" onclick="MoonVFS.pasteFile(currentExplorerLocation)">
                    <span style="font-size: 20px;">📋</span><span style="font-size: 10px;">Pegar</span>
                </div>
                <div style="width: 1px; height: 35px; background: #ccc;"></div>
                <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer;" onclick="MoonVFS.exportFolder(currentExplorerLocation)">
                    <span style="font-size: 20px;">📦</span><span style="font-size: 10px;">Exportar Todo</span>
                </div>
            </div>

            <div style="display: flex; padding: 6px 10px; background: #ffffff; border-bottom: 1px solid #e5e5e5; align-items: center; gap: 8px;">
                <button onclick="explorerGoUp()" style="border: 1px solid #ccc; background: #f0f0f0; padding: 3px 8px; border-radius: 3px; cursor: pointer; font-size: 12px; display: flex; gap: 5px; align-items: center;">
                    <span style="font-size: 14px; font-weight: bold; color: #1979ca;">↑</span> Subir
                </button>
                <div style="flex-grow: 1; border: 1px solid #d9d9d9; display: flex; align-items: center; padding: 2px 5px; background: white;">
                    <span style="color: #666; margin-right: 5px;">📁</span>
                    <span style="color: #666; font-size: 10px;">▶</span>
                    <input type="text" id="explorer-path" readonly value="Este equipo" style="border: none; outline: none; flex-grow: 1; padding: 3px; font-size: 12px; font-family: 'Segoe UI';">
                </div>
            </div>

            <div style="display: flex; flex-grow: 1; overflow: hidden;" onclick="closeExplorerMenu()">
                <div style="width: 180px; background: #ffffff; border-right: 1px solid #e5e5e5; overflow-y: auto; padding-top: 5px;">
                    <div class="nav-item active" id="nav-computer" onclick="setExplorerLocation('computer')">💻 Este equipo</div>
                    <div style="margin: 10px 0 5px 20px; border-top: 1px solid #f0f0f0; width: 80%;"></div>
                    <div class="nav-header">⭐ Acceso rápido</div>
                    <div class="nav-item" id="nav-desktop" onclick="setExplorerLocation('desktop')">🖥️ Escritorio</div>
                    <div class="nav-item" id="nav-downloads" onclick="setExplorerLocation('downloads')">⬇️ Descargas</div>
                    <div class="nav-item" id="nav-documentos" onclick="setExplorerLocation('documentos')">📄 Documentos</div>
                    <div class="nav-item" id="nav-images" onclick="setExplorerLocation('images')">🖼️ Imágenes</div>
                    <div style="margin: 15px 0 5px 20px; border-top: 1px solid #f0f0f0; width: 80%;"></div>
                    <div class="nav-item" id="nav-moondrive" onclick="setExplorerLocation('moondrive')">☁️ MoonDrive</div>
                    <div class="nav-item" id="nav-trash" onclick="setExplorerLocation('trash')">🗑️ Papelera</div>
                </div>

                <div style="flex-grow: 1; display: flex; flex-direction: column; background: #ffffff; position: relative;" id="explorer-main-area">
                    <div id="explorer-header-row" style="display: flex; border-bottom: 1px solid #e5e5e5; padding: 5px 0; color: #4c4c4c; font-weight: 600;">
                        <div style="width: 30px;"></div>
                        <div style="flex-grow: 2; border-right: 1px solid #e5e5e5; padding-left: 5px;">Nombre</div>
                        <div style="flex-grow: 1; border-right: 1px solid #e5e5e5; padding-left: 10px;">Fecha de modificación</div>
                        <div style="width: 120px; border-right: 1px solid #e5e5e5; padding-left: 10px;">Tipo</div>
                        <div style="width: 80px; padding-left: 10px;">Tamaño</div>
                    </div>
                    
                    <div id="moondrive-file-list" style="flex-grow: 1; overflow-y: auto; padding: 2px;" oncontextmenu="event.preventDefault()">
                        </div>
                    
                    <div style="border-top: 1px solid #e5e5e5; background: #f0f0f0; padding: 3px 10px; color: #333; display: flex; gap: 20px;">
                        <span id="status-item-count">0 elementos</span>
                    </div>

                    <div id="explorer-context-menu" style="display: none; position: absolute; background: white; border: 1px solid #ccc; box-shadow: 2px 2px 5px rgba(0,0,0,0.2); z-index: 1000; flex-direction: column; min-width: 150px; padding: 4px 0;">
                        </div>
                </div>
            </div>

            <style>
                .nav-header { font-weight: 600; padding: 4px 10px 4px 20px; color: #333; font-size: 12px; cursor: default; }
                .nav-item { padding: 4px 10px 4px 25px; color: #333; cursor: pointer; display: flex; gap: 8px; align-items: center; font-size: 12px; transition: background 0.1s; border: 1px solid transparent; }
                .nav-item:hover { background: #e5f3ff; }
                .nav-item.active { background: #cce8ff; border: 1px solid #99d1ff; }
                .file-row { display: flex; padding: 4px 0; border: 1px solid transparent; cursor: default; align-items: center; color: #000; }
                .file-row:hover { background: #e5f3ff; border: 1px solid #d9ebf9; }
                .file-row.selected { background: #cce8ff; border: 1px solid #99d1ff; }
                .exp-ctx-item { padding: 6px 15px; cursor: pointer; color: #333; transition: background 0.1s; }
                .exp-ctx-item:hover { background: #f0f0f0; }
                .exp-ctx-divider { height: 1px; background: #eee; margin: 4px 0; }
            </style>
        </div>
    `;

    WindowManager.createWindow('moondrive', 'Explorador de Archivos', html, 850, 500);
    setTimeout(() => {
        MoonVFS.renderExplorer = window.renderExplorerFiles;
        setExplorerLocation('computer'); // Inicia en Este equipo por defecto
    }, 50);
}

function getExplorerPathString(locId) {
    const roots = { 'computer': 'Este equipo', 'desktop': 'Este equipo > Escritorio', 'downloads': 'Este equipo > Descargas', 'documentos': 'Este equipo > Documentos', 'images': 'Este equipo > Imágenes', 'moondrive': 'MoonDrive', 'trash': 'Papelera de reciclaje' };
    if (roots[locId]) return roots[locId];
    const folder = MoonVFS.getFile(locId);
    if (folder) return getExplorerPathString(folder.location) + ' > ' + folder.name;
    return 'Este equipo';
}

window.explorerGoUp = function() {
    if (currentExplorerLocation === 'computer') return;
    
    const roots = ['desktop', 'downloads', 'documentos', 'images', 'moondrive', 'trash'];
    if (roots.includes(currentExplorerLocation)) {
        setExplorerLocation('computer');
        return;
    }
    
    const folder = MoonVFS.getFile(currentExplorerLocation);
    if (folder) setExplorerLocation(folder.location);
    else setExplorerLocation('computer');
};

window.setExplorerLocation = function(loc) {
    currentExplorerLocation = loc;
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    const activeItem = document.getElementById(`nav-${loc}`);
    if(activeItem) activeItem.classList.add('active');
    
    const pathInput = document.getElementById('explorer-path');
    if(pathInput) pathInput.value = getExplorerPathString(loc);
    
    renderExplorerFiles();
};

window.renderExplorerFiles = function() {
    const container = document.getElementById('moondrive-file-list');
    const statusCount = document.getElementById('status-item-count');
    const headerRow = document.getElementById('explorer-header-row');
    
    if (!container) return;
    container.innerHTML = '';
    closeExplorerMenu();

    // LÓGICA DE LA VISTA "ESTE EQUIPO"
    if (currentExplorerLocation === 'computer') {
        if(headerRow) headerRow.style.display = 'none';
        if(statusCount) statusCount.innerText = '1 unidad de almacenamiento detectada';

        // Calcular espacio real consumido (Cada carácter de LocalStorage = 2 bytes aprox en memoria, lo simplificamos a 1 byte real de almacenamiento de cadena)
        const rawData = localStorage.getItem('moon_files') || '';
        const bytesUsed = rawData.length * 2; 
        const mbUsed = (bytesUsed / (1024 * 1024)).toFixed(2);
        const mbTotal = 5.00; // 5MB Límite técnico duro de los navegadores para LocalStorage
        
        let percent = (mbUsed / mbTotal) * 100;
        if(percent > 100) percent = 100;
        let barColor = percent > 90 ? '#d13438' : '#1979ca'; // Rojo si está lleno

        container.innerHTML = `
            <div style="padding: 20px; font-size: 14px; font-weight: 600; color: #333;">Dispositivos y unidades</div>
            <div style="display: flex; gap: 20px; padding: 0 20px;">
                <div style="display: flex; border: 1px solid #ccc; width: 260px; padding: 10px; border-radius: 4px; background: #fdfdfd; cursor: pointer; transition: background 0.1s;" onmouseover="this.style.background='#e5f3ff'" onmouseout="this.style.background='#fdfdfd'" ondblclick="setExplorerLocation('documentos')">
                    <div style="font-size: 36px; margin-right: 15px;">💾</div>
                    <div style="flex-grow: 1; display: flex; flex-direction: column; justify-content: center;">
                        <div style="font-weight: 600; margin-bottom: 5px; color: #000;">Disco Local (M:)</div>
                        <div style="height: 14px; background: #e5e5e5; border: 1px solid #ccc; border-radius: 2px; overflow: hidden; margin-bottom: 5px;">
                            <div style="height: 100%; width: ${percent}%; background: ${barColor};"></div>
                        </div>
                        <div style="font-size: 11px; color: #666;">${mbUsed} MB libres de ${mbTotal} MB (Cuota web)</div>
                    </div>
                </div>
            </div>
            <div style="padding: 20px; font-size: 11px; color: #999;">
                * Moon OS utiliza el almacenamiento local seguro de tu navegador (LocalStorage). Al alcanzar los 5 MB, no podrás crear ni importar más archivos hasta que borres otros.
            </div>
        `;
        return;
    }

    // LÓGICA NORMAL PARA CARPETAS
    if(headerRow) headerRow.style.display = 'flex';

    const filesToShow = MoonVFS.files.filter(f => f.location === currentExplorerLocation);
    
    if (currentExplorerLocation === 'desktop') {
        let desktopShortcuts = JSON.parse(localStorage.getItem('moon_desktop_shortcuts')) || ['browser', 'moondrive', 'settings', 'trash'];
        const knownApps = {
            'browser': 'Navegador', 'moondrive': 'Explorador', 'settings': 'Ajustes', 'trash': 'Papelera',
            'cmd': 'CMD', 'notepad': 'Bloc de Notas', 'write': 'Write', 'calc': 'Calculadora', 'taskmanager': 'Admin. de Tareas',
            'calendar': 'Calendario', 'grid': 'Grid', 'snake': 'Snake Game', 'slide': 'Slide', 'minesweeper': 'Buscaminas'
        };

        desktopShortcuts.forEach(appId => {
            container.innerHTML += `
                <div class="file-row" id="row-shortcut-${appId}" onclick="this.classList.toggle('selected')" ondblclick="eval(systemIcons.find(s=>s.id==='${appId}').action)">
                    <div style="width: 30px; text-align: center; font-size: 16px;">🔗</div>
                    <div style="flex-grow: 2; padding-left: 5px;" class="explorer-file-name">${knownApps[appId] || appId}</div>
                    <div style="flex-grow: 1; padding-left: 10px; color: #666;">Sistema</div>
                    <div style="width: 120px; padding-left: 10px; color: #666;">Acceso directo</div>
                    <div style="width: 80px; padding-left: 10px; color: #666;">1 KB</div>
                </div>
            `;
        });
    }

    if (filesToShow.length === 0 && (currentExplorerLocation !== 'desktop' || container.innerHTML === '')) {
        container.innerHTML = `<div style="padding: 20px; color: #999;">Esta carpeta está vacía.</div>`;
        if (statusCount) statusCount.innerText = '0 elementos';
        return;
    }

    let totalElements = filesToShow.length;
    if (currentExplorerLocation === 'desktop') {
        const shortcuts = JSON.parse(localStorage.getItem('moon_desktop_shortcuts')) || [];
        totalElements += shortcuts.length;
    }
    
    if (statusCount) statusCount.innerText = `${totalElements} elemento(s)`;

    filesToShow.forEach(file => {
        let iconStr = '📄'; let typeStr = 'Documento';
        if (file.type === 'folder') { iconStr = '📁'; typeStr = 'Carpeta de archivos'; }
        else if (file.type === 'txt') { iconStr = '📄'; typeStr = 'Documento de texto'; }
        else if (file.type === 'write') { iconStr = '📝'; typeStr = 'Archivo MoonWrite'; }
        else if (file.type === 'image') { iconStr = '🖼️'; typeStr = 'Imagen'; }
        
        container.innerHTML += `
            <div class="file-row" id="row-${file.id}" onclick="this.classList.toggle('selected')" ondblclick="MoonVFS.openFile('${file.id}')" oncontextmenu="showExplorerMenu(event, '${file.id}')">
                <div style="width: 30px; text-align: center; font-size: 16px;">${iconStr}</div>
                <div style="flex-grow: 2; padding-left: 5px;" class="explorer-file-name">${file.name}</div>
                <div style="flex-grow: 1; padding-left: 10px; color: #666;">${file.date || ''}</div>
                <div style="width: 120px; padding-left: 10px; color: #666;">${typeStr}</div>
                <div style="width: 80px; padding-left: 10px; color: #666;">
                    <span>${file.size || ''}</span>
                </div>
            </div>
        `;
    });
};

window.showExplorerMenu = function(e, fileId) {
    e.preventDefault();
    e.stopPropagation();
    
    document.querySelectorAll('.file-row').forEach(el => el.classList.remove('selected'));
    document.getElementById(`row-${fileId}`).classList.add('selected');

    const menu = document.getElementById('explorer-context-menu');
    const mainArea = document.getElementById('explorer-main-area');
    
    if (!menu || !mainArea) return;

    if (currentExplorerLocation === 'trash') {
        menu.innerHTML = `
            <div class="exp-ctx-item" onclick="MoonVFS.restoreFile('${fileId}'); renderExplorerFiles();">Restaurar</div>
            <div class="exp-ctx-divider"></div>
            <div class="exp-ctx-item" style="color: #d13438;" onclick="MoonVFS.permanentlyDelete('${fileId}'); renderExplorerFiles();">Eliminar definitivamente</div>
        `;
    } else {
        menu.innerHTML = `
            <div class="exp-ctx-item" onclick="MoonVFS.openFile('${fileId}'); closeExplorerMenu();">Abrir</div>
            <div class="exp-ctx-divider"></div>
            <div class="exp-ctx-item" onclick="MoonVFS.copyFile('${fileId}'); closeExplorerMenu();">Copiar</div>
            <div class="exp-ctx-item" onclick="MoonVFS.cutFile('${fileId}'); closeExplorerMenu();">Cortar</div>
            <div class="exp-ctx-divider"></div>
            <div class="exp-ctx-item" onclick="startInlineRenameExplorer('${fileId}'); closeExplorerMenu();">Cambiar nombre</div>
            <div class="exp-ctx-item" onclick="MoonVFS.exportToPC('${fileId}'); closeExplorerMenu();">Exportar a PC física</div>
            <div class="exp-ctx-divider"></div>
            <div class="exp-ctx-item" style="color: #d13438;" onclick="MoonVFS.moveToTrash('${fileId}'); renderExplorerFiles();">Eliminar</div>
        `;
    }

    menu.style.display = 'flex';
    
    const rect = mainArea.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    if (x + 150 > rect.width) x = rect.width - 150;
    if (y + 200 > rect.height) y = rect.height - 200;

    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;
};

window.closeExplorerMenu = function() {
    const menu = document.getElementById('explorer-context-menu');
    if (menu) menu.style.display = 'none';
};

window.inlineCreateInExplorer = function(type) {
    const ext = type === 'txt' ? '.txt' : (type === 'write' ? '.moon' : '');
    const defaultName = type === 'folder' ? 'Nueva Carpeta' : `Nuevo Documento${ext}`;
    const newId = MoonVFS.createFile(defaultName, type, '', currentExplorerLocation);
    startInlineRenameExplorer(newId);
};

window.startInlineRenameExplorer = function(id) {
    closeExplorerMenu();
    const row = document.getElementById(`row-${id}`);
    if(!row) return;
    
    const nameCell = row.querySelector('.explorer-file-name');
    const oldName = nameCell.innerText;
    
    nameCell.innerHTML = `<input type="text" id="rename-exp-${id}" value="${oldName}" style="width: 90%; border: 1px solid #1979ca; padding: 2px; outline: none; font-family: 'Segoe UI'; font-size: 12px;">`;
    const input = document.getElementById(`rename-exp-${id}`);
    
    input.onclick = (e) => e.stopPropagation();
    input.focus();
    input.select();
    
    const saveRename = () => {
        if(input.disabled) return;
        input.disabled = true;
        
        let newName = input.value.trim() || oldName;
        const fileData = MoonVFS.getFile(id);
        if (fileData && fileData.type === 'txt' && !newName.endsWith('.txt')) newName += '.txt';
        if (fileData && fileData.type === 'write' && !newName.endsWith('.moon')) newName += '.moon';

        MoonVFS.updateFile(id, null, newName); 
    };

    input.addEventListener('blur', saveRename);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') saveRename();
    });
};