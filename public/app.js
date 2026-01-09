// Chess Game Application
let board = null;
let game = new Chess();
let stockfish = null;
let socket = null;
let currentMode = null;
let roomCode = null;
let playerColor = null;

// DOM Elements
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const botModeBtn = document.getElementById('bot-mode-btn');
const onlineModeBtn = document.getElementById('online-mode-btn');
const backBtn = document.getElementById('back-btn');
const resetBtn = document.getElementById('reset-btn');
const gameStatus = document.getElementById('game-status');
const gameModeTitle = document.getElementById('game-mode-title');
const botControls = document.getElementById('bot-controls');
const onlineControls = document.getElementById('online-controls');
const moveHistory = document.getElementById('move-history');
const difficultySelect = document.getElementById('difficulty');

// Online mode elements
const createRoomBtn = document.getElementById('create-room-btn');
const joinRoomBtn = document.getElementById('join-room-btn');
const joinRoomInput = document.getElementById('join-room-input');
const roomInfo = document.getElementById('room-info');
const roomCodeDisplay = document.getElementById('room-code');
const copyCodeBtn = document.getElementById('copy-code-btn');
const connectionStatus = document.getElementById('connection-status');

// Initialize board configuration
const config = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd,
    pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png'
};

// Initialize the board
function initBoard() {
    board = Chessboard('myBoard', config);
    window.addEventListener('resize', board.resize);
}

// Mode selection
botModeBtn.addEventListener('click', () => {
    currentMode = 'bot';
    startGame();
});

onlineModeBtn.addEventListener('click', () => {
    currentMode = 'online';
    startGame();
});

function startGame() {
    startScreen.classList.remove('active');
    gameScreen.classList.add('active');
    
    if (currentMode === 'bot') {
        gameModeTitle.textContent = 'Play vs Bot';
        botControls.style.display = 'flex';
        onlineControls.style.display = 'none';
        initStockfish();
    } else if (currentMode === 'online') {
        gameModeTitle.textContent = 'Play Online';
        botControls.style.display = 'none';
        onlineControls.style.display = 'flex';
        initSocketIO();
    }
    
    initBoard();
    updateStatus();
}

// Back to menu
backBtn.addEventListener('click', () => {
    gameScreen.classList.remove('active');
    startScreen.classList.add('active');
    resetGame();
    if (stockfish) {
        stockfish.terminate();
        stockfish = null;
    }
    if (socket) {
        socket.disconnect();
        socket = null;
    }
});

// Reset game
resetBtn.addEventListener('click', () => {
    resetGame();
});

function resetGame() {
    game.reset();
    if (board) {
        board.start();
    }
    moveHistory.innerHTML = '';
    updateStatus();
}

// Drag and drop handlers
function onDragStart(source, piece, position, orientation) {
    // Prevent picking up pieces if game is over
    if (game.game_over()) return false;

    // In online mode, only allow moving own pieces
    if (currentMode === 'online') {
        if ((game.turn() === 'w' && playerColor !== 'white') ||
            (game.turn() === 'b' && playerColor !== 'black')) {
            return false;
        }
    }

    // Only pick up pieces for the side to move
    if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
        return false;
    }
}

function onDrop(source, target) {
    // Try to make the move
    const move = game.move({
        from: source,
        to: target,
        promotion: 'q' // Always promote to queen for simplicity
    });

    // Illegal move
    if (move === null) return 'snapback';

    updateStatus();
    updateMoveHistory();

    // Handle bot response
    if (currentMode === 'bot' && !game.game_over()) {
        window.setTimeout(makeBotMove, 250);
    }

    // Send move to other player in online mode
    if (currentMode === 'online' && socket) {
        socket.emit('move', { room: roomCode, move: move });
    }
}

function onSnapEnd() {
    board.position(game.fen());
}

// Stockfish AI initialization
function initStockfish() {
    const wasmSupported = typeof WebAssembly === 'object';
    stockfish = new Worker('https://cdn.jsdelivr.net/npm/stockfish.js@10.0.2/stockfish.js');
    
    stockfish.addEventListener('message', function(e) {
        if (typeof e.data === 'string' && e.data.startsWith('bestmove')) {
            const bestMove = e.data.split(' ')[1];
            const move = game.move({
                from: bestMove.substring(0, 2),
                to: bestMove.substring(2, 4),
                promotion: bestMove.length > 4 ? bestMove.substring(4, 5) : 'q'
            });
            
            if (move) {
                board.position(game.fen());
                updateStatus();
                updateMoveHistory();
            }
        }
    });
}

