// js/system/core.js

let isTaskbarLocked = false; 
let targetAppToPin = null;

const systemIcons = [
    { id: 'browser', name: 'Navegador', action: 'openBrowser()', svg: '<svg width="32" height="32" fill="var(--text-main)" viewBox="0 0 16 16"><path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.025 7.025 0 0 0 2.255 4H4.09zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 0 0-.656 2.5h2.49zM4.847 5c-.17.733-.28 1.576-.302 2.5h2.955V5H4.847z"/></svg>' },
    { id: 'moondrive', name: 'Explorador', action: 'openMoonDrive()', svg: '<svg width="32" height="32" fill="var(--text-main)" viewBox="0 0 16 16"><path d="M9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.825a2 2 0 0 1-1.991-1.819l-.637-7a1.99 1.99 0 0 1 .342-1.31L.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3zm-8.322.12C1.72 3.042 1.95 3 2.19 3h5.396l-.707-.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981l.006.139z"/></svg>' },
    { id: 'settings', name: 'Ajustes', action: 'openSettings()', svg: '<svg width="32" height="32" fill="var(--text-main)" viewBox="0 0 16 16"><path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/><path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/></svg>' },
    { id: 'trash', name: 'Papelera', action: 'openTrash()', svg: '<svg width="32" height="32" fill="var(--text-main)" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>' },
    { id: 'cmd', name: 'CMD', action: 'openCMD()', svg: '<svg width="32" height="32" fill="var(--text-main)" viewBox="0 0 16 16"><path d="M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2zm.5 3.5l3 3-3 3-.7-.7L4.1 8 1.8 5.7l.7-.7zM6 11h4v1H6v-1z"/></svg>' },
    { id: 'notepad', name: 'Bloc de Notas', action: 'openNotepad()', svg: '<svg width="32" height="32" fill="var(--text-main)" viewBox="0 0 16 16"><path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1z"/><path d="M6 5h4v1H6V5zm0 2h4v1H6V7zm0 2h4v1H6V9z"/></svg>' },
    { id: 'write', name: 'Write', action: 'openWrite()', svg: '<svg width="32" height="32" fill="var(--text-main)" viewBox="0 0 16 16"><path d="M2 2v12h12V2H2zm11 11H3V3h10v10z"/><path d="M4 4h8v1H4zM4 6h8v1H4zM4 8h6v1H4z"/></svg>' },
    { id: 'calc', name: 'Calculadora', action: 'openCalculator()', svg: '<svg width="32" height="32" fill="var(--text-main)" viewBox="0 0 16 16"><path d="M12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h8zM4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4z"/><path d="M4 2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-2z"/></svg>' },
    { id: 'taskmanager', name: 'Admin. de Tareas', action: 'openTaskManager()', svg: '<svg width="32" height="32" fill="var(--text-main)" viewBox="0 0 16 16"><path d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/></svg>' },
    { id: 'minesweeper', name: 'Buscaminas', action: 'openMinesweeper()', svg: '<svg width="32" height="32" fill="var(--text-main)" viewBox="0 0 16 16"><path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zM7 2h2v3H7V2zm0 9h2v3H7v-3zm5-4v2h-3V7h3zm-9 0v2H0V7h3z"/></svg>' },
    { id: 'calendar', name: 'Calendario', action: 'openCalendarApp()', svg: '<svg width="32" height="32" fill="var(--text-main)" viewBox="0 0 16 16"><path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/></svg>' }
];

document.addEventListener('DOMContentLoaded', () => {
    initSystem();
});

function initSystem() {
    startClock();
    renderSystemTrayCalendar(); 
    initStartMenu();
    initContextMenus();
    WindowManager.initTaskbar();
    WindowManager.initTaskbarDragAndDrop(); 
    initSelectionBox(); // Motor de Caja de Selección Azul
    
    const savedAccent = localStorage.getItem('moon_accent');
    if (savedAccent) document.documentElement.style.setProperty('--accent', savedAccent);

    const savedBg = localStorage.getItem('moon_desktop_bg');
    if (savedBg) {
        document.getElementById('desktop').style.backgroundImage = `url(${savedBg})`;
        const moon = document.querySelector('.moon-background');
        if(moon) moon.style.display = 'none';
    }

    renderDesktopIcons();
}

