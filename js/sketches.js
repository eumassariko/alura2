/* ========================================
   SKETCHES.JS - Sketches do p5.js
   ======================================== */

// Este arquivo contém instâncias e configurações
// específicas de sketches p5.js para diferentes seções

// ========== Particle Class (usado em múltiplos sketches) ==========
class Particle {
    constructor(p) {
        this.p = p;
        this.reset();
    }

    reset() {
        this.x = this.p.random(0, this.p.width);
        this.y = this.p.random(0, this.p.height);
        this.vx = this.p.random(-2, 2);
        this.vy = this.p.random(-2, 2);
        this.size = this.p.random(3, 8);
        this.life = 255;
        this.lifeDecrement = this.p.random(1, 3);
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.lifeDecrement;

        // Bounce nas bordas
        if (this.x < 0 || this.x > this.p.width) {
            this.vx *= -1;
        }
        if (this.y < 0 || this.y > this.p.height) {
            this.vy *= -1;
        }

        // Manter dentro do canvas
        this.x = this.p.constrain(this.x, 0, this.p.width);
        this.y = this.p.constrain(this.y, 0, this.p.height);
    }

    display(p) {
        p.fill(99, 102, 241, this.life * 0.8);
        p.noStroke();
        p.ellipse(this.x, this.y, this.size);
    }

    isDead() {
        return this.life <= 0;
    }
}

// ========== Wave Class ==========
class Wave {
    constructor(amplitude, frequency, velocity) {
        this.amplitude = amplitude;
        this.frequency = frequency;
        this.velocity = velocity;
        this.time = 0;
    }

    update() {
        this.time += this.velocity;
    }

    calculateY(x) {
        return Math.sin(this.frequency * x + this.time) * this.amplitude;
    }
}

// ========== Visualizers ==========

// Visualizer para Home Page - Rede Interativa
function createHomeNetworkVisualizer() {
    return new p5((p) => {
        let particles = [];
        let connectionDistance = 100;

        p.setup = function() {
            const container = document.getElementById('p5-container-home');
            if (!container || container.querySelector('canvas')) return;

            const width = Math.max(container.offsetWidth - 40, 300);
            const height = 300;
            const canvas = p.createCanvas(width, height);
            canvas.parent('p5-container-home');

            // Criar partículas
            for (let i = 0; i < 40; i++) {
                particles.push(new Particle(p));
            }
        };

        p.draw = function() {
            if (!p.width || !p.height) return;

            p.background(240, 245, 250, 25);
            
            // Gradiente de fundo
            p.fill(240, 245, 250);
            p.rect(0, 0, p.width, p.height);

            // Desenhar linhas de conexão
            p.stroke(99, 102, 241, 50);
            p.strokeWeight(1);
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    let distance = p.dist(
                        particles[i].x, particles[i].y,
                        particles[j].x, particles[j].y
                    );
                    if (distance < connectionDistance) {
                        p.line(
                            particles[i].x, particles[i].y,
                            particles[j].x, particles[j].y
                        );
                    }
                }
            }

            // Atualizar e desenhar partículas
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].display(p);

                // Remover se morreu e adicionar nova
                if (particles[i].isDead()) {
                    particles[i].reset();
                }
            }
        };

        p.windowResized = function() {
            if (currentPage === 'home') {
                const container = document.getElementById('p5-container-home');
                if (container && p.windowWidth > 0) {
                    const width = Math.max(container.offsetWidth - 40, 300);
                    if (width > 0 && p.width !== width) {
                        p.resizeCanvas(width, 300);
                    }
                }
            }
        };
    }, 'p5-container-home');
}

