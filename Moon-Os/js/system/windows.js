// js/system/windows.js

const WindowManager = {
    zIndexCounter: 100,
    activeWindows: {},
    pinnedApps: JSON.parse(localStorage.getItem('moon_pinned_apps')) || ['browser', 'moondrive'], 

    initTaskbar: function() {
        this.pinnedApps.forEach(appId => this.createTaskbarIcon(appId, true));
    },

    initTaskbarDragAndDrop: function() {
        const container = document.getElementById('open-apps');
        let draggedItem = null;

        container.addEventListener('dragstart', (e) => {
            if (isTaskbarLocked) { e.preventDefault(); return; }
            draggedItem = e.target;
            e.dataTransfer.effectAllowed = 'move';
            
            // Efecto visual para indicar que lo estamos arrastrando
            setTimeout(() => {
                e.target.style.opacity = '0.4';
                e.target.style.transform = 'scale(0.9)';
            }, 0);
        });

        container.addEventListener('dragend', (e) => {
            if (draggedItem) {
                draggedItem.style.opacity = '1';
                draggedItem.style.transform = 'none';
            }
            draggedItem = null;
        });

        container.addEventListener('dragover', (e) => {
            if (isTaskbarLocked) return;
            e.preventDefault();
            const afterElement = getDragAfterElement(container, e.clientX);
            if (draggedItem) {
                if (afterElement == null) {
                    container.appendChild(draggedItem);
                } else {
                    container.insertBefore(draggedItem, afterElement);
                }
            }
        });

        // Esta función calcula matemáticamente si el ratón pasó la mitad (50%) del siguiente icono
        function getDragAfterElement(container, x) {
            const draggableElements = [...container.querySelectorAll('.taskbar-app:not(.dragging)')];
            return draggableElements.reduce((closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = x - box.left - box.width / 2;
                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            }, { offset: Number.NEGATIVE_INFINITY }).element;
        }
    },

    createWindow: function(appId, title, contentHTML, width = 600, height = 400) {
        document.getElementById('start-menu').classList.add('hidden');

        if (this.activeWindows[appId]) {
            this.restoreWindow(appId);
            return;
        }

        const win = document.createElement('div');
        win.className = 'window active';
        win.id = `win-${appId}`;
        
        win.style.width = `${width}px`;
        win.style.height = `${height}px`;

        const desktop = document.getElementById('desktop');
        const topPos = (desktop.clientHeight - height) / 2;
        const leftPos = (desktop.clientWidth - width) / 2;
        
        win.style.top = `${topPos > 0 ? topPos : 0}px`;
        win.style.left = `${leftPos > 0 ? leftPos : 0}px`;
        
        this.zIndexCounter++;
        win.style.zIndex = this.zIndexCounter;

        win.innerHTML = `
            <div class="title-bar" id="title-${appId}">
                <div class="window-title">${title}</div>
                <div class="window-controls">
                    <button class="win-btn min" title="Minimizar" onclick="WindowManager.minimizeWindow('${appId}')"></button>
                    <button class="win-btn max" title="Maximizar" onclick="WindowManager.maximizeWindow('${appId}')"></button>
                    <button class="win-btn close" title="Cerrar" onclick="WindowManager.closeWindow('${appId}')"></button>
                </div>
            </div>
            <div class="window-content">${contentHTML}</div>
        `;

        document.getElementById('desktop').appendChild(win);
        
        this.activeWindows[appId] = {
            element: win,
            isMaximized: false,
            prevGeometry: { top: win.style.top, left: win.style.left, width: win.style.width, height: win.style.height }
        };

        this.makeDraggable(win, document.getElementById(`title-${appId}`), appId);
        this.createTaskbarIcon(appId, false);
        
        win.addEventListener('mousedown', () => this.focusWindow(appId));
        this.focusWindow(appId);
    },

    closeWindow: function(appId) {
        const winData = this.activeWindows[appId];
        if (winData) {
            winData.element.remove();
            delete this.activeWindows[appId];
            
            const icon = document.getElementById(`taskbar-${appId}`);
            if (icon) {
                if (this.pinnedApps.includes(appId.split('_')[0])) {
                    icon.classList.remove('active', 'is-open');
                } else {
                    icon.remove();
                }
            }
        }
    },

    maximizeWindow: function(appId) {
        const winData = this.activeWindows[appId];
        const win = winData.element;

        if (!winData.isMaximized) {
            winData.prevGeometry = { top: win.style.top, left: win.style.left, width: win.style.width, height: win.style.height };
            win.classList.add('maximized');
            winData.isMaximized = true;
        } else {
            win.classList.remove('maximized');
            win.style.top = winData.prevGeometry.top;
            win.style.left = winData.prevGeometry.left;
            win.style.width = winData.prevGeometry.width;
            win.style.height = winData.prevGeometry.height;
            winData.isMaximized = false;
        }
    },

    minimizeWindow: function(appId) {
        const win = this.activeWindows[appId].element;
        win.classList.add('minimized');
        this.updateTaskbarState(appId, false, true);
    },

    restoreWindow: function(appId) {
        const win = this.activeWindows[appId].element;
        win.classList.remove('minimized');
        this.focusWindow(appId);
    },

    focusWindow: function(appId) {
        Object.keys(this.activeWindows).forEach(id => {
            this.activeWindows[id].element.classList.remove('active');
            this.updateTaskbarState(id, false, true);
        });
        
        const win = this.activeWindows[appId].element;
        this.zIndexCounter++;
        win.style.zIndex = this.zIndexCounter;
        win.classList.add('active');
        this.updateTaskbarState(appId, true, true);
    },

    minimizeAll: function() {
        let allMinimized = true;
        Object.keys(this.activeWindows).forEach(id => {
            if (!this.activeWindows[id].element.classList.contains('minimized')) allMinimized = false;
        });

        Object.keys(this.activeWindows).forEach(id => {
            if (!allMinimized) this.minimizeWindow(id);
            else this.restoreWindow(id);
        });
    },

    createTaskbarIcon: function(appId, isPinnedOnly) {
        const taskbar = document.getElementById('open-apps');
        const baseAppId = appId.split('_')[0]; 
        
        let item = document.getElementById(`taskbar-${appId}`);
        if (!item) {
            item = document.createElement('div');
            item.className = 'taskbar-app';
            item.id = `taskbar-${appId}`;
            
            const appTitles = {
                'moondrive': 'Explorador de Archivos',
                'settings': 'Configuración',
                'taskmanager': 'Administrador de Tareas',
                'cmd': 'Símbolo del Sistema',
                'trash': 'Papelera',
                'notepad': 'Bloc de Notas'
            };
            item.title = appTitles[baseAppId] || (baseAppId.charAt(0).toUpperCase() + baseAppId.slice(1));
            
            item.setAttribute('draggable', !isTaskbarLocked);
            item.style.transition = 'opacity 0.2s, background 0.2s'; // Transición suave para el encuadre
            
            const icons = {
                'cmd': '<svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2zm.5 3.5l3 3-3 3-.7-.7L4.1 8 1.8 5.7l.7-.7zM6 11h4v1H6v-1z"/></svg>',
                'write': '<svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M2 2v12h12V2H2zm11 11H3V3h10v10z"/><path d="M4 4h8v1H4zM4 6h8v1H4zM4 8h6v1H4z"/></svg>',
                'notepad': '<svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1z"/><path d="M6 5h4v1H6V5zm0 2h4v1H6V7zm0 2h4v1H6V9z"/></svg>',
                'calc': '<svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h8zM4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4z"/><path d="M4 2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-2z"/></svg>',
                'browser': '<svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.025 7.025 0 0 0 2.255 4H4.09z"/></svg>',
                'settings': '<svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/><path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/></svg>',
                'taskmanager': '<svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/></svg>',
                'moondrive': '<svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.825a2 2 0 0 1-1.991-1.819l-.637-7a1.99 1.99 0 0 1 .342-1.31L.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3zm-8.322.12C1.72 3.042 1.95 3 2.19 3h5.396l-.707-.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981l.006.139z"/></svg>',
                'trash': '<svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>'
            };

            item.innerHTML = icons[baseAppId] || '<div style="width:14px; height:14px; background:var(--text-main); border-radius:2px;"></div>';
            taskbar.appendChild(item);
        }

        if (!isPinnedOnly) {
            item.classList.add('is-open', 'active');
        }

        const openAppFunctions = {
            'cmd': () => { if(typeof openCMD === 'function') openCMD(); },
            'write': () => { if(typeof openWrite === 'function') openWrite(); },
            'notepad': () => { if(typeof openNotepad === 'function') openNotepad(); },
            'calc': () => { if(typeof openCalculator === 'function') openCalculator(); },
            'browser': () => { if(typeof openBrowser === 'function') openBrowser(); },
            'settings': () => { if(typeof openSettings === 'function') openSettings(); },
            'taskmanager': () => { if(typeof openTaskManager === 'function') openTaskManager(); },
            'moondrive': () => { if(typeof openMoonDrive === 'function') openMoonDrive(); },
            'trash': () => { if(typeof openTrash === 'function') openTrash(); }
        };

        item.onclick = () => {
            const win = this.activeWindows[appId];
            if (!win) {
                if (openAppFunctions[baseAppId]) openAppFunctions[baseAppId]();
            } else if (win.element.classList.contains('minimized')) {
                this.restoreWindow(appId);
            } else if (win.element.classList.contains('active')) {
                this.minimizeWindow(appId);
            } else {
                this.focusWindow(appId);
            }
        };
    },

    updateTaskbarState: function(appId, isActive, isOpen) {
        const item = document.getElementById(`taskbar-${appId}`);
        if (item) {
            isActive ? item.classList.add('active') : item.classList.remove('active');
            isOpen ? item.classList.add('is-open') : item.classList.remove('is-open');
        }
    },

    makeDraggable: function(windowElement, titleBarElement, appId) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        titleBarElement.onmousedown = (e) => {
            if (this.activeWindows[appId].isMaximized) return; 
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        };

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            
            let newTop = windowElement.offsetTop - pos2;
            let newLeft = windowElement.offsetLeft - pos1;

            const desktop = document.getElementById('desktop');
            const maxX = desktop.clientWidth - windowElement.offsetWidth;
            const maxY = desktop.clientHeight - windowElement.offsetHeight;

            if (newTop < 0) newTop = 0;
            if (newTop > maxY) newTop = maxY;
            if (newLeft < 0) newLeft = 0;
            if (newLeft > maxX) newLeft = maxX;

            windowElement.style.top = newTop + "px";
            windowElement.style.left = newLeft + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
};