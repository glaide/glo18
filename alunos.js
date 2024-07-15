

$(document).ready(function() {
    $('#raInput').on('change', function() {
        const ra = $(this).val();
        if (ra) {
            carregarDadosAluno(ra);
        }
    });
});


function carregarDadosAluno(ra) {
    console.log(`Iniciando a função carregarDadosAluno com RA: ${ra}`);

    const xhr = new XMLHttpRequest();
    xhr.open("GET", "alunos.xml", true);
    xhr.onload = function() {
        const xmlDoc = xhr.responseXML;
        const studentData= [];
        const studentNodes = xmlDoc.getElementsByTagName("ALUNO");
        console.log(`Encontrados ${studentNodes.length} alunos no XML`);
        Array.from(studentNodes).forEach(node => {
            const studentId = node.getElementsByTagName("MATR_ALUNO")[0].textContent;

            let studentIndex = studentData.findIndex(item => item[0] === studentId);
            if (studentIndex < 0) {
                studentData.push([studentId]);
                studentIndex = studentData.length - 1;
            }
            studentData[studentIndex].push({
                courseCode: node.getElementsByTagName("COD_ATIV_CURRIC")[0].textContent,
                acronym: node.getElementsByTagName("SIGLA")[0].textContent,
                year: node.getElementsByTagName("ANO")[0].textContent,
                semester: node.getElementsByTagName("PERIODO")[0].textContent,
                courseName: node.getElementsByTagName("NOME_ATIV_CURRIC")[0].textContent,
                finalGrade: node.getElementsByTagName("MEDIA_FINAL")[0].textContent,
                attendance: node.getElementsByTagName("FREQUENCIA")[0].textContent,
            });
        });

        const aluno = studentData.find(item => item[0] === ra);
        if (aluno) {
            exibirGradeCurricular(aluno);
        } else {
            alert("Aluno não encontrado.");
        }


    };
    xhr.onerror = function() {
        console.log("Erro ao carregar o arquivo XML.");
    };
    xhr.send();
}

function exibirGradeCurricular(aluno) {
    const gradeCurricular = document.getElementById('gradeCurricular');
    gradeCurricular.innerHTML = '';  // Limpar o conteúdo anterior

    const table = document.createElement('table');
    table.className = 'grade-table';

    // Cabeçalho da tabela
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headers = ['Código', 'Sigla', 'Nome', 'Ano', 'Semestre', 'Nota Final', 'Frequência'];
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Corpo da tabela
    const tbody = document.createElement('tbody');
    for (let i = 1; i < aluno.length; i++) {
        const disciplina = aluno[i];
        const row = document.createElement('tr');

        const courseCodeCell = document.createElement('td');
        courseCodeCell.textContent = disciplina.courseCode;
        row.appendChild(courseCodeCell);

        const acronymCell = document.createElement('td');
        acronymCell.textContent = disciplina.acronym;
        row.appendChild(acronymCell);

        const courseNameCell = document.createElement('td');
        courseNameCell.textContent = disciplina.courseName;
        row.appendChild(courseNameCell);

        const yearCell = document.createElement('td');
        yearCell.textContent = disciplina.year;
        row.appendChild(yearCell);

        const semesterCell = document.createElement('td');
        semesterCell.textContent = disciplina.semester;
        row.appendChild(semesterCell);

        const finalGradeCell = document.createElement('td');
        finalGradeCell.textContent = disciplina.finalGrade;
        row.appendChild(finalGradeCell);

        const attendanceCell = document.createElement('td');
        attendanceCell.textContent = disciplina.attendance;
        row.appendChild(attendanceCell);

        tbody.appendChild(row);
    }
    table.appendChild(tbody);
    gradeCurricular.appendChild(table);

}


