
const MATERIAS_BCC = [
    ["CI068", "CI210", "CI212", "CI215", "CI162", "CI163", "CI221", "OPT"],
    ["CI055", "CI056", "CI057", "CI062", "CI065", "CI165", "CI211", "OPT"],
    ["CM046", "CI067", "CI064", "CE003", "CI059", "CI209", "OPT", "OPT"],
    ["CM045", "CM005", "CI237", "CI058", "CI061", "CI218", "OPT", "OPT"],
    ["CM201", "CM202", "CI166", "CI164", "SA214", "CI220", "TG I", "TG II"]
];

let NUM_OPTS = 0;

function leArquivo(xmlDoc, input, alunos) {
    let x = xmlDoc.documentElement.childNodes;
    alunos.limpa();
    // pega as entradas do xml e as transforma em objeto para inserir em alunos
    for (const item of x) {
        if (item.nodeType === 1) {
            const obj = {};
            for (const i of item.children) {
                const campo = i.tagName.toLowerCase();
                obj[campo] = i.textContent;
            }
            alunos.insere(obj);
        }
    }
    atualizaSeletor(input, alunos);
    alunos.ordena();
}


function classeMateria(situacao) {
    const str = situacao.toLowerCase();

    if (str.includes("aprovado")) {
        return "aprovado";
    } else if (str.includes("repr")) {
        return "reprovado";
    } else if (str.includes("matrícula") || str.includes("matricula")) {
        return "matriculado";
    } else if (str.includes("equivale")) {
        return "equivalencia";
    } else if (str.includes("tr. total")) {
        return "trancamento";
    }
    return "";
}


function geraCelulaObrig(codigo, materias) {
    let l_materias = null;
    let classe = "";

    switch (codigo) {
        case "OPT":
            const chaves = Object.keys(materias.optativas);
            if (NUM_OPTS < chaves.length) {
                const cod = chaves.at(NUM_OPTS);
                l_materias = materias.optativas[cod];
                NUM_OPTS += 1;
                classe = "optativas ";
            }
            break;
        case "TG I":
            l_materias = materias.tg1;
            classe = "tg1 ";
            break;
        case "TG II":
            l_materias = materias.tg2;
            classe = "tg2 ";
            break;
        default:
            l_materias = materias.obrigatorias[codigo];
            classe = "obrigatorias ";
    }

    if (l_materias != null && l_materias.length > 0) {
        classe += classeMateria(l_materias.at(-1).sigla);
        let id = classe === "" ? "" : l_materias.at(-1).cod_ativ_curric;
        return `<td class="${classe} celula" id="${id}"> ${codigo} </td>`;
    }
    return `<td> ${codigo} </td>`;
}

function geraCelulaOutras(outras_materias) {
    if (outras_materias === undefined)
        return "";
    const chaves = Object.keys(outras_materias);
    const num_chaves = chaves.length;

    let codigo = "";
    let l_materias = null;

    let num_linhas = Math.ceil(num_chaves / 8);
    // matemática maluca pra fazer a tabela de outras
    // com 8 matérias por linha
    for (let i = 0; i < num_linhas; i++) {
        codigo += "<tr>";
        let j = 0;
        for (; i * 8 + j < num_chaves && j < 8; j++) {
            let cod_mat = chaves[i * 8 + j];
            l_materias = outras_materias[cod_mat];
            let classe = classeMateria(l_materias.at(-1).sigla);
            let id = l_materias.at(-1).cod_ativ_curric;
            codigo += `<td class="outras ${classe} celula" id="${id}"> ${id} </td>`;
        }
        // colspan se sobrarem colunas e deixar minimamente mais bonito
        if (j < 8 && i > 0) {
            let spam = 8 - j;
            codigo += `<td colspan="${spam}">  </td>`;
        }
        codigo += "</tr>";
    }
    return codigo;
}



function desenhaGrade(obrigatorias, outras, materias = null) {
    let celulas_obg = "";
    let celulas_outras = "";
    NUM_OPTS = 0;
    // construir a grade curricular colorida só se tiver matérias2
    if (materias == null) {
        for (let l_materias of MATERIAS_BCC) {
            celulas_obg += "<tr>";
            for (let materia of l_materias) {
                celulas_obg += `<td> ${materia} </td>`;
            }
            celulas_obg += "</tr>";
        }
    }
    else {
        for (let l_materias of MATERIAS_BCC) {
            celulas_obg += "<tr>";
            for (let materia of l_materias) {
                celulas_obg += geraCelulaObrig(materia, materias);
            }
            celulas_obg += "</tr>";
        }
        celulas_outras = geraCelulaOutras(materias.outras);
    }
    obrigatorias.html(celulas_obg);
    outras.html(celulas_outras);
}

function atualizaSeletor(seletor, alunos) {
    let opcoes = "";
    const listaGRR = alunos.getGRRs();

    for (let grr of listaGRR) {
        opcoes += `<option value="${grr}"> ${grr} </option>`;
    }
    // não foi criado o novo html...
    if (opcoes === "") {
        opcoes += '<option value=""> Carregue um arquivo </option>';
    } else {
        opcoes = '<option value="">  </option>' + opcoes;
    }
    seletor.html(opcoes);
}

function geraModal(titulo, materias, classe, id, ultima) {
    let codigo = "";
    let vet_mat = materias[classe];
    if (!Array.isArray(vet_mat))
        vet_mat = vet_mat[id];

    if (ultima) {
        const info_mat = vet_mat.at(-1);
        titulo.html(info_mat.nome_ativ_curric);
        let freq = parseFloat(info_mat.frequencia.replace(',', '.')).toFixed(2).replace('.', ',');
        codigo = `
            <span class="fw-bold"> Código: </span> ${info_mat.cod_ativ_curric} <br>
            <span class="fw-bold"> Última vez cursada: </span> ${info_mat.ano}/${info_mat.periodo} <br>
            <span class="fw-bold"> Nota: </span> ${info_mat.media_final} <br>
            <span class="fw-bold"> Frequência: </span> ${freq}% <br>
            <span class="fw-bold"> Situação: </span> ${info_mat.situacao} <br>
        `;

    } else {
        codigo += `
            <span class="fw-bold"> Código: </span> ${vet_mat[0].cod_ativ_curric} <br>
            <div class="accordion" id="acordeao" style="margin-top: 10px;">
        `;
        let i = 0;
        for (const info_mat of vet_mat) {
            let heading = "heading" + i.toString();
            let collapse = "collapse" + i.toString();
            titulo.html(info_mat.nome_ativ_curric);
            let freq = parseFloat(info_mat.frequencia.replace(',', '.')).toFixed(2).replace('.', ',');
            codigo += `
                <div class="accordion-item">
                <h2 class="accordion-header" id="${heading}">
                    <button 
                        class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${collapse}"
                        aria-controls="${collapse}"
                    >
                    ${info_mat.ano}/${info_mat.periodo}
                    </button>
                </h2>
                <div id="${collapse}" class="accordion-collapse collapse" aria-labelledby="${heading}"
                    data-bs-parent="#acordeao">
                    <div class="accordion-body">
                        <span class="fw-bold"> Nota: </span> ${info_mat.media_final} <br>
                        <span class="fw-bold"> Frequência: </span> ${freq}% <br>
                        <span class="fw-bold"> Situação: </span> ${info_mat.situacao} <br>
                    </div>
                </div>
                </div>
            `;
            i++;
        }
        codigo += "</div>";
    }




    return codigo;
}