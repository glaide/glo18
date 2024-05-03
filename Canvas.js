class Canvas {
    linhas = [];

    constructor(canvas, ctx, polysize = 50) {
        // armazena as linhas do canvas e tamanho dos polígonos
        this.canvas = canvas;
        this.ctx = ctx;
        this.polysize = polysize;
    }

    // Adiciona uma nota linha e retorna seu objeto
    // coord1 e coord2 são objetos com campos x e y
    criaLinha(coord1, coord2) {
        var linha = new Linha(coord1, coord2);
        this.linhas.push(linha);
        return linha;
    }
    // Desenha todas as linhas salvas na classe
    desenha() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (const l of this.linhas) {
            this.ctx.strokeStyle = l.cor;
            this.ctx.stroke(l.path);
        }
    }
    // Apaga todo o canvas e zera as linhas
    limpa() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.linhas.length = 0;
    }
    // Cria uma nova linha
    // coord é um objeto com campos x e y e linha uma Linha
    // Retorna a nova linha criada
    divideLinha(coord, linha) {
        var nova_linha = this.criaLinha(coord, linha.coords[1]);
        linha.atualizaCoords(coord, linha.coords[0]);
        return nova_linha;
    }
    // Obtém a linha que está na posição do click do mouse
    // Caso não seja encontrada linha, retorna null
    obtemLinha(mouse_event) {
        for (var l of this.linhas) {
            if (l.mouseSobrepoe(mouse_event, this.ctx)) {
                return l;
            }
        }
        return null;
    }
    // Define a cor de todas as linhas armazenadas
    atualizaCores(cor) {
        for (var l of this.linhas) {
            l.cor = cor;
        }
    }

    // baseado em http://www.scienceprimer.com/drawing-regular-polygons-javascript-canvas
    // Cria as linhas do polígono de dado número de lados
    criarPoligono(lados) {
        var sides = parseInt(lados)
        if (sides < 3 || sides > 8)
            return;
        // posições centrais do canvas
        const posX = parseInt(this.canvas.width / 2);
        const posY = parseInt(this.canvas.height / 2);

        for (let i = 0; i < sides; i++) {
            let coord1 = {
                x: posX + this.polysize * Math.cos(i * 2 * Math.PI / sides),
                y: posY + this.polysize * Math.sin(i * 2 * Math.PI / sides),
            };
            let coord2 = {
                x: posX + this.polysize * Math.cos((i + 1) * 2 * Math.PI / sides),
                y: posY + this.polysize * Math.sin((i + 1) * 2 * Math.PI / sides),
            };
            this.criaLinha(coord1, coord2);
        }
        this.desenha(this.canvas, this.ctx);
    }
}
