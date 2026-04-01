// js/apps/grid.js

function openGrid() {
    let tableHTML = '<table style="border-collapse: collapse; width: 100%; table-layout: fixed; background: white;">';
    
    tableHTML += '<tr style="background: #f3f3f3;"><th style="width: 30px; border: 1px solid #ccc;"></th>';
    for(let i=0; i<10; i++) tableHTML += `<th style="border: 1px solid #ccc; font-weight: normal; color: #333;">${String.fromCharCode(65+i)}</th>`;
    tableHTML += '</tr>';

    for(let i=1; i<=15; i++) {
        tableHTML += `<tr><td style="background: #f3f3f3; text-align: center; border: 1px solid #ccc; font-size: 11px; color: #333;">${i}</td>`;
        for(let j=0; j<10; j++) {
            tableHTML += `<td contenteditable="true" style="border: 1px solid #ddd; padding: 4px; height: 20px; outline: none; background: white; color: #000; font-family: 'Segoe UI';" class="grid-cell"></td>`;
        }
        tableHTML += '</tr>';
    }
    tableHTML += '</table>';

    const html = `
        <div style="display: flex; flex-direction: column; height: 100%; background: #ffffff; font-family: 'Segoe UI', sans-serif;">
            <div style="padding: 5px 10px; background: #217346; color: white; font-size: 12px; display: flex; gap: 15px;">
                <span style="cursor: pointer;" onclick="document.querySelectorAll('.grid-cell').forEach(c=>c.innerText='')">Limpiar Hoja</span>
                <span>Archivo</span>
                <span>Insertar</span>
            </div>
            <div style="flex-grow: 1; overflow: auto; padding: 5px; background: #e5e5e5;">
                ${tableHTML}
            </div>
        </div>
    `;
    WindowManager.createWindow('grid', 'Moon Grid', html, 700, 450);
}