function makeBotMove() {
    if (!stockfish || game.game_over()) return;
    
    const depth = difficultySelect.value;
    stockfish.postMessage('position fen ' + game.fen());
    stockfish.postMessage('go depth ' + depth);
}

// Socket.IO for online multiplayer
function initSocketIO() {
    socket = io();
    
    socket.on('connect', () => {
        connectionStatus.textContent = 'Connected';
        document.querySelector('.status-dot').classList.add('connected');
    });
    
    socket.on('disconnect', () => {
        connectionStatus.textContent = 'Disconnected';
        document.querySelector('.status-dot').classList.remove('connected');
    });
    
    socket.on('roomCreated', (data) => {
        roomCode = data.roomCode;
        playerColor = data.color;
        roomCodeDisplay.textContent = roomCode;
        roomInfo.style.display = 'block';
        createRoomBtn.style.display = 'none';
        joinRoomInput.style.display = 'none';
        joinRoomBtn.style.display = 'none';
        
        if (playerColor === 'black') {
            board.orientation('black');
        }
    });
    
    socket.on('roomJoined', (data) => {
        roomCode = data.roomCode;
        playerColor = data.color;
        roomCodeDisplay.textContent = roomCode;
        roomInfo.style.display = 'block';
        createRoomBtn.style.display = 'none';
        joinRoomInput.style.display = 'none';
        joinRoomBtn.style.display = 'none';
        
        if (playerColor === 'black') {
            board.orientation('black');
        }
    });
    
    socket.on('move', (data) => {
        game.move(data.move);
        board.position(game.fen());
        updateStatus();
        updateMoveHistory();
    });
    
    socket.on('opponentDisconnected', () => {
        alert('Your opponent has disconnected.');
    });
}

createRoomBtn.addEventListener('click', () => {
    if (socket) {
        socket.emit('createRoom');
    }
});

joinRoomBtn.addEventListener('click', () => {
    const code = joinRoomInput.value.trim().toUpperCase();
    if (code && socket) {
        socket.emit('joinRoom', code);
    }
});

copyCodeBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(roomCode).then(() => {
        copyCodeBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyCodeBtn.textContent = 'Copy';
        }, 2000);
    });
});

// Update game status
function updateStatus() {
    let status = '';
    let moveColor = game.turn() === 'w' ? 'White' : 'Black';

    if (game.in_checkmate()) {
        status = `Game over - ${moveColor === 'White' ? 'Black' : 'White'} wins by checkmate!`;
    } else if (game.in_draw()) {
        status = 'Game over - Draw';
    } else if (game.in_stalemate()) {
        status = 'Game over - Stalemate';
    } else if (game.in_threefold_repetition()) {
        status = 'Game over - Draw by repetition';
    } else {
        status = `${moveColor} to move`;
        if (game.in_check()) {
            status += ' - Check!';
        }
    }

    gameStatus.textContent = status;
}

// Update move history
function updateMoveHistory() {
    const history = game.history();
    moveHistory.innerHTML = '';
    
    for (let i = 0; i < history.length; i += 2) {
        const moveItem = document.createElement('div');
        moveItem.className = 'move-item';
        
        const moveNumber = document.createElement('span');
        moveNumber.className = 'move-number';
        moveNumber.textContent = `${Math.floor(i / 2) + 1}.`;
        
        const whiteMove = document.createElement('span');
        whiteMove.className = 'move-notation';
        whiteMove.textContent = history[i];
        
        const blackMove = document.createElement('span');
        blackMove.className = 'move-notation';
        blackMove.textContent = history[i + 1] || '';
        
        moveItem.appendChild(moveNumber);
        moveItem.appendChild(whiteMove);
        moveItem.appendChild(blackMove);
        moveHistory.appendChild(moveItem);
    }
    
    moveHistory.scrollTop = moveHistory.scrollHeight;
}