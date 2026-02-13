const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const brushSize = document.getElementById('brushSize');
const sizeDisplay = document.getElementById('sizeDisplay');
const drawBtn = document.getElementById('drawBtn');
const eraserBtn = document.getElementById('eraserBtn');
const clearBtn = document.getElementById('clearBtn');
const saveBtn = document.getElementById('saveBtn');
const modeIndicator = document.getElementById('modeIndicator');

let isDrawing = false;
let currentColor = '#000000';
let currentSize = 5;
let isEraser = false;

// 캔버스 초기화 (흰색 배경)
ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, canvas.height);

// 브러시 크기 표시 업데이트
brushSize.addEventListener('input', (e) => {
    currentSize = e.target.value;
    sizeDisplay.textContent = currentSize;
});

// 색상 변경
colorPicker.addEventListener('change', (e) => {
    currentColor = e.target.value;
    if (!isEraser) {
        ctx.strokeStyle = currentColor;
    }
});

// 그리기 모드
drawBtn.addEventListener('click', () => {
    isEraser = false;
    ctx.strokeStyle = currentColor;
    ctx.globalCompositeOperation = 'source-over';
    modeIndicator.textContent = '그리기 모드';
    modeIndicator.className = 'mode-indicator mode-draw';
    canvas.style.cursor = 'crosshair';
});

// 지우개 모드
eraserBtn.addEventListener('click', () => {
    isEraser = true;
    ctx.globalCompositeOperation = 'destination-out';
    modeIndicator.textContent = '지우개 모드';
    modeIndicator.className = 'mode-indicator mode-erase';
    canvas.style.cursor = 'grab';
});

// 전체 지우기
clearBtn.addEventListener('click', () => {
    if (confirm('Do you want to clear the canvas?')) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
});

// 저장
saveBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = `paint_${new Date().getTime()}.png`;
    link.href = canvas.toDataURL();
    link.click();
});

// 그리기 시작
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('touchstart', startDrawing);

// 그리기 중
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('touchmove', draw);

// 그리기 종료
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);
canvas.addEventListener('touchend', stopDrawing);

function startDrawing(e) {
    isDrawing = true;
    const pos = getMousePos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
}

function draw(e) {
    if (!isDrawing) return;
    
    e.preventDefault();
    const pos = getMousePos(e);
    
    ctx.lineWidth = currentSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
}

function stopDrawing() {
    isDrawing = false;
    ctx.beginPath();
}

function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    
    return {
        x: (clientX - rect.left) * (canvas.width / rect.width),
        y: (clientY - rect.top) * (canvas.height / rect.height)
    };
}

// 초기 설정
ctx.strokeStyle = currentColor;
ctx.lineWidth = currentSize;
