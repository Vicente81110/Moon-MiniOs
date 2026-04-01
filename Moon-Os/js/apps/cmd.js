// js/apps/cmd.js

window.cmdCurrentDir = 'documentos';
window.cmdHistory = [];
window.cmdHistoryIndex = -1;

function openCMD() {
    const html = `
        <div style="display: flex; flex-direction: column; height: 100%; background: #0c0c0c; color: #cccccc; font-family: 'Consolas', 'Courier New', monospace; font-size: 14px; padding: 5px; overflow-y: auto;" id="cmd-container" onclick="document.getElementById('cmd-input').focus()">
            <div id="cmd-output" style="word-break: break-all;">
                Moon OS Command Line Interface [Versión 1.0.0]<br>
                (c) Moon OS. Todos los derechos reservados.<br><br>
                Conectado a MoonVFS<br><br>
            </div>
            <div style="display: flex;">
                <span id="cmd-prompt" style="white-space: pre; color: #cccccc;"></span>
                <input type="text" id="cmd-input" style="flex-grow: 1; background: transparent; border: none; color: #cccccc; font-family: 'Consolas', 'Courier New', monospace; font-size: 14px; outline: none;" autocomplete="off" spellcheck="false">
            </div>
        </div>
    `;
    WindowManager.createWindow('cmd', 'Terminal', html, 650, 400);

    setTimeout(() => {
        updateCmdPrompt();
        const input = document.getElementById('cmd-input');
        input.focus();
        input.addEventListener('keydown', handleCmdInput);
    }, 50);
}

// Convierte los IDs de VFS en rutas legibles propias de Moon OS
function getCmdPath(loc) {
    const roots = {
        'documentos': 'M:\\Usuarios\\Moon\\Documentos',
        'desktop': 'M:\\Usuarios\\Moon\\Escritorio',
        'downloads': 'M:\\Usuarios\\Moon\\Descargas',
        'images': 'M:\\Usuarios\\Moon\\Imagenes',
        'moondrive': 'M:\\',
        'trash': 'M:\\Papelera'
    };
    if (roots[loc]) return roots[loc];
    const folder = MoonVFS.getFile(loc);
    if (folder) return getCmdPath(folder.location) + '\\' + folder.name;
    return 'M:\\';
}

function updateCmdPrompt() {
    const promptEl = document.getElementById('cmd-prompt');
    if (promptEl) {
        promptEl.innerText = getCmdPath(window.cmdCurrentDir) + '>';
    }
}

function printCmd(text) {
    const output = document.getElementById('cmd-output');
    if (output) {
        const div = document.createElement('div');
        div.innerHTML = text.replace(/\\n/g, '<br>').replace(/ {2,}/g, match => '&nbsp;'.repeat(match.length));
        output.appendChild(div);
    }
}

function handleCmdInput(e) {
    const input = document.getElementById('cmd-input');
    const container = document.getElementById('cmd-container');

    if (e.key === 'Enter') {
        const commandLine = input.value.trim();
        printCmd(getCmdPath(window.cmdCurrentDir) + '>' + commandLine);
        input.value = '';

        if (commandLine) {
            window.cmdHistory.push(commandLine);
            window.cmdHistoryIndex = window.cmdHistory.length;
            executeCommand(commandLine);
        }

        updateCmdPrompt();
        setTimeout(() => container.scrollTop = container.scrollHeight, 10);
    } 
    else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (window.cmdHistoryIndex > 0) {
            window.cmdHistoryIndex--;
            input.value = window.cmdHistory[window.cmdHistoryIndex];
        }
    } 
    else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (window.cmdHistoryIndex < window.cmdHistory.length - 1) {
            window.cmdHistoryIndex++;
            input.value = window.cmdHistory[window.cmdHistoryIndex];
        } else {
            window.cmdHistoryIndex = window.cmdHistory.length;
            input.value = '';
        }
    }
}

function executeCommand(commandLine) {
    const args = commandLine.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g);
    if (!args) return;

    const cmd = args[0].toLowerCase();
    const cleanArgs = args.slice(1).map(arg => arg.replace(/^["'](.*)["']$/, '$1'));
    const fullArgStr = cleanArgs.join(' ');

    switch (cmd) {
        case 'help':
            printCmd("Comandos disponibles:\\n DIR, LS    - Muestra una lista de archivos y subdirectorios.\\n CD         - Muestra el nombre o cambia al directorio actual.\\n CLS, CLEAR - Borra la pantalla.\\n MKDIR, MD  - Crea un directorio.\\n TYPE, CAT  - Muestra el contenido de un archivo de texto.\\n DEL, RM    - Elimina uno o más archivos.\\n ECHO       - Muestra mensajes.\\n DATE       - Muestra la fecha actual.\\n TIME       - Muestra la hora actual.\\n EXIT       - Cierra la terminal.");
            break;

        case 'cls':
        case 'clear':
            document.getElementById('cmd-output').innerHTML = '';
            break;

        case 'echo':
            printCmd(fullArgStr);
            break;

        case 'date':
            printCmd("La fecha actual es: " + new Date().toLocaleDateString('es-ES'));
            break;

        case 'time':
            printCmd("La hora actual es: " + new Date().toLocaleTimeString('es-ES'));
            break;

        case 'exit':
            WindowManager.closeWindow('cmd');
            break;

        case 'dir':
        case 'ls':
            const files = MoonVFS.files.filter(f => f.location === window.cmdCurrentDir);
            let dirOutput = `\\n El volumen de la unidad es Moon OS\\n Directorio de ${getCmdPath(window.cmdCurrentDir)}\\n\\n`;

            let fileCount = 0;
            let folderCount = 0;
            let totalSize = 0;

            const nowDate = new Date().toLocaleDateString('es-ES');
            const nowTime = new Date().toLocaleTimeString('es-ES').slice(0,5);

            dirOutput += ` ${nowDate}  ${nowTime}    <DIR>          .\\n`;
            const parentLoc = getParentDir(window.cmdCurrentDir);
            if (parentLoc !== window.cmdCurrentDir) {
                dirOutput += ` ${nowDate}  ${nowTime}    <DIR>          ..\\n`;
            }

            files.forEach(f => {
                const datePart = f.date ? f.date.split(' ')[0] : '01/01/2026';
                const timePart = f.date ? f.date.split(' ')[1] : '00:00';
                
                if (f.type === 'folder') {
                    dirOutput += ` ${datePart}  ${timePart}    <DIR>          ${f.name}\\n`;
                    folderCount++;
                } else {
                    const sizeNum = parseInt(f.size) || 1;
                    totalSize += sizeNum;
                    const sizeStr = (sizeNum * 1024).toString().padStart(14, ' '); 
                    dirOutput += ` ${datePart}  ${timePart}    ${sizeStr} ${f.name}\\n`;
                    fileCount++;
                }
            });

            dirOutput += `              ${fileCount} archivos    ${totalSize * 1024} bytes\\n`;
            dirOutput += `              ${folderCount} dirs        Espacio virtual libre\\n`;
            printCmd(dirOutput);
            break;

        case 'cd':
            if (cleanArgs.length === 0) {
                printCmd(getCmdPath(window.cmdCurrentDir));
                break;
            }
            
            if (fullArgStr === '..') {
                window.cmdCurrentDir = getParentDir(window.cmdCurrentDir);
            } else if (fullArgStr === '\\\\' || fullArgStr === '/') {
                window.cmdCurrentDir = 'documentos'; 
            } else {
                const targetFolder = MoonVFS.files.find(f => f.location === window.cmdCurrentDir && f.type === 'folder' && f.name.toLowerCase() === fullArgStr.toLowerCase());
                if (targetFolder) {
                    window.cmdCurrentDir = targetFolder.id;
                } else {
                    printCmd("El sistema no puede encontrar la ruta especificada.");
                }
            }
            break;

        case 'mkdir':
        case 'md':
            if (cleanArgs.length === 0) {
                printCmd("La sintaxis del comando es incorrecta.");
            } else {
                MoonVFS.createFile(fullArgStr, 'folder', '', window.cmdCurrentDir);
            }
            break;

        case 'del':
        case 'rm':
            if (cleanArgs.length === 0) {
                printCmd("La sintaxis del comando es incorrecta.");
            } else {
                const targetFile = MoonVFS.files.find(f => f.location === window.cmdCurrentDir && f.type !== 'folder' && f.name.toLowerCase() === fullArgStr.toLowerCase());
                if (targetFile) {
                    MoonVFS.moveToTrash(targetFile.id);
                } else {
                    printCmd("No se pudo encontrar " + fullArgStr);
                }
            }
            break;

        case 'type':
        case 'cat':
            if (cleanArgs.length === 0) {
                printCmd("La sintaxis del comando es incorrecta.");
            } else {
                const targetFile = MoonVFS.files.find(f => f.location === window.cmdCurrentDir && f.name.toLowerCase() === fullArgStr.toLowerCase());
                if (targetFile) {
                    if (targetFile.type === 'txt' || targetFile.type === 'write') {
                        printCmd("\\n" + (targetFile.content || '') + "\\n");
                    } else {
                        printCmd("Acceso denegado o tipo de archivo no admitido para visualización en consola.");
                    }
                } else {
                    printCmd("El sistema no puede encontrar el archivo especificado.");
                }
            }
            break;

        default:
            printCmd(`"${cmd}" no se reconoce como un comando interno o externo, programa o archivo por lotes ejecutable.`);
            break;
    }
}

function getParentDir(currentLoc) {
    const roots = ['documentos', 'desktop', 'downloads', 'images', 'moondrive', 'trash'];
    if (roots.includes(currentLoc)) return currentLoc; 
    
    const currentFolder = MoonVFS.getFile(currentLoc);
    if (currentFolder) return currentFolder.location;
    
    return 'documentos'; 
}