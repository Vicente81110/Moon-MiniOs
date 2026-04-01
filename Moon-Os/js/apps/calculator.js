// js/apps/calculator.js

function openCalculator() {
    const html = `
        <div style="display: flex; flex-direction: column; height: 100%; background: #ffffff; color: #333; font-family: 'Segoe UI', sans-serif;">
            <div style="padding: 20px; text-align: right; font-size: 36px; border-bottom: 1px solid #e5e5e5; background: #f9f9f9; word-break: break-all;" id="calc-display">0</div>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: #e5e5e5; flex-grow: 1; padding: 1px;">
                <button class="calc-btn op-btn" onclick="calcAction('clear')">C</button>
                <button class="calc-btn op-btn" onclick="calcAction('/')">÷</button>
                <button class="calc-btn op-btn" onclick="calcAction('*')">×</button>
                <button class="calc-btn op-btn" onclick="calcAction('-')">-</button>
                
                <button class="calc-btn num-btn" onclick="calcAction('7')">7</button>
                <button class="calc-btn num-btn" onclick="calcAction('8')">8</button>
                <button class="calc-btn num-btn" onclick="calcAction('9')">9</button>
                <button class="calc-btn op-btn" onclick="calcAction('+')" style="grid-row: span 2;">+</button>
                
                <button class="calc-btn num-btn" onclick="calcAction('4')">4</button>
                <button class="calc-btn num-btn" onclick="calcAction('5')">5</button>
                <button class="calc-btn num-btn" onclick="calcAction('6')">6</button>
                
                <button class="calc-btn num-btn" onclick="calcAction('1')">1</button>
                <button class="calc-btn num-btn" onclick="calcAction('2')">2</button>
                <button class="calc-btn num-btn" onclick="calcAction('3')">3</button>
                <button class="calc-btn eq-btn" onclick="calcAction('=')" style="grid-row: span 2;">=</button>
                
                <button class="calc-btn num-btn" onclick="calcAction('0')" style="grid-column: span 2;">0</button>
                <button class="calc-btn num-btn" onclick="calcAction('.')">.</button>
            </div>
        </div>
        <style>
            .calc-btn { border: none; font-size: 18px; cursor: pointer; transition: filter 0.1s; }
            .calc-btn:hover { filter: brightness(0.92); }
            .calc-btn:active { filter: brightness(0.85); }
            .num-btn { background: #ffffff; }
            .op-btn { background: #f0f0f0; }
            .eq-btn { background: #1979ca; color: white; font-weight: bold; }
        </style>
    `;

    WindowManager.createWindow('calc', 'Calculadora', html, 320, 450);
    window.calcExpr = '';
}

window.calcAction = function(val) {
    const display = document.getElementById('calc-display');
    if (!display) return;

    if (val === 'clear') {
        window.calcExpr = '';
        display.innerText = '0';
        return;
    }

    if (val === '=') {
        try {
            let result = eval(window.calcExpr).toString();
            if (result === 'Infinity' || result === 'NaN') result = 'Error';
            window.calcExpr = result;
        } catch (e) {
            window.calcExpr = 'Error';
        }
        display.innerText = window.calcExpr || '0';
        return;
    }

    if (window.calcExpr === 'Error') window.calcExpr = '';
    window.calcExpr += val;
    display.innerText = window.calcExpr;
};