// Visualizer para Dashboard - Widget 1
function createWidget1Visualizer() {
    return new p5((p) => {
        let rotation = 0;
        let scale = 1;
        let targetScale = 1;

        p.setup = function() {
            const container = document.getElementById('p5-container-widget1');
            if (!container || container.querySelector('canvas')) return;

            const width = container.offsetWidth - 20;
            const height = 250;
            const canvas = p.createCanvas(width, height);
            canvas.parent('p5-container-widget1');
        };

        p.draw = function() {
            if (!p.width || !p.height) return;

            p.background(249, 250, 251);

            // Grade de fundo
            p.stroke(230, 230, 230);
            p.strokeWeight(1);
            for (let i = 0; i < p.width; i += 50) {
                p.line(i, 0, i, p.height);
            }
            for (let i = 0; i < p.height; i += 50) {
                p.line(0, i, p.width, i);
            }

            p.translate(p.width / 2, p.height / 2);
            p.rotate(rotation);
            p.scale(scale);

            // Desenhar formas
            p.fill(99, 102, 241, 80);
            p.stroke(99, 102, 241);
            p.strokeWeight(2);
            p.rect(-40, -40, 80, 80);

            p.fill(139, 92, 246, 60);
            p.stroke(139, 92, 246);
            p.ellipse(0, 0, 100);

            p.fill(16, 185, 129, 40);
            p.stroke(16, 185, 129);
            p.triangle(-50, 50, 50, 50, 0, -50);

            rotation += 0.02;
            scale += (targetScale - scale) * 0.1;

            if (p.mouseIsPressed) {
                targetScale = 1.2;
            } else {
                targetScale = 1;
            }
        };

        p.mousePressed = function() {
            if (p.mouseX > 0 && p.mouseX < p.width && 
                p.mouseY > 0 && p.mouseY < p.height) {
                targetScale = 1.5;
                return false;
            }
        };
    }, 'p5-container-widget1');
}

// Visualizer para Dashboard - Widget 2
function createWidget2Visualizer() {
    return new p5((p) => {
        let waves = [];
        let offset = 0;

        p.setup = function() {
            const container = document.getElementById('p5-container-widget2');
            if (!container || container.querySelector('canvas')) return;

            const width = container.offsetWidth - 20;
            const height = 250;
            const canvas = p.createCanvas(width, height);
            canvas.parent('p5-container-widget2');

            // Criar múltiplas ondas
            waves.push(new Wave(60, 0.03, 1.5));
            waves.push(new Wave(40, 0.02, 1.2));
            waves.push(new Wave(30, 0.025, 0.8));
        };

        p.draw = function() {
            if (!p.width || !p.height) return;

            p.background(249, 250, 251);

            // Grade
            p.stroke(230, 230, 230);
            p.strokeWeight(1);
            p.line(0, p.height / 2, p.width, p.height / 2);

            // Desenhar ondas
            const colors = [
                [99, 102, 241],
                [139, 92, 246],
                [16, 185, 129]
            ];

            for (let w = 0; w < waves.length; w++) {
                p.stroke(...colors[w]);
                p.strokeWeight(2);
                p.noFill();

                p.beginShape();
                for (let x = 0; x < p.width; x += 5) {
                    let y = p.height / 2 + waves[w].calculateY(x);
                    p.vertex(x, y);
                }
                p.endShape();

                waves[w].update();
            }
        };
    }, 'p5-container-widget2');
}

// Visualizer para Dashboard - Widget 3
function createWidget3Visualizer() {
    return new p5((p) => {
        let particles = [];
        let attractors = [];

        p.setup = function() {
            const container = document.getElementById('p5-container-widget3');
            if (!container || container.querySelector('canvas')) return;

            const width = container.offsetWidth - 20;
            const height = 250;
            const canvas = p.createCanvas(width, height);
            canvas.parent('p5-container-widget3');

            // Criar partículas
            for (let i = 0; i < 50; i++) {
                particles.push(new Particle(p));
            }

            // Criar atractores
            attractors.push({ x: p.width * 0.3, y: p.height * 0.3 });
            attractors.push({ x: p.width * 0.7, y: p.height * 0.7 });
        };

        p.draw = function() {
            if (!p.width || !p.height) return;

            p.background(249, 250, 251);

            // Desenhar atractores
            p.fill(239, 68, 68, 100);
            p.noStroke();
            for (let att of attractors) {
                p.ellipse(att.x, att.y, 60);
            }

            // Atualizar partículas
            for (let particle of particles) {
                // Atrair para atractores
                for (let att of attractors) {
                    let dx = att.x - particle.x;
                    let dy = att.y - particle.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance > 0) {
                        particle.vx += (dx / distance) * 0.1;
                        particle.vy += (dy / distance) * 0.1;
                    }
                }

                particle.update();
                particle.display(p);
            }
        };
    }, 'p5-container-widget3');
}

