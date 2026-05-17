class Creature {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.numSegmentos = 18;
        this.comprimentoSegmento = 22;
        this.segmentos = [];
        this.pernas = [];
        
        this.init();
    }

    init() {
        for (let i = 0; i < this.numSegmentos; i++) {
            this.segmentos.push({
                x: this.canvas.width / 2,
                y: this.canvas.height / 2,
                angulo: 0,
                larguraCostela: Math.sin((i / this.numSegmentos) * Math.PI) * 45 + 10
            });
        }

        const indicesPernas = [3, 7, 11]; 
        indicesPernas.forEach(segmentoIdx => {
            // Lado esquerdo (-1) e lado direito (1)
            this.pernas.push({ segIdx: segmentoIdx, lado: -1, alvoX: 0, alvoY: 0, atualX: 0, atualY: 0 });
            this.pernas.push({ segIdx: segmentoIdx, lado: 1, alvoX: 0, alvoY: 0, atualX: 0, atualY: 0 });
        });
    }

    update(mouse) {
        const cabeca = this.segmentos[0];
        const dx = mouse.x - cabeca.x;
        const dy = mouse.y - cabeca.y;
        cabeca.angulo = Math.atan2(dy, dx);
        
        cabeca.x += dx * 0.1;
        cabeca.y += dy * 0.1;

        for (let i = 1; i < this.numSegmentos; i++) {
            const segAtual = this.segmentos[i];
            const segAnterior = this.segmentos[i - 1];

            const dxSeg = segAnterior.x - segAtual.x;
            const dySeg = segAnterior.y - segAtual.y;
            segAtual.angulo = Math.atan2(dySeg, dxSeg);

            segAtual.x = segAnterior.x - Math.cos(segAtual.angulo) * this.comprimentoSegmento;
            segAtual.y = segAnterior.y - Math.sin(segAtual.angulo) * this.comprimentoSegmento;
        }
s
        this.pernas.forEach(perna => {
            const seg = this.segmentos[perna.segIdx];
            const anguloArticulacao = seg.angulo + (Math.PI / 2) * perna.lado;
            const raizX = seg.x + Math.cos(anguloArticulacao) * (seg.larguraCostela / 2);
            const raizY = seg.y + Math.sin(anguloArticulacao) * (seg.larguraCostela / 2);

            const distanciaPasso = 65;
            const direcaoPassoX = raizX + Math.cos(anguloArticulacao) * distanciaPasso;
            const direcaoPassoY = raizY + Math.sin(anguloArticulacao) * distanciaPasso;

            const distDoAlvo = Math.hypot(direcaoPassoX - perna.atualX, direcaoPassoY - perna.atualY);
            if (distDoAlvo > 80) {
                perna.atualX = direcaoPassoX;
                perna.atualY = direcaoPassoY;
            }

            perna.alvoX += (perna.atualX - perna.alvoX) * 0.3;
            perna.alvoY += (perna.atualY - perna.alvoY) * 0.3;
        });
    }

    draw() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        this.ctx.lineWidth = 2;

        for (let i = 0; i < this.numSegmentos; i++) {
            const seg = this.segmentos[i];

            this.ctx.save();
            this.ctx.translate(seg.x, seg.y);
            this.ctx.rotate(seg.angulo);

            this.ctx.beginPath();
            this.ctx.arc(0, 0, seg.larguraCostela / 2, -Math.PI / 2, Math.PI / 2);
            this.ctx.stroke();

            if (i === 0) {
                this.ctx.fillStyle = '#fff';
                this.ctx.beginPath();
                this.ctx.arc(0, 0, 5, 0, Math.PI * 2);
                this.ctx.fill();
            }

            this.ctx.restore();
        }

        this.pernas.forEach(perna => {
            const seg = this.segmentos[perna.segIdx];
            const anguloArticulacao = seg.angulo + (Math.PI / 2) * perna.lado;
            const raizX = seg.x + Math.cos(anguloArticulacao) * (seg.larguraCostela / 2);
            const raizY = seg.y + Math.sin(anguloArticulacao) * (seg.larguraCostela / 2);

            const meioX = (raizX + perna.alvoX) / 2;
            const meioY = (raizY + perna.alvoY) / 2;
            
            const anguloCorpo = seg.angulo;
            const dobraJoelho = 20 * perna.lado;
            const joelhoX = meioX + Math.cos(anguloCorpo) * dobraJoelho;
            const joelhoY = meioY + Math.sin(anguloCorpo) * dobraJoelho;

            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            this.ctx.beginPath();
            this.ctx.moveTo(raizX, raizY);
            this.ctx.lineTo(joelhoX, joelhoY);
            this.ctx.lineTo(perna.alvoX, perna.alvoY);
            this.ctx.stroke();

            this.ctx.beginPath();
            for (let a = -0.4; a <= 0.4; a += 0.4) {
                this.ctx.moveTo(perna.alvoX, perna.alvoY);
                this.ctx.lineTo(
                    perna.alvoX + Math.cos(seg.angulo + a + (perna.lado === -1 ? Math.PI : 0)) * 10,
                    perna.alvoY + Math.sin(seg.angulo + a + (perna.lado === -1 ? Math.PI : 0)) * 10
                );
            }
            this.ctx.stroke();
        });
    }
}
