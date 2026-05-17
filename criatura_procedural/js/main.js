const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

const mouse = { x: canvas.width / 2, y: canvas.height / 2 };
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

const Input = {
    mouse: { left: false, middle: false, right: false }
};

document.addEventListener("mouseup", function(event) {
    if (event.button === 0) {
        Input.mouse.left = false;
    }
    if (event.button === 1) {
        Input.mouse.middle = false;
    }
    if (event.button === 2) {
        Input.mouse.right = false;
    }
});

document.addEventListener("mousedown", function(event) {
    if (event.button === 0) {
        Input.mouse.left = true;
    }
    if (event.button === 1) {
        Input.mouse.middle = true;
    }
    if (event.button === 2) {
        Input.mouse.right = true;
    }
});

const criatura = new Creature(canvas, ctx);

function animar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    criatura.update(mouse);
    criatura.draw();
    
    requestAnimationFrame(animar);
}

animar();
