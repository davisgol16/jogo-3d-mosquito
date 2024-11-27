let scene, camera, renderer, player, obstacles = [];
let speed = 0.1;
let obstacleSpeed = 0.05;
let gameOver = false;
let score = 0;
let highscore = localStorage.getItem("highscore") || 0;
let moveLeft = false, moveRight = false;
let gamePaused = false;

// Função para inicializar a cena
function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    // Jogador (nave)
    const geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    player = new THREE.Mesh(geometry, material);
    player.rotation.x = Math.PI / 2; // Coloca a nave na posição correta
    scene.add(player);
    
    // Criar obstáculos
    createObstacle();
    
    // Configurações dos botões de pausa e reiniciar
    document.getElementById('pauseButton').addEventListener('click', pauseGame);
    document.getElementById('resumeButton').addEventListener('click', resumeGame);
    document.getElementById('restartButton').addEventListener('click', restartGame);

    // Adicionar eventos de teclado e toque
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove);
    
    animate();
}

// Função de animação
function animate() {
    if (!gameOver && !gamePaused) {
        requestAnimationFrame(animate);
        renderer.clear();

        updateObstacles();

        // Movimentar jogador
        if (keys['ArrowLeft'] || moveLeft) player.position.x -= speed;
        if (keys['ArrowRight'] || moveRight) player.position.x += speed;

        // Atualizar a pontuação
        score++;
        updateScore();

        // Verificar colisões
        checkCollisions();

        // Renderizar cena
        renderer.render(scene, camera);
    }
}

// Função para criar obstáculos
function createObstacle() {
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const obstacle = new THREE.Mesh(geometry, material);
    obstacle.position.set(Math.random() * 4 - 2, 0, -10);
    scene.add(obstacle);
    obstacles.push(obstacle);
}

// Função para atualizar os obstáculos
function updateObstacles() {
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].position.z += obstacleSpeed;

        // Se o obstáculo passar pela tela, remova e crie outro
        if (obstacles[i].position.z > 5) {
            scene.remove(obstacles[i]);
            obstacles.splice(i, 1);
            createObstacle();
        }
    }
}

// Função para verificar colisões
function checkCollisions() {
    for (let i = 0; i < obstacles.length; i++) {
        if (Math.abs(player.position.x - obstacles[i].position.x) < 1 && 
            Math.abs(player.position.z - obstacles[i].position.z) < 1) {
            gameOver = true;
            if (score > highscore) {
                highscore = score;
                localStorage.setItem("highscore", highscore);
            }
            showGameOver();
        }
    }
}

// Função para atualizar a pontuação
function updateScore() {
    document.getElementById("score").innerText = score;
    document.getElementById("highscore").innerText = highscore;
}

// Função para exibir "Game Over"
function showGameOver() {
    alert("Game Over! Você colidiu com um asteroide.");
    document.getElementById('restartButton').classList.remove('hide');
}

// Função de pausa do jogo
function pauseGame() {
    gamePaused = true;
    document.getElementById('pauseButton').classList.add('hide');
    document.getElementById('resumeButton').classList.remove('hide');
}

// Função de continuar o jogo
function resumeGame() {
    gamePaused = false;
    document.getElementById('pauseButton').classList.remove('hide');
    document.getElementById('resumeButton').classList.add('hide');
}

// Função de reiniciar o jogo
function restartGame() {
    score = 0;
    gameOver = false;
    gamePaused = false;
    obstacles = [];
    player.position.set(0, 0, 0);
    createObstacle();
    updateScore();
    document.getElementById('restartButton').classList.add('hide');
    animate();
}

// Funções para capturar eventos de teclado
let keys = {};
function onKeyDown(event) {
    keys[event.key] = true;
}

function onKeyUp(event) {
    keys[event.key] = false;
}

// Funções para controle por toque (para celular)
let touchStartX = 0;
function onTouchStart(event) {
    touchStartX = event.touches[0].clientX;
}

function onTouchMove(event) {
    const touchMoveX = event.touches[0].clientX;
    if (touchMoveX < touchStartX - 50) {
        moveLeft = true;
        moveRight = false;
    } else if (touchMoveX > touchStartX + 50) {
        moveRight = true;
        moveLeft = false;
    }
}

// Inicializar o jogo
init();
