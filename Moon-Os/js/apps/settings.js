// js/apps/settings.js

let currentSettingsTab = 'personalization';

function openSettings() {
    const html = `
        <div style="display: flex; height: 100%; background: #ffffff; color: #333; font-family: 'Segoe UI', Arial, sans-serif; font-size: 13px;">
            
            <div style="width: 220px; background: #f3f3f3; padding: 15px 10px; display: flex; flex-direction: column; gap: 5px; border-right: 1px solid #e5e5e5;">
                <div style="font-size: 18px; font-weight: 600; margin-bottom: 15px; padding-left: 10px; color: #000;">Configuración</div>
                
                <div class="settings-nav-item active" id="nav-set-personalization" onclick="switchSettingsTab('personalization')">
                    <span style="font-size: 16px;">🎨</span> Personalización
                </div>
                <div class="settings-nav-item" id="nav-set-account" onclick="switchSettingsTab('account')">
                    <span style="font-size: 16px;">👤</span> Cuenta
                </div>
            </div>

            <div style="flex-grow: 1; padding: 30px; overflow-y: auto; position: relative;" id="settings-main-content">
                </div>

            <div id="vfs-image-picker" style="display: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,255,255,0.95); z-index: 10; flex-direction: column;">
                <div style="padding: 15px; background: #f3f3f3; border-bottom: 1px solid #ccc; display: flex; justify-content: space-between; align-items: center;">
                    <div style="font-weight: 600; font-size: 14px;">Seleccionar imagen de MoonDrive</div>
                    <button onclick="closeVFSImagePicker()" style="padding: 5px 10px; cursor: pointer; border: 1px solid #ccc; background: white; border-radius: 3px;">Cancelar</button>
                </div>
                <div id="vfs-image-grid" style="padding: 15px; display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 10px; overflow-y: auto; flex-grow: 1;">
                    </div>
            </div>

            <style>
                .settings-nav-item { padding: 8px 15px; cursor: pointer; border-radius: 4px; transition: background 0.1s; display: flex; align-items: center; gap: 10px; color: #333; }
                .settings-nav-item:hover { background: #e5e5e5; }
                .settings-nav-item.active { background: #e5f3ff; color: #0067c0; font-weight: 500; }
                
                .settings-section { margin-bottom: 30px; }
                .settings-title { font-size: 20px; font-weight: 600; margin-bottom: 20px; color: #000; }
                .settings-subtitle { font-size: 14px; font-weight: 600; margin-bottom: 10px; color: #000; }
                
                .settings-btn { padding: 6px 15px; background: #fdfdfd; border: 1px solid #ccc; border-radius: 4px; cursor: pointer; font-size: 12px; transition: background 0.1s; color: #333; }
                .settings-btn:hover { background: #f0f0f0; }
                .settings-btn.primary { background: #0067c0; color: white; border: 1px solid #0067c0; }
                .settings-btn.primary:hover { background: #005a9e; }
                
                .vfs-img-item { border: 2px solid transparent; border-radius: 4px; overflow: hidden; cursor: pointer; height: 100px; display: flex; justify-content: center; align-items: center; background: #eee; }
                .vfs-img-item:hover { border-color: #0067c0; }
                .vfs-img-item img { max-width: 100%; max-height: 100%; object-fit: cover; }
            </style>
        </div>
    `;

    WindowManager.createWindow('settings', 'Configuración', html, 700, 500);
    setTimeout(() => switchSettingsTab('personalization'), 50);
}

window.switchSettingsTab = function(tabId) {
    currentSettingsTab = tabId;
    document.querySelectorAll('.settings-nav-item').forEach(el => el.classList.remove('active'));
    document.getElementById(`nav-set-${tabId}`).classList.add('active');

    const contentArea = document.getElementById('settings-main-content');
    
    if (tabId === 'personalization') {
        const currentAccent = localStorage.getItem('moon_accent') || '#3B82F6';
        
        contentArea.innerHTML = `
            <div class="settings-title">Personalización</div>
            
            <div class="settings-section">
                <div class="settings-subtitle">Fondo del escritorio</div>
                <div style="display: flex; gap: 10px; margin-top: 10px;">
                    <button class="settings-btn" onclick="openVFSImagePicker('background')">Examinar archivos de Moon OS</button>
                    <button class="settings-btn" onclick="restoreDefaultBackground()">Restaurar fondo por defecto</button>
                </div>
            </div>

            <div class="settings-section" style="border-top: 1px solid #eee; padding-top: 20px;">
                <div class="settings-subtitle">Color de énfasis (Bordes y Menús)</div>
                <div style="display: flex; gap: 10px; align-items: center; margin-top: 10px;">
                    <input type="color" id="accent-color-picker" value="${currentAccent}" style="width: 40px; height: 40px; padding: 0; border: 1px solid #ccc; cursor: pointer;">
                    <button class="settings-btn primary" onclick="saveAccentColor()">Aplicar color</button>
                    <button class="settings-btn" onclick="restoreDefaultAccent()">Restaurar color por defecto</button>
                </div>
            </div>
        `;
    } 
    else if (tabId === 'account') {
        const currentName = localStorage.getItem('moon_username') || 'Usuario';
        
        contentArea.innerHTML = `
            <div class="settings-title">Información de la Cuenta</div>
            
            <div class="settings-section">
                <div class="settings-subtitle">Foto de perfil</div>
                <div style="display: flex; gap: 10px; margin-top: 10px;">
                    <button class="settings-btn" onclick="openVFSImagePicker('profile')">Elegir desde Moon OS</button>
                    <button class="settings-btn" onclick="restoreDefaultProfile()">Restaurar letra por defecto</button>
                </div>
            </div>

            <div class="settings-section" style="border-top: 1px solid #eee; padding-top: 20px;">
                <div class="settings-subtitle">Nombre de usuario</div>
                <div style="display: flex; gap: 10px; margin-top: 10px;">
                    <input type="text" id="username-input" value="${currentName}" style="padding: 6px 10px; border: 1px solid #ccc; border-radius: 3px; font-family: 'Segoe UI'; font-size: 13px; width: 250px; outline: none;">
                    <button class="settings-btn primary" onclick="saveUsername()">Guardar nombre</button>
                </div>
            </div>
        `;
    }
};

