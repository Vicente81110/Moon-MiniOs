// js/apps/taskmanager.js

function openTaskManager() {
    const html = `
        <div style="display: flex; flex-direction: column; height: 100%; background: #ffffff; color: #333; font-family: 'Segoe UI', sans-serif; font-size: 12px;">
            <div style="padding: 10px 15px; background: #f5f6f7; border-bottom: 1px solid #e5e5e5; font-weight: 600;">
                Procesos en ejecución
            </div>
            <div style="flex-grow: 1; overflow-y: auto; padding: 10px;" id="task-list">
                </div>
            <div style="padding: 10px 15px; background: #f5f6f7; border-top: 1px solid #e5e5e5; text-align: right;">
                <button onclick="renderTaskList()" style="padding: 6px 15px; border: 1px solid #ccc; background: #ffffff; cursor: pointer; border-radius: 3px; font-size: 12px; transition: background 0.1s;">Actualizar</button>
            </div>
            <style>
                .task-row { display: flex; justify-content: space-between; padding: 8px 10px; border-bottom: 1px solid #f0f0f0; align-items: center; transition: background 0.1s; }
                .task-row:hover { background: #f9f9f9; }
                .task-btn { padding: 4px 10px; background: #d13438; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 11px; transition: background 0.1s; }
                .task-btn:hover { background: #a80000; }
            </style>
        </div>
    `;

    WindowManager.createWindow('taskmanager', 'Administrador de tareas', html, 400, 500);
    setTimeout(renderTaskList, 50);
}

window.renderTaskList = function() {
    const container = document.getElementById('task-list');
    if (!container) return;
    
    container.innerHTML = '';
    const apps = Object.keys(WindowManager.activeWindows);
    
    if (apps.length === 0) {
        container.innerHTML = `<div style="color: #666; text-align: center; margin-top: 20px;">No hay aplicaciones abiertas.</div>`;
        return;
    }

    apps.forEach(appId => {
        const winData = WindowManager.activeWindows[appId];
        const titleEl = winData.element.querySelector('.window-title');
        const title = titleEl ? titleEl.innerText : appId;
        
        container.innerHTML += `
            <div class="task-row">
                <span style="font-weight: 500;">${title}</span>
                <button class="task-btn" onclick="WindowManager.closeWindow('${appId}'); renderTaskList();">Finalizar tarea</button>
            </div>
        `;
    });
};