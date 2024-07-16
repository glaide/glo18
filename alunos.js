class Alunos {
    campos_aluno = [
        "cod_curso",
        "conceito",
        "id_curso_aluno",
        "id_estrutura_cur",
        "id_local_dispensa",
        "id_versao_curso",
        "matr_aluno",
        "nome_aluno",
        "nome_curso"
    ];

    constructor() {
        this.alunos = {};
    }

    insere(dados) {
        var matr_aluno = dados["matr_aluno"];

        var materia = {};
        var aluno = {};

        // cria a entrada da materia com os campos que não pertencem ao aluno
        for (let key of Object.keys(dados)) {
            if (!(this.campos_aluno.includes(key))) {
                materia[key] = dados[key];
            }
        }


        // cria entrada do aluno se não existe
        if (!(matr_aluno in this.alunos)) {
            for (let campo of this.campos_aluno) {
                aluno[campo] = dados[campo];
            }
            aluno["materias"] = new Materias();
            // e o inclui nos alunos cadastrados
            this.alunos[matr_aluno] = aluno;
        }

        // adiciona a matéria do aluno
        this.alunos[matr_aluno]["materias"].insere(materia);
    }

    imprime() {
        for (let key of Object.keys(this.alunos)) {
            console.log(this.alunos[key]);
            this.alunos[key]["materias"].imprime();
        }

    }
    limpa() {
        this.alunos = {};
    }

    getGRRs() {
        return Object.keys(this.alunos);
    }

    ordena() {
        const listaGRR = this.getGRRs();

        for (let grr of listaGRR) {
            this.alunos[grr]["materias"].ordena();
        }
    }

    getAluno(GRR){
        return this.alunos[GRR];
    }
}