// --- LÓGICA DEL SELECTOR NATIVO DE IMÁGENES (VFS) ---
let imagePickerTarget = null; // 'background' o 'profile'

window.openVFSImagePicker = function(target) {
    imagePickerTarget = target;
    const picker = document.getElementById('vfs-image-picker');
    const grid = document.getElementById('vfs-image-grid');
    
    // Buscar imágenes en el sistema virtual
    const images = MoonVFS.files.filter(f => f.type === 'image');
    
    if (images.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; padding: 20px; text-align: center; color: #666; font-size: 14px;">
                <span style="font-size: 30px; display: block; margin-bottom: 10px;">🖼️</span>
                No tienes imágenes guardadas en el sistema.<br><br>
                Abre el <b>Explorador de Archivos</b>, haz clic en "Importar" y sube imágenes (JPG, PNG) para poder usarlas aquí.
            </div>`;
    } else {
        grid.innerHTML = '';
        images.forEach(imgFile => {
            const div = document.createElement('div');
            div.className = 'vfs-img-item';
            div.innerHTML = `<img src="${imgFile.content}" title="${imgFile.name}">`;
            div.onclick = () => selectVFSImage(imgFile.content);
            grid.appendChild(div);
        });
    }
    
    picker.style.display = 'flex';
};

window.closeVFSImagePicker = function() {
    document.getElementById('vfs-image-picker').style.display = 'none';
    imagePickerTarget = null;
};

window.selectVFSImage = function(base64Data) {
    if (imagePickerTarget === 'background') {
        localStorage.setItem('moon_desktop_bg', base64Data);
        applyBackground(base64Data);
    } else if (imagePickerTarget === 'profile') {
        localStorage.setItem('moon_profile_pic', base64Data);
        applyProfilePic(base64Data);
    }
    closeVFSImagePicker();
};

// --- LÓGICA DE APLICACIÓN Y RESTAURACIÓN ---

window.saveAccentColor = function() {
    const color = document.getElementById('accent-color-picker').value;
    localStorage.setItem('moon_accent', color);
    document.documentElement.style.setProperty('--accent', color);
};

window.restoreDefaultAccent = function() {
    const defaultColor = '#3B82F6'; // Azul Noche original
    document.getElementById('accent-color-picker').value = defaultColor;
    localStorage.setItem('moon_accent', defaultColor);
    document.documentElement.style.setProperty('--accent', defaultColor);
};

window.restoreDefaultBackground = function() {
    localStorage.removeItem('moon_desktop_bg');
    
    const desktop = document.getElementById('desktop');
    desktop.style.backgroundImage = 'none';
    
    // Reactivar el CSS de la luna por defecto
    const moon = document.querySelector('.moon-background');
    if(moon) moon.style.display = 'block';
};

window.applyBackground = function(base64) {
    const desktop = document.getElementById('desktop');
    desktop.style.backgroundImage = `url(${base64})`;
    desktop.style.backgroundSize = 'cover';
    desktop.style.backgroundPosition = 'center';
    
    const moon = document.querySelector('.moon-background');
    if(moon) moon.style.display = 'none';
};

window.saveUsername = function() {
    const input = document.getElementById('username-input').value.trim();
    if(input) {
        localStorage.setItem('moon_username', input);
        // Si no hay foto, actualizar la letra del perfil
        if(!localStorage.getItem('moon_profile_pic')) {
            applyProfilePic(null);
        }
        alert('Nombre guardado correctamente.');
    }
};

window.restoreDefaultProfile = function() {
    localStorage.removeItem('moon_profile_pic');
    applyProfilePic(null);
};

window.applyProfilePic = function(base64) {
    const profileDiv = document.getElementById('start-profile-pic');
    if (!profileDiv) return;

    if (base64) {
        profileDiv.style.backgroundImage = `url(${base64})`;
        profileDiv.innerText = '';
    } else {
        const name = localStorage.getItem('moon_username') || 'Usuario';
        profileDiv.style.backgroundImage = 'none';
        profileDiv.innerText = name.charAt(0).toUpperCase();
    }
};