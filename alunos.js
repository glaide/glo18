$(document).ready(function() {
    $('#raInput').on('change', function() {
        const ra = $(this).val();
        if (ra) {
            carregarDadosAluno(ra);
        }
    });
});

function carregarDadosAluno(ra) {
    $.ajax({
        type: "GET",
        url: "alunos.xml",
        dataType: "xml",
        success: function(xml) {
            const aluno = $(xml).find(`aluno:has(ra:contains(${ra}))`);
            if (aluno.length > 0) {
                exibirGradeCurricular(aluno);
            } else {
                alert("Aluno não encontrado.");
            }
        },
        error: function() {
            alert("Erro ao carregar o arquivo XML.");
        }
    });
}

function exibirGradeCurricular(aluno) {
    const disciplinas = aluno.find('disciplina');
    const gradeCurricular = $('#gradeCurricular');
    gradeCurricular.empty();

    disciplinas.each(function() {
        const disciplina = $(this);
        const situacao = disciplina.find('situacao').text();
        const cor = getCorSituacao(situacao);

        const divDisciplina = $('<div></div>').addClass('disciplina').css('background-color', cor);
        divDisciplina.text(disciplina.find('nome').text());
        divDisciplina.on('click', function() {
            exibirPopupDisciplina(disciplina);
        });
        divDisciplina.on('contextmenu', function(e) {
            e.preventDefault();
            exibirHistoricoDisciplina(disciplina);
        });
        gradeCurricular.append(divDisciplina);
    });
}

function getCorSituacao(situacao) {
    switch (situacao) {
        case 'aprovado':
            return 'green';
        case 'reprovado':
            return 'red';
        case 'matriculado':
            return 'blue';
        case 'equivalencia':
            return 'yellow';
        default:
            return 'white';
    }
}

function exibirPopupDisciplina(disciplina) {
    const codigo = disciplina.find('codigo').text();
    const nome = disciplina.find('nome').text();
    const ano = disciplina.find('ano').text();
    const semestre = disciplina.find('semestre').text();
    const nota = disciplina.find('nota').text();
    const frequencia = disciplina.find('frequencia').text();

    alert(`Código/Nome: ${codigo} / ${nome}\nÚltima vez cursada: ${ano}/${semestre}\nNota: ${nota}\nFrequência: ${frequencia}%`);
}

function exibirHistoricoDisciplina(disciplina) {
    const codigo = disciplina.find('codigo').text();
    const historico = disciplina.closest('aluno').find(`disciplina:has(codigo:contains(${codigo}))`);
    let historicoText = `Histórico da disciplina ${codigo}:\n`;

    historico.each(function() {
        const disc = $(this);
        historicoText += `Ano/Semestre: ${disc.find('ano').text()}/${disc.find('semestre').text()}\nNota: ${disc.find('nota').text()}\nFrequência: ${disc.find('frequencia').text()}%\n\n`;
    });

    alert(historicoText);
}