// Visualizer para Dashboard - Widget 4
function createWidget4Visualizer() {
    return new p5((p) => {
        let dataValues = [25, 50, 35, 60, 45, 70, 40];
        let targetValues = [...dataValues];

        p.setup = function() {
            const container = document.getElementById('p5-container-widget4');
            if (!container || container.querySelector('canvas')) return;

            const width = container.offsetWidth - 20;
            const height = 250;
            const canvas = p.createCanvas(width, height);
            canvas.parent('p5-container-widget4');

            // Atualizar valores aleatórios a cada 3 segundos
            setInterval(() => {
                for (let i = 0; i < targetValues.length; i++) {
                    targetValues[i] = p.random(20, 80);
                }
            }, 3000);
        };

        p.draw = function() {
            if (!p.width || !p.height) return;

            p.background(249, 250, 251);

            // Interpolação suave dos valores
            for (let i = 0; i < dataValues.length; i++) {
                dataValues[i] += (targetValues[i] - dataValues[i]) * 0.1;
            }

            const barWidth = (p.width - 20) / dataValues.length;
            const maxHeight = p.height - 40;
            const colors = [
                [99, 102, 241],
                [139, 92, 246],
                [16, 185, 129],
                [59, 130, 246],
                [245, 158, 11],
                [239, 68, 68],
                [14, 165, 233]
            ];

            for (let i = 0; i < dataValues.length; i++) {
                const x = 10 + i * barWidth;
                const barHeight = (dataValues[i] / 100) * maxHeight;
                const y = p.height - barHeight - 30;

                p.fill(...colors[i]);
                p.noStroke();
                p.rect(x, y, barWidth - 5, barHeight, 4);

                // Label
                p.fill(100);
                p.textAlign(p.CENTER);
                p.textSize(10);
                p.text((i + 1), x + barWidth / 2 - 2.5, p.height - 10);
            }
        };
    }, 'p5-container-widget4');
}

// Visualizer para Analytics
function createAnalyticsVisualizer() {
    return new p5((p) => {
        let graphData = [];
        let time = 0;
        let pointSpacing = 15;

        p.setup = function() {
            const container = document.getElementById('p5-container-analytics');
            if (!container || container.querySelector('canvas')) return;

            const width = Math.max(container.offsetWidth - 40, 300);
            const height = 400;
            const canvas = p.createCanvas(width, height);
            canvas.parent('p5-container-analytics');

            // Gerar dados iniciais
            generateGraphData();
        };

        p.draw = function() {
            if (!p.width || !p.height) return;

            p.background(249, 250, 251);

            // Desenhar grid
            p.stroke(230, 230, 230);
            p.strokeWeight(1);
            for (let i = 50; i < p.height; i += 50) {
                p.line(0, i, p.width, i);
            }
            for (let i = 50; i < p.width; i += 50) {
                p.line(i, 0, i, p.height);
            }

            // Desenhar área sob a curva
            p.fill(99, 102, 241, 20);
            p.stroke(99, 102, 241, 0);
            p.beginShape();
            p.vertex(0, p.height);
            for (let point of graphData) {
                p.vertex(point.x, point.y);
            }
            p.vertex(p.width, p.height);
            p.endShape(p.CLOSE);

            // Desenhar linha
            p.stroke(99, 102, 241);
            p.strokeWeight(2);
            p.noFill();
            p.beginShape();
            for (let point of graphData) {
                p.vertex(point.x, point.y);
            }
            p.endShape();

            // Desenhar pontos
            p.fill(99, 102, 241);
            p.noStroke();
            for (let i = 0; i < graphData.length; i += 2) {
                p.ellipse(graphData[i].x, graphData[i].y, 5);
            }

            // Atualizar dados
            time += 0.01;
        };

        function generateGraphData() {
            graphData = [];
            for (let x = 0; x < p.width; x += pointSpacing) {
                let y = p.height / 2 + 
                    p.sin(x * 0.02 + time) * 60 +
                    p.sin(x * 0.01 + time * 0.5) * 40 +
                    p.random(-10, 10);
                graphData.push({ x: x, y: y });
            }
        }

        p.windowResized = function() {
            if (currentPage === 'analytics') {
                const container = document.getElementById('p5-container-analytics');
                if (container && p.windowWidth > 0) {
                    const width = Math.max(container.offsetWidth - 40, 300);
                    if (width > 0 && p.width !== width) {
                        p.resizeCanvas(width, 400);
                    }
                }
            }
        };
    }, 'p5-container-analytics');
}

console.log('✅ Sketches.js carregado com sucesso!');
