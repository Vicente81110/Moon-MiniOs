// js/apps/slide.js

let currentSlideIndex = 0;
let slidesData = [];

function openSlide() {
    currentSlideIndex = 0;
    slidesData = [
        [
            { id: 't1', text: "Título de la Presentación", x: 100, y: 150, fontSize: 32 },
            { id: 't2', text: "Subtítulo", x: 150, y: 220, fontSize: 18 }
        ]
    ];
    
    const html = `
        <div style="display: flex; height: 100%; background: #ffffff; font-family: 'Segoe UI', sans-serif; user-select: none;" tabindex="0" id="slide-app-container">
            <div style="width: 160px; background: #f3f3f3; border-right: 1px solid #ccc; padding: 10px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px;" id="slide-list">
                </div>
            <div style="flex-grow: 1; background: #e5e5e5; display: flex; flex-direction: column;">
                <div style="padding: 5px 10px; background: #d04423; color: white; display: flex; gap: 10px; font-size: 12px;">
                    <button onclick="addTextBoxToSlide()" style="background: white; border: none; padding: 2px 8px; cursor: pointer; color: #d04423; border-radius: 2px;">+ Texto</button>
                    <span>Usa ⬅ y ➡ para cambiar de diapositiva</span>
                </div>
                <div style="flex-grow: 1; display: flex; justify-content: center; align-items: center; padding: 20px;">
                    <div id="slide-canvas" style="width: 500px; height: 281px; background: white; box-shadow: 0 5px 15px rgba(0,0,0,0.2); position: relative; overflow: hidden;">
                        </div>
                </div>
            </div>
        </div>
    `;
    WindowManager.createWindow('slide', 'Moon Slide', html, 800, 500);

    setTimeout(() => {
        renderSlideUI();
        
        // Listener de Teclado exclusivo para la ventana Slide
        const container = document.getElementById('slide-app-container');
        if(container) {
            container.focus();
            container.addEventListener('keydown', (e) => {
                if (e.target.tagName.toLowerCase() === 'textarea') return; // No cambiar si está escribiendo
                if (e.key === 'ArrowRight') { selectSlide(currentSlideIndex + 1); }
                if (e.key === 'ArrowLeft') { selectSlide(currentSlideIndex - 1); }
            });
        }
    }, 50);
}

window.renderSlideUI = function() {
    const list = document.getElementById('slide-list');
    const canvas = document.getElementById('slide-canvas');
    if(!list || !canvas) return;

    // Renderizar barra lateral
    list.innerHTML = slidesData.map((s, i) => `
        <div onclick="selectSlide(${i})" style="width: 100%; height: 70px; background: white; border: ${i===currentSlideIndex?'2px solid #d04423':'1px solid #ccc'}; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: bold; color: #333;">
            Diapositiva ${i + 1}
        </div>
    `).join('') + `<button onclick="addSlide()" style="padding: 8px; cursor: pointer; border: 1px dashed #ccc; background: transparent;">+ Añadir Diapositiva</button>`;

    // Renderizar Diapositiva Actual
    canvas.innerHTML = '';
    const currentElements = slidesData[currentSlideIndex] || [];
    
    currentElements.forEach(el => {
        const div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.left = el.x + 'px';
        div.style.top = el.y + 'px';
        div.style.cursor = 'move';
        div.innerHTML = `<textarea id="${el.id}" oninput="updateSlideText('${el.id}', this.value)" style="background: transparent; border: 1px dashed transparent; outline: none; resize: none; font-size: ${el.fontSize}px; font-family: 'Segoe UI'; color: #000; overflow: hidden; width: max-content; min-width: 100px; text-align: center;" onfocus="this.style.border='1px dashed #ccc'" onblur="this.style.border='1px dashed transparent'">${el.text}</textarea>`;
        
        canvas.appendChild(div);
        makeSlideElementDraggable(div, el.id);
    });
};

window.selectSlide = function(i) { 
    if(i < 0 || i >= slidesData.length) return;
    currentSlideIndex = i; 
    renderSlideUI(); 
};

window.addSlide = function() { 
    slidesData.push([
        { id: 't_' + Date.now(), text: "Nuevo Texto", x: 150, y: 120, fontSize: 24 }
    ]); 
    currentSlideIndex = slidesData.length - 1; 
    renderSlideUI(); 
};

window.addTextBoxToSlide = function() {
    slidesData[currentSlideIndex].push({
        id: 't_' + Date.now(), text: "Texto extra", x: 50, y: 50, fontSize: 16
    });
    renderSlideUI();
};

window.updateSlideText = function(id, text) {
    const el = slidesData[currentSlideIndex].find(e => e.id === id);
    if(el) el.text = text;
};

window.makeSlideElementDraggable = function(elmnt, id) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    elmnt.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        if(e.target.tagName.toLowerCase() === 'textarea') return; // Dejar escribir
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        
        let newX = elmnt.offsetLeft - pos1;
        let newY = elmnt.offsetTop - pos2;
        
        elmnt.style.left = newX + "px";
        elmnt.style.top = newY + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
        // Guardar posiciones
        const el = slidesData[currentSlideIndex].find(e => e.id === id);
        if(el) {
            el.x = parseInt(elmnt.style.left);
            el.y = parseInt(elmnt.style.top);
        }
    }
};