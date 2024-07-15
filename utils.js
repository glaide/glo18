
const MATERIAS_BCC = [
    ["CI068", "CI210", "CI212", "CI215", "CI162", "CI163", "CI221", "OPT"],
    ["CI055", "CI056", "CI057", "CI062", "CI065", "CI165", "CI211", "OPT"],
    ["CM046", "CI067", "CI064", "CE003", "CI059", "CI209", "OPT", "OPT"],
    ["CM045", "CM005", "CI237", "CI058", "CI061", "CI218", "OPT", "OPT"],
    ["CM201", "CM202", "CI166", "CI164", "SA214", "CI220", "TG I", "TG II"]
];

function desenhaGrade() {

    for (var i = 0; i < MATERIAS_BCC.length; i++) {
        var linha = MATERIAS_BCC[i];
        console.log("emtrou aquiuuuu");


        var tr = document.createElement("tr");
        for (var j = 0; j < linha.length; j++) {
            var td = document.createElement("td");
            td.innerHTML = linha[j];
            tr.appendChild(td);
        }
        document.getElementById("grade").appendChild(tr);
    }

}
