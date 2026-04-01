// js/apps/minesweeper.js

let mineGrid = [];
let minesweeperGameOver = false;
const rows = 10;
const cols = 10;
const totalMines = 15;

function openMinesweeper() {
    const html = `
        <div style="display: flex; flex-direction: column; align-items: center; height: 100%; background: #c0c0c0; font-family: 'Segoe UI', sans-serif; user-select: none;">
            <div style="background: white; border: 2px solid #808080; border-right-color: #fff; border-bottom-color: #fff; padding: 10px; margin-top: 15px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px; background: black; padding: 5px;">
                    <div style="color: red; font-family: monospace; font-size: 20px;">${totalMines}</div>
                    <button onclick="initMinesweeper()" style="font-size: 16px; cursor: pointer;">🙂</button>
                    <div style="color: red; font-family: monospace; font-size: 20px;">000</div>
                </div>
                <div id="minesweeper-board" style="display: grid; grid-template-columns: repeat(${cols}, 20px); border: 3px solid #808080; border-top-color: #808080; border-left-color: #808080;">
                    </div>
            </div>
            <div style="margin-top: 10px; font-size: 11px; color: #333;">Clic Izquierdo: Revelar | Clic Derecho: Bandera</div>
        </div>
    `;
    WindowManager.createWindow('minesweeper', 'Buscaminas', html, 320, 380);
    setTimeout(initMinesweeper, 50);
}

window.initMinesweeper = function() {
    mineGrid = [];
    minesweeperGameOver = false;
    const board = document.getElementById('minesweeper-board');
    if (!board) return;
    board.innerHTML = '';

    // Crear grilla vacía
    for (let r = 0; r < rows; r++) {
        let rowArray = [];
        for (let c = 0; c < cols; c++) {
            rowArray.push({ mine: false, revealed: false, flagged: false, count: 0 });
            const cell = document.createElement('div');
            cell.id = `ms-${r}-${c}`;
            cell.style.width = '20px';
            cell.style.height = '20px';
            cell.style.background = '#c0c0c0';
            cell.style.border = '2px solid #fff';
            cell.style.borderBottomColor = '#808080';
            cell.style.borderRightColor = '#808080';
            cell.style.display = 'flex';
            cell.style.alignItems = 'center';
            cell.style.justifyContent = 'center';
            cell.style.fontWeight = 'bold';
            cell.style.fontSize = '12px';
            cell.style.cursor = 'pointer';
            
            cell.oncontextmenu = (e) => { e.preventDefault(); flagMine(r, c); };
            cell.onclick = () => revealMine(r, c);
            
            board.appendChild(cell);
        }
        mineGrid.push(rowArray);
    }

    // Plantar minas
    let placed = 0;
    while (placed < totalMines) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * cols);
        if (!mineGrid[r][c].mine) {
            mineGrid[r][c].mine = true;
            placed++;
        }
    }

    // Calcular números
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (!mineGrid[r][c].mine) {
                let count = 0;
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        if (r+i >= 0 && r+i < rows && c+j >= 0 && c+j < cols) {
                            if (mineGrid[r+i][c+j].mine) count++;
                        }
                    }
                }
                mineGrid[r][c].count = count;
            }
        }
    }
};

window.flagMine = function(r, c) {
    if (minesweeperGameOver || mineGrid[r][c].revealed) return;
    const cellData = mineGrid[r][c];
    cellData.flagged = !cellData.flagged;
    
    const div = document.getElementById(`ms-${r}-${c}`);
    div.innerText = cellData.flagged ? '🚩' : '';
};

window.revealMine = function(r, c) {
    if (minesweeperGameOver || mineGrid[r][c].revealed || mineGrid[r][c].flagged) return;
    
    const cellData = mineGrid[r][c];
    cellData.revealed = true;
    
    const div = document.getElementById(`ms-${r}-${c}`);
    div.style.background = '#e0e0e0';
    div.style.border = '1px solid #808080';
    
    if (cellData.mine) {
        div.innerText = '💣';
        div.style.background = 'red';
        minesweeperGameOver = true;
        revealAllMines();
        setTimeout(() => alert("¡Boom! Perdiste."), 100);
        return;
    }
    
    if (cellData.count > 0) {
        const colors = ['', 'blue', 'green', 'red', 'darkblue', 'brown', 'cyan', 'black', 'gray'];
        div.innerText = cellData.count;
        div.style.color = colors[cellData.count];
    } else {
        // Revelar adyacentes si es 0
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (r+i >= 0 && r+i < rows && c+j >= 0 && c+j < cols) {
                    revealMine(r+i, c+j);
                }
            }
        }
    }
};

window.revealAllMines = function() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (mineGrid[r][c].mine) {
                const div = document.getElementById(`ms-${r}-${c}`);
                div.innerText = '💣';
                div.style.border = '1px solid #808080';
                div.style.background = '#e0e0e0';
            }
        }
    }
};