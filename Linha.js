// calcula a distância entre dois pontos
function calculaDistancia(coord1, coord2) {
    let h = coord1.x - coord2.x;
    let v = coord1.y - coord2.y;
    let result = Math.sqrt(h * h + v * v);
    return result;
}

const EDGE_MARGIN = 20;

class Linha {
    // coord1 e coord2 são objetos com campos x e y
    constructor(coord1, coord2) {
        var path = new Path2D();
        path.moveTo(coord1.x, coord1.y);
        path.lineTo(coord2.x, coord2.y);
        // salva coordenadas e path
        this.coords = [coord1, coord2];
        this.path = path;
        this.cor = COR_PADRAO;
    }
    // Atualiza coordenadas da linha
    atualizaCoords(coord1, coord2) {
        var path = new Path2D();
        path.moveTo(coord1.x, coord1.y);
        path.lineTo(coord2.x, coord2.y);
        // salva coordenadas e path
        this.coords = [coord1, coord2];
        this.path = path;
    }
    // verifica se as coordenadas do evento do mouse sobrepõe a linha e retorna um booleano
    mouseSobrepoe(mouse_event, ctx) {
        return ctx.isPointInStroke(
            this.path,
            mouse_event.offsetX,
            mouse_event.offsetY
        );
    }
    // Verifica se a coordenada está próxima de algum dos cantos da Linha.
    // Retorna 0 se estiver mais próximo do canto coords[0].
    // Retorna 1 se estiver mais próximo do canto coords[1].
    // Retorna 2 se não estiver próximo de nenhum canto.
    canto(coord) {
        const dist1 = calculaDistancia(coord, this.coords[0]);
        const dist2 = calculaDistancia(coord, this.coords[1]);
        // ponta da coord1
        if (dist1 <= EDGE_MARGIN && dist1 <= dist2) {
            return 0;
        } // ponta da coord2
        else if (dist2 <= EDGE_MARGIN) {
            return 1;
        }
        return 2;
    }
}
