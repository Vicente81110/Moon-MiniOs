// js/apps/trash.js

function openTrash() {
    // Reutilizamos la lógica del explorador pero forzando a abrir en la pestaña Trash
    openMoonDrive();
    setTimeout(() => {
        if(typeof setExplorerLocation === 'function') {
            setExplorerLocation('trash');
        }
    }, 100);
}