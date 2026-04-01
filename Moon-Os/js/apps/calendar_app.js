function openCalendarApp() {
    const now = new Date();
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

    let daysHTML = '';
    // Espacios vacíos para el inicio de semana (ajuste a Lunes como primero)
    let startingPos = (firstDay === 0) ? 6 : firstDay - 1;
    for(let i=0; i < startingPos; i++) daysHTML += '<div></div>';
    
    for(let i=1; i <= daysInMonth; i++) {
        const isToday = i === now.getDate();
        daysHTML += `<div style="padding: 15px; text-align: center; border: 1px solid #f0f0f0; ${isToday?'background: var(--accent); color: white; font-weight: bold; border-radius: 4px;':''}">${i}</div>`;
    }

    const html = `
        <div style="display: flex; flex-direction: column; height: 100%; background: white; color: #333; font-family: 'Segoe UI', sans-serif;">
            <div style="padding: 20px; font-size: 24px; font-weight: 300;">
                ${monthNames[now.getMonth()]} <span style="font-weight: 600;">${now.getFullYear()}</span>
            </div>
            <div style="display: grid; grid-template-columns: repeat(7, 1fr); padding: 10px; background: #f9f9f9; text-align: center; font-weight: 600; font-size: 12px; border-bottom: 1px solid #eee;">
                <div>LU</div><div>MA</div><div>MI</div><div>JU</div><div>VI</div><div>SA</div><div>DO</div>
            </div>
            <div style="display: grid; grid-template-columns: repeat(7, 1fr); flex-grow: 1; padding: 10px; font-size: 14px;">
                ${daysHTML}
            </div>
        </div>
    `;
    WindowManager.createWindow('calendar', 'Calendario', html, 400, 500);
}