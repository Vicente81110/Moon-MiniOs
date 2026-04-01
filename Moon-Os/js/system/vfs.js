// js/system/vfs.js

const MoonVFS = {
    files: JSON.parse(localStorage.getItem('moon_files')) || [],
    clipboard: null, 

    save: function() {
        localStorage.setItem('moon_files', JSON.stringify(this.files));
        if (typeof renderExplorerFiles === 'function') renderExplorerFiles(); 
        if (typeof renderDesktopIcons === 'function') renderDesktopIcons();
    },

    createFile: function(name, type, content = '', location = 'documentos') {
        const now = new Date();
        const dateStr = `${now.getDate()}/${now.getMonth()+1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        let sizeKb = '';
        if (type !== 'folder') {
            const factor = type === 'image' ? 0.75 : 1; 
            sizeKb = content.length > 0 ? Math.ceil((content.length * factor) / 1024) + ' KB' : (Math.floor(Math.random() * 15) + 1) + ' KB';
        }

        const newFile = {
            id: 'file_' + Date.now() + Math.floor(Math.random() * 1000),
            name: name,
            type: type, 
            content: content,
            location: location,
            date: dateStr,
            size: sizeKb
        };
        this.files.push(newFile);
        this.save();
        return newFile.id;
    },

    copyFile: function(id) { this.clipboard = { action: 'copy', id: id }; },
    cutFile: function(id) { this.clipboard = { action: 'cut', id: id }; },

    pasteFile: function(targetLocation) {
        if (!this.clipboard) return false;
        const sourceFile = this.getFile(this.clipboard.id);
        if (!sourceFile) { this.clipboard = null; return false; }

        if (this.clipboard.action === 'copy') {
            let newName = sourceFile.name;
            const extMatch = newName.match(/(\.[\w\d_-]+)$/i);
            if (extMatch) newName = newName.replace(extMatch[0], ` - copia${extMatch[0]}`);
            else newName += ' - copia';
            this.createFile(newName, sourceFile.type, sourceFile.content, targetLocation);
        } else if (this.clipboard.action === 'cut') {
            sourceFile.location = targetLocation;
            this.clipboard = null; 
            this.save();
        }
        return true;
    },

    exportFolder: function(location) {
        const filesToExport = this.files.filter(f => f.location === location);
        if(filesToExport.length === 0) { alert('La carpeta está vacía.'); return; }
        
        const exportData = JSON.stringify(filesToExport, null, 2);
        const blob = new Blob([exportData], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        let safeName = location.replace(/[^a-z0-9]/gi, '_');
        a.download = `Backup_${safeName}_MoonOS.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    },

    moveToTrash: function(id) {
        const file = this.getFile(id);
        if (file) { file.location = 'trash'; this.save(); }
    },

    permanentlyDelete: function(id) {
        this.files = this.files.filter(f => f.id !== id);
        this.save();
    },

    emptyTrash: function() {
        this.files = this.files.filter(f => f.location !== 'trash');
        this.save();
    },

    restoreFile: function(id) {
        const file = this.getFile(id);
        if (file) { file.location = 'documentos'; this.save(); }
    },

    getFile: function(id) { return this.files.find(f => f.id === id); },

    updateFile: function(id, newContent, newName = null) {
        const file = this.getFile(id);
        if (file) {
            if (newContent !== null) {
                file.content = newContent;
                if (file.type !== 'folder') file.size = Math.ceil(newContent.length / 1024) + ' KB';
            }
            if (newName) file.name = newName;
            const now = new Date();
            file.date = `${now.getDate()}/${now.getMonth()+1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
            this.save();
        }
    },

    exportToPC: function(id) {
        const file = this.getFile(id);
        if (!file || file.type === 'folder') return; 

        if (file.type === 'image') {
            const a = document.createElement('a');
            a.href = file.content;
            a.download = file.name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            return;
        }

        const blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        let exportName = file.name;
        if (file.type === 'txt' && !exportName.endsWith('.txt')) exportName += '.txt';
        if (file.type === 'write' && !exportName.endsWith('.moon')) exportName += '.moon';
        if (file.type === 'grid' && !exportName.endsWith('.grid')) exportName += '.grid';
        if (file.type === 'slide' && !exportName.endsWith('.slide')) exportName += '.slide';
        a.download = exportName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    },

    importFromPC: function(event) {
        const file = event.target.files[0];
        if (!file) return;

        const ext = file.name.split('.').pop().toLowerCase();
        const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
        const reader = new FileReader();

        reader.onload = function(e) {
            const content = e.target.result;
            const type = isImage ? 'image' : (ext === 'moon' ? 'write' : (ext === 'grid' ? 'grid' : (ext === 'slide' ? 'slide' : 'txt')));
            let targetLoc = typeof currentExplorerLocation !== 'undefined' ? currentExplorerLocation : 'documentos';
            if(targetLoc === 'trash' || targetLoc === 'computer') targetLoc = 'documentos';
            MoonVFS.createFile(file.name, type, content, targetLoc); 
        };

        if (isImage) reader.readAsDataURL(file);
        else reader.readAsText(file);
        event.target.value = ''; 
    },

    openFile: function(id) {
        const file = this.getFile(id);
        if (!file) return;

        if (file.type === 'txt') { openNotepad(file.id, file.name, file.content); } 
        else if (file.type === 'write') { openWrite(file.id, file.name, file.content); } 
        else if (file.type === 'image') { openImageViewer(file.id, file.name, file.content); } 
        else if (file.type === 'grid') { if(typeof openGrid === 'function') openGrid(); }
        else if (file.type === 'slide') { if(typeof openSlide === 'function') openSlide(); }
        else if (file.type === 'folder') {
            if (typeof openMoonDrive === 'function') openMoonDrive();
            setTimeout(() => setExplorerLocation(file.id), 50);
        }
    }
};