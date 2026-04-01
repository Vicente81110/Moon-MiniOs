function openSnake() {
    const html = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; background: #1a1a1a; color: white; font-family: monospace;">
            <div style="margin-bottom: 10px; font-size: 18px;">Puntos: <span id="snake-score">0</span></div>
            <canvas id="snakeCanvas" width="300" height="300" style="border: 2px solid #333; background: #000;"></canvas>
            <div style="margin-top: 10px; font-size: 10px; color: #666;">Usa las flechas del teclado</div>
        </div>
    `;
    WindowManager.createWindow('snake', 'Snake Game', html, 350, 450);

    // Lógica del Juego
    setTimeout(() => {
        const canvas = document.getElementById('snakeCanvas');
        if(!canvas) return;
        const ctx = canvas.getContext('2d');
        let box = 15;
        let snake = [{x: 10 * box, y: 10 * box}];
        let food = { x: Math.floor(Math.random()*19+1)*box, y: Math.floor(Math.random()*19+1)*box };
        let score = 0;
        let d;

        document.addEventListener("keydown", direction);
        function direction(event) {
            if(event.keyCode == 37 && d != "RIGHT") d = "LEFT";
            else if(event.keyCode == 38 && d != "DOWN") d = "UP";
            else if(event.keyCode == 39 && d != "LEFT") d = "RIGHT";
            else if(event.keyCode == 40 && d != "UP") d = "DOWN";
        }

        function draw() {
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            for(let i = 0; i < snake.length; i++) {
                ctx.fillStyle = (i == 0) ? "#217346" : "#4ade80";
                ctx.fillRect(snake[i].x, snake[i].y, box, box);
            }
            
            ctx.fillStyle = "red";
            ctx.fillRect(food.x, food.y, box, box);
            
            let snakeX = snake[0].x;
            let snakeY = snake[0].y;
            
            if( d == "LEFT") snakeX -= box;
            if( d == "UP") snakeY -= box;
            if( d == "RIGHT") snakeX += box;
            if( d == "DOWN") snakeY += box;
            
            if(snakeX == food.x && snakeY == food.y) {
                score++;
                document.getElementById('snake-score').innerText = score;
                food = { x: Math.floor(Math.random()*19+1)*box, y: Math.floor(Math.random()*19+1)*box };
            } else {
                snake.pop();
            }
            
            let newHead = { x: snakeX, y: snakeY };
            
            if(snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height || collision(newHead, snake)) {
                clearInterval(game);
                alert("Game Over! Puntos: " + score);
                WindowManager.closeWindow('snake');
            }
            
            snake.unshift(newHead);
        }

        function collision(head, array) {
            for(let i = 0; i < array.length; i++) {
                if(head.x == array[i].x && head.y == array[i].y) return true;
            }
            return false;
        }

        let game = setInterval(draw, 100);
    }, 100);
}