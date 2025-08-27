// particles.js
const PARTICLE_CONFIG = {
    COLOR: "#6fa8dc",
    RADIUS: 2,
    LINE_DISTANCE: 120,
    get NUM() {
        return window.innerWidth < 768 ? Math.floor(130 * 0.6) : 130;
    }
};

let canvas, ctx, particles = [];

function initParticles() {
    canvas = document.createElement('canvas');
    canvas.id = 'particles-canvas';
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    initParticleObjects();
    animate();
    let now = Date.now();
    let delta = now - (lastTime || now);
    lastTime = now;
}

function initParticleObjects() {
    particles = [];
    for (let i = 0; i < PARTICLE_CONFIG.NUM; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 1.2,
            vy: (Math.random() - 0.5) * 1.2
        });
    }
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles.forEach(p => {
        p.x = Math.random() * canvas.width;
        p.y = Math.random() * canvas.height;
    });
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(0.5, 0.5);//解决抗锯齿
    // 绘制粒子
    particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, PARTICLE_CONFIG.RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = PARTICLE_CONFIG.COLOR;
        ctx.fill();

        // 移动和边界检测
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    });

    // 绘制连线
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            let p1 = particles[i], p2 = particles[j];
            let dx = p1.x - p2.x, dy = p1.y - p2.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < PARTICLE_CONFIG.LINE_DISTANCE) {
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = `rgba(111,168,220,${1 - dist / PARTICLE_CONFIG.LINE_DISTANCE})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animate);
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initParticles);
} else {
    initParticles();
}