function initSelectionBox() {
    const selBox = document.createElement('div');
    selBox.id = 'moon-selection-box';
    selBox.style.cssText = 'position: fixed; border: 1px solid rgba(0, 120, 215, 0.8); background: rgba(0, 120, 215, 0.3); pointer-events: none; z-index: 999999; display: none;';
    document.body.appendChild(selBox);

    let isSelecting = false;
    let selStartX = 0, selStartY = 0;
    let selectContainer = null; 

    document.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        
        const isDesktop = e.target.id === 'desktop' || e.target.id === 'desktop-icons';
        const isExplorer = e.target.id === 'moondrive-file-list';

        if (isDesktop || isExplorer) {
            selectContainer = isDesktop ? 'desktop' : 'explorer';
            isSelecting = true;
            selStartX = e.clientX;
            selStartY = e.clientY;
            selBox.style.left = selStartX + 'px';
            selBox.style.top = selStartY + 'px';
            selBox.style.width = '0px';
            selBox.style.height = '0px';
            selBox.style.display = 'block';

            if (!e.ctrlKey) {
                if (isDesktop) document.querySelectorAll('.desktop-icon').forEach(el => el.classList.remove('selected'));
                if (isExplorer) document.querySelectorAll('.file-row').forEach(el => el.classList.remove('selected'));
            }
        } else if (!e.ctrlKey && !e.target.closest('.desktop-icon') && !e.target.closest('.file-row') && !e.target.closest('.context-menu')) {
            // Deseleccionar todo si hacemos clic en otra cosa
            document.querySelectorAll('.desktop-icon, .file-row').forEach(el => el.classList.remove('selected'));
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (!isSelecting) return;
        const currentX = e.clientX;
        const currentY = e.clientY;
        const left = Math.min(selStartX, currentX);
        const top = Math.min(selStartY, currentY);
        const width = Math.abs(currentX - selStartX);
        const height = Math.abs(currentY - selStartY);

        selBox.style.left = left + 'px';
        selBox.style.top = top + 'px';
        selBox.style.width = width + 'px';
        selBox.style.height = height + 'px';

        const boxRect = selBox.getBoundingClientRect();
        const items = selectContainer === 'desktop' ? document.querySelectorAll('.desktop-icon') : document.querySelectorAll('.file-row');
        
        items.forEach(item => {
            const rect = item.getBoundingClientRect();
            const overlap = !(boxRect.right < rect.left || boxRect.left > rect.right || boxRect.bottom < rect.top || boxRect.top > rect.bottom);
            if (overlap) {
                item.classList.add('selected');
            } else if (!e.ctrlKey) {
                item.classList.remove('selected');
            }
        });
    });

    document.addEventListener('mouseup', () => {
        if (isSelecting) {
            isSelecting = false;
            selBox.style.display = 'none';
            selectContainer = null;
        }
    });
}

window.renderSystemTrayCalendar = function() {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

    let daysHTML = '';
    let startingPos = (firstDay === 0) ? 6 : firstDay - 1;
    for(let i=0; i < startingPos; i++) daysHTML += '<div></div>';
    
    for(let i=1; i <= daysInMonth; i++) {
        const isToday = i === now.getDate();
        daysHTML += `<div style="padding: 6px; text-align: center; border-radius: 4px; ${isToday ? 'background: var(--accent); color: white; font-weight: bold;' : 'color: #333;'}">${i}</div>`;
    }

    const body = document.getElementById('calendar-body');
    if(body) {
        body.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(7, 1fr); padding: 10px 10px 5px 10px; text-align: center; font-weight: 600; font-size: 11px; color: #666; border-bottom: 1px solid #eee;">
                <div>LU</div><div>MA</div><div>MI</div><div>JU</div><div>VI</div><div>SA</div><div>DO</div>
            </div>
            <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; padding: 10px; font-size: 12px; background: white;">
                ${daysHTML}
            </div>
        `;
    }
};

window.renderDesktopIcons = function() {
    const container = document.getElementById('desktop-icons');
    if (!container) return;
    
    const savedPositions = JSON.parse(localStorage.getItem('moon_icon_positions')) || {};

    container.innerHTML = '';
    let index = 0;

    let desktopShortcuts = JSON.parse(localStorage.getItem('moon_desktop_shortcuts')) || ['browser', 'moondrive', 'settings', 'trash'];

    desktopShortcuts.forEach(appId => {
        const sys = systemIcons.find(s => s.id === appId);
        if(!sys) return;
        
        const div = document.createElement('div');
        div.className = 'desktop-icon';
        div.id = `icon-${sys.id}`;
        div.ondblclick = () => eval(sys.action);
        div.innerHTML = `${sys.svg}<span class="desktop-icon-name" style="width: 100%;">${sys.name}</span>`;
        
        div.style.top = savedPositions[div.id] ? savedPositions[div.id].top : `${20 + (index * 90)}px`;
        div.style.left = savedPositions[div.id] ? savedPositions[div.id].left : `20px`;
        
        container.appendChild(div);
        makeIconDraggable(div);
        index++;
    });

    const desktopFiles = MoonVFS.files.filter(f => f.location === 'desktop');
    desktopFiles.forEach(file => {
        const div = document.createElement('div');
        div.className = 'desktop-icon';
        div.id = `icon-${file.id}`;
        div.ondblclick = () => MoonVFS.openFile(file.id);
        
        let iconSVG = '';
        if (file.type === 'folder') {
            iconSVG = '<svg width="32" height="32" fill="#FACC15" viewBox="0 0 16 16"><path d="M9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.825a2 2 0 0 1-1.991-1.819l-.637-7a1.99 1.99 0 0 1 .342-1.31L.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3zm-8.322.12C1.72 3.042 1.95 3 2.19 3h5.396l-.707-.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981l.006.139z"/></svg>';
        } else if (file.type === 'image') {
            iconSVG = '<svg width="32" height="32" fill="#A855F7" viewBox="0 0 16 16"><path d="M4.502 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/><path d="M14.002 13a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2V5A2 2 0 0 1 2 3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-1.998 2zM14 2H4a1 1 0 0 0-1 1h9.002a2 2 0 0 1 2 2v7A1 1 0 0 0 15 11V3a1 1 0 0 0-1-1zM2.002 4a1 1 0 0 0-1 1v8l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094l1.777 1.947V5a1 1 0 0 0-1-1h-10z"/></svg>';
        } else if (file.type === 'txt') {
            iconSVG = '<svg width="32" height="32" fill="#E0E7FF" viewBox="0 0 16 16"><path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"/></svg>';
        } else if (file.type === 'grid') {
            iconSVG = '<svg width="32" height="32" fill="#217346" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M14 2H2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zM2 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H2z"/><path fill-rule="evenodd" d="M4.5 4a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 1 0v-7a.5.5 0 0 0-.5-.5zm3 0a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 1 0v-7a.5.5 0 0 0-.5-.5zm3 0a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 1 0v-7a.5.5 0 0 0-.5-.5zm3 0a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 1 0v-7a.5.5 0 0 0-.5-.5zM2 6.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/></svg>';
        } else if (file.type === 'slide') {
            iconSVG = '<svg width="32" height="32" fill="#d04423" viewBox="0 0 16 16"><path d="M0 3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3zm2-1a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H2z"/><path d="M4.5 5a.5.5 0 0 0-.5.5v5a.5.5 0 0 0 1 0v-5a.5.5 0 0 0-.5-.5zm3 0a.5.5 0 0 0-.5.5v5a.5.5 0 0 0 1 0v-5a.5.5 0 0 0-.5-.5zm3 0a.5.5 0 0 0-.5.5v5a.5.5 0 0 0 1 0v-5a.5.5 0 0 0-.5-.5z"/></svg>';
        } else {
            iconSVG = '<svg width="32" height="32" fill="#3B82F6" viewBox="0 0 16 16"><path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"/><path d="M5.5 8a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 2a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5z"/></svg>';
        }

        div.innerHTML = `${iconSVG}<span class="desktop-icon-name" style="width: 100%;">${file.name}</span>`;
        div.style.top = savedPositions[div.id] ? savedPositions[div.id].top : `${20 + (index * 90)}px`;
        div.style.left = savedPositions[div.id] ? savedPositions[div.id].left : `20px`;

        container.appendChild(div);
        makeIconDraggable(div);
        index++;
    });
};

window.inlineCreateOnDesktop = function(type) {
    const ext = type === 'txt' ? '.txt' : (type === 'write' ? '.moon' : (type === 'grid' ? '.grid' : (type === 'slide' ? '.slide' : '')));
    const defaultName = type === 'folder' ? 'Nueva Carpeta' : `Nuevo Documento${ext}`;
    const newId = MoonVFS.createFile(defaultName, type, '', 'desktop');
    renderDesktopIcons();
    startInlineRename(newId);
};

window.startInlineRename = function(id) {
    const iconDiv = document.getElementById(`icon-${id}`);
    if (!iconDiv) return;

    const nameSpan = iconDiv.querySelector('.desktop-icon-name');
    const oldName = nameSpan.innerText;
    
    nameSpan.innerHTML = `<input type="text" id="rename-${id}" value="${oldName}" style="width: 100px; color: black; text-align: center; font-size: 11px; padding: 2px; border: 1px solid var(--accent); outline: none;">`;
    
    const input = document.getElementById(`rename-${id}`);
    input.focus();
    input.select();
    
    const saveRename = () => {
        if(input.disabled) return; 
        input.disabled = true;
        
        let newName = input.value.trim() || oldName;
        const fileData = MoonVFS.getFile(id);
        if (fileData && fileData.type === 'txt' && !newName.endsWith('.txt')) newName += '.txt';
        if (fileData && fileData.type === 'write' && !newName.endsWith('.moon')) newName += '.moon';
        if (fileData && fileData.type === 'grid' && !newName.endsWith('.grid')) newName += '.grid';
        if (fileData && fileData.type === 'slide' && !newName.endsWith('.slide')) newName += '.slide';

        MoonVFS.updateFile(id, null, newName); 
    };

    input.addEventListener('blur', saveRename);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') saveRename();
    });
};

function startClock() {
    function updateTime() {
        const now = new Date();
        let h = now.getHours();
        let m = now.getMinutes();
        h = h < 10 ? '0'+h : h;
        m = m < 10 ? '0'+m : m;
        document.getElementById('clock-time').textContent = `${h}:${m}`;
        document.getElementById('cal-time').textContent = `${h}:${m}`;
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dateStr = now.toLocaleDateString('es-ES', options);
        document.getElementById('clock-date').textContent = now.toLocaleDateString('es-ES');
        document.getElementById('cal-date').textContent = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
    }
    updateTime();
    setInterval(updateTime, 1000);
}

function initStartMenu() {
    const startBtn = document.getElementById('start-button');
    const startMenu = document.getElementById('start-menu');
    startBtn.addEventListener('click', (e) => { e.stopPropagation(); startMenu.classList.toggle('hidden'); });
    document.addEventListener('click', (e) => {
        if (!startMenu.contains(e.target) && e.target !== startBtn && !e.target.closest('.context-menu')) {
            startMenu.classList.add('hidden');
        }
    });
}

function initContextMenus() {
    const desktopMenu = document.getElementById('desktop-context-menu');
    const taskbarMenu = document.getElementById('taskbar-context-menu');
    const iconMenu = document.getElementById('icon-context-menu');
    const startAppMenu = document.getElementById('start-app-context-menu');
    const calendarPanel = document.getElementById('calendar-panel');
    const sysTray = document.getElementById('system-tray');

    sysTray.addEventListener('click', (e) => { e.stopPropagation(); calendarPanel.classList.toggle('hidden'); });

    function showMenuSmart(menu, x, y) {
        menu.style.display = 'block';
        const rect = menu.getBoundingClientRect();
        if (x + rect.width > window.innerWidth) x = window.innerWidth - rect.width - 5;
        if (y + rect.height > window.innerHeight) y = window.innerHeight - rect.height - 5;
        menu.style.left = `${x}px`;
        menu.style.top = `${y}px`;
    }

    document.getElementById('desktop').addEventListener('contextmenu', (e) => {
        if (e.target.closest('.window')) return; 
        e.preventDefault();
        hideAllMenus();
        
        if (e.target.closest('.desktop-icon')) {
            const selectedIcon = e.target.closest('.desktop-icon');
            const fileIdStr = selectedIcon.id.replace('icon-', '');
            
            // Si el ícono clicado no estaba seleccionado, deseleccionar los demás y seleccionar este
            if (!selectedIcon.classList.contains('selected')) {
                document.querySelectorAll('.desktop-icon').forEach(el => el.classList.remove('selected'));
                selectedIcon.classList.add('selected');
            }

            document.getElementById('icon-menu-open').onclick = () => selectedIcon.ondblclick();
            
            // LOGICA EXCLUSIVA PARA LA PAPELERA
            if (fileIdStr === 'trash') {
                document.getElementById('icon-menu-rename').style.display = 'none';
                document.getElementById('icon-menu-copy').style.display = 'none';
                document.getElementById('icon-menu-cut').style.display = 'none';
                
                const delBtn = document.getElementById('icon-menu-delete');
                delBtn.innerText = 'Vaciar Papelera';
                delBtn.onclick = () => { MoonVFS.emptyTrash(); renderDesktopIcons(); alert('Papelera vaciada.'); };
            } else {
                // LOGICA NORMAL Y MULTI-ELIMINACIÓN
                document.getElementById('icon-menu-rename').style.display = 'block';
                document.getElementById('icon-menu-copy').style.display = 'block';
                document.getElementById('icon-menu-cut').style.display = 'block';
                
                const delBtn = document.getElementById('icon-menu-delete');
                delBtn.innerText = 'Eliminar';
                
                delBtn.onclick = () => {
                    document.querySelectorAll('.desktop-icon.selected').forEach(selIcon => {
                        const idStr = selIcon.id.replace('icon-', '');
                        if(idStr.startsWith('file_')) { 
                            MoonVFS.moveToTrash(idStr); 
                        } else { 
                            let shortcuts = JSON.parse(localStorage.getItem('moon_desktop_shortcuts')) || [];
                            shortcuts = shortcuts.filter(s => s !== idStr);
                            localStorage.setItem('moon_desktop_shortcuts', JSON.stringify(shortcuts));
                        }
                    });
                    renderDesktopIcons();
                };

                document.getElementById('icon-menu-rename').onclick = () => {
                    if(fileIdStr.startsWith('file_')) { startInlineRename(fileIdStr); } 
                    else { alert('Los accesos directos del sistema no se pueden renombrar.'); }
                };

                if (fileIdStr.startsWith('file_')) {
                    document.getElementById('icon-menu-copy').style.color = 'var(--text-main)';
                    document.getElementById('icon-menu-cut').style.color = 'var(--text-main)';
                    document.getElementById('icon-menu-copy').onclick = () => MoonVFS.copyFile(fileIdStr);
                    document.getElementById('icon-menu-cut').onclick = () => MoonVFS.cutFile(fileIdStr);
                } else {
                    document.getElementById('icon-menu-copy').style.color = '#666';
                    document.getElementById('icon-menu-cut').style.color = '#666';
                }
            }
            
            showMenuSmart(iconMenu, e.clientX, e.clientY);
        } else {
            const pasteBtn = document.getElementById('desktop-menu-paste');
            if (MoonVFS.clipboard) {
                pasteBtn.style.color = 'var(--text-main)';
                pasteBtn.onclick = () => { MoonVFS.pasteFile('desktop'); hideAllMenus(); };
            } else {
                pasteBtn.style.color = '#666';
                pasteBtn.onclick = null;
            }

            showMenuSmart(desktopMenu, e.clientX, e.clientY);
        }
    });

    document.getElementById('taskbar').addEventListener('contextmenu', (e) => { e.preventDefault(); hideAllMenus(); showMenuSmart(taskbarMenu, e.clientX, e.clientY - 100); });
    
    document.getElementById('start-menu').addEventListener('contextmenu', (e) => {
        const appItem = e.target.closest('.app-item');
        if (appItem) {
            e.preventDefault();
            hideAllMenus();
            targetAppToPin = appItem.getAttribute('data-appid');
            
            const pinBtn = document.getElementById('pin-to-taskbar-btn');
            pinBtn.innerText = WindowManager.pinnedApps.includes(targetAppToPin) ? "Desfijar de la barra de tareas" : "Fijar a la barra de tareas";
            
            const deskBtn = document.getElementById('add-to-desktop-btn');
            let shortcuts = JSON.parse(localStorage.getItem('moon_desktop_shortcuts')) || ['browser', 'moondrive', 'settings', 'trash'];
            deskBtn.innerText = shortcuts.includes(targetAppToPin) ? "Quitar del escritorio" : "Añadir al escritorio";

            showMenuSmart(startAppMenu, e.clientX, e.clientY);
        }
    });

    document.getElementById('pin-to-taskbar-btn').addEventListener('click', () => {
        if (!targetAppToPin) return;
        if (WindowManager.pinnedApps.includes(targetAppToPin)) {
            WindowManager.pinnedApps = WindowManager.pinnedApps.filter(app => app !== targetAppToPin);
            const icon = document.getElementById(`taskbar-${targetAppToPin}`);
            if (icon && !icon.classList.contains('is-open')) icon.remove();
        } else {
            WindowManager.pinnedApps.push(targetAppToPin);
            WindowManager.createTaskbarIcon(targetAppToPin, true);
        }
        localStorage.setItem('moon_pinned_apps', JSON.stringify(WindowManager.pinnedApps));
        hideAllMenus();
    });

    document.getElementById('add-to-desktop-btn').addEventListener('click', () => {
        if (!targetAppToPin) return;
        let shortcuts = JSON.parse(localStorage.getItem('moon_desktop_shortcuts')) || ['browser', 'moondrive', 'settings', 'trash'];
        
        if (shortcuts.includes(targetAppToPin)) {
            shortcuts = shortcuts.filter(app => app !== targetAppToPin);
        } else {
            shortcuts.push(targetAppToPin);
        }
        
        localStorage.setItem('moon_desktop_shortcuts', JSON.stringify(shortcuts));
        renderDesktopIcons();
        hideAllMenus();
    });

    document.getElementById('toggle-taskbar-lock').addEventListener('click', () => {
        isTaskbarLocked = !isTaskbarLocked;
        document.getElementById('toggle-taskbar-lock').innerText = isTaskbarLocked ? '✓ Bloquear la barra de tareas' : 'Bloquear la barra de tareas';
        document.querySelectorAll('#open-apps .taskbar-app').forEach(icon => icon.setAttribute('draggable', !isTaskbarLocked));
    });

    document.addEventListener('click', (e) => {
        if (!calendarPanel.contains(e.target) && e.target !== sysTray && !e.target.closest('.context-menu')) calendarPanel.classList.add('hidden');
        hideAllMenus();
    });
    
    function hideAllMenus() {
        desktopMenu.style.display = 'none';
        taskbarMenu.style.display = 'none';
        iconMenu.style.display = 'none';
        startAppMenu.style.display = 'none';
    }
}

function makeIconDraggable(icon) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    icon.onmousedown = (e) => {
        if (e.button !== 0 || e.target.tagName.toLowerCase() === 'input') return; 
        
        // Multi-selección con Ctrl + Clic
        if (e.ctrlKey) {
            icon.classList.toggle('selected');
        } else {
            if (!icon.classList.contains('selected')) {
                document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
                icon.classList.add('selected');
            }
        }

        e.preventDefault();
        icon.style.transition = 'none';
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDrag;
        document.onmousemove = iconDrag;
    };

    function iconDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        icon.style.top = (icon.offsetTop - pos2) + "px";
        icon.style.left = (icon.offsetLeft - pos1) + "px";
    }
    
    function closeDrag() {
        document.onmouseup = null;
        document.onmousemove = null;
        icon.style.transition = 'top 0.2s ease-out, left 0.2s ease-out';
        
        let snapX = Math.round((icon.offsetLeft - 20) / 90) * 90 + 20;
        let snapY = Math.round((icon.offsetTop - 20) / 90) * 90 + 20;
        const desktopHeight = document.getElementById('desktop').clientHeight;
        const desktopWidth = document.getElementById('desktop').clientWidth;
        
        if (snapX < 20) snapX = 20;
        if (snapX > desktopWidth - 90) snapX = Math.floor((desktopWidth - 90) / 90) * 90 + 20;
        if (snapY < 20) snapY = 20;
        if (snapY > desktopHeight - 100) snapY = Math.floor((desktopHeight - 100) / 90) * 90 + 20; 

        let finalX = snapX;
        let finalY = snapY;
        let isOccupied = true;
        
        while(isOccupied) {
            isOccupied = false;
            document.querySelectorAll('.desktop-icon').forEach(otherIcon => {
                if (otherIcon.id !== icon.id) {
                    let ox = parseInt(otherIcon.style.left);
                    let oy = parseInt(otherIcon.style.top);
                    if (ox === finalX && oy === finalY) {
                        isOccupied = true;
                        finalY += 90; 
                        if (finalY > desktopHeight - 100) { 
                            finalY = 20;
                            finalX += 90;
                        }
                    }
                }
            });
        }
        
        icon.style.top = finalY + "px";
        icon.style.left = finalX + "px";

        let savedPositions = JSON.parse(localStorage.getItem('moon_icon_positions')) || {};
        savedPositions[icon.id] = { top: icon.style.top, left: icon.style.left };
        localStorage.setItem('moon_icon_positions', JSON.stringify(savedPositions));
    }
}

window.shutdownOS = function() {
    document.getElementById('start-menu').classList.add('hidden');
    const shutdownScreen = document.createElement('div');
    shutdownScreen.style.cssText = `position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: black; color: white; z-index: 999999; display: flex; flex-direction: column; justify-content: center; align-items: center; font-family: 'Segoe UI', sans-serif; font-size: 24px; opacity: 0; transition: opacity 1s;`;
    shutdownScreen.innerHTML = `<div style="margin-bottom: 20px;">Apagando Moon OS...</div><div style="width: 40px; height: 40px; border: 4px solid #333; border-top: 4px solid var(--accent); border-radius: 50%; animation: spin 1s linear infinite;"></div><style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>`;
    document.body.appendChild(shutdownScreen);
    setTimeout(() => shutdownScreen.style.opacity = '1', 100);
    setTimeout(() => { try { window.close(); } catch (e) {} shutdownScreen.innerHTML = ''; document.body.innerHTML = ''; document.body.style.backgroundColor = 'black'; }, 2500);
};