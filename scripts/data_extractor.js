async function loadData() {
  const response = await fetch('../scripts/data.json');
  const data = await response.json();
  build_table(data);
  calculate_accuracy(data);
}

function build_table(data){
    var totalStandings = data.standings.find(s => s.type === 'TOTAL');
    var table = document.getElementById("currTable");
    var rows = table.getElementsByTagName("tr");
    for(var i = 1; i < rows.length; i++){
        currTeam = totalStandings.table[i-1]
        cells = rows[i].getElementsByTagName("td");
        cells[0].innerHTML = currTeam.position;
        var img = document.createElement('img');
        img.src = currTeam.team.crest;
        img.style = "width:20px;height:20px;"
        cells[1].appendChild(img);
        cells[2].innerHTML = currTeam.team.name;
        cells[3].innerHTML = currTeam.playedGames;
        cells[4].innerHTML = currTeam.won;
        cells[5].innerHTML = currTeam.draw;
        cells[6].innerHTML = currTeam.lost;
        cells[7].innerHTML = currTeam.goalsFor + "-" + currTeam.goalsAgainst;
        cells[8].innerHTML = currTeam.goalDifference;
        cells[9].innerHTML = currTeam.points;
    }
}

function calculate_accuracy(data){
    var totalStandings = data.standings.find(s => s.type === 'TOTAL');
    var noahtable = document.getElementById("noah").getElementsByTagName("tr");
    noahtable = Array.from(noahtable).slice(1).map(row => {
  const cells = row.getElementsByTagName('td');
  return cells[2] ? cells[2].innerHTML : undefined;
});
    var ductable = document.getElementById("duc").getElementsByTagName("tr");
    ductable = Array.from(ductable).slice(1).map(row => {
  const cells = row.getElementsByTagName('td');
  return cells[2] ? cells[2].innerHTML : undefined;
});
    let nsum = 0;
    let dsum = 0;
    var n = 18
    for(var i = 0; i < totalStandings.table.length; i++){
        let name = totalStandings.table[i].team.name;
        nsum += (i-noahtable.indexOf(name))**2;
        dsum += (i-ductable.indexOf(name))**2;
    }
    var nrho = 1 - (6 * nsum) / (n * (n * n - 1));
    var drho = 1 - (6 * dsum) / (n * (n * n - 1));
    document.getElementById("noahscore").innerHTML = `${Math.max(0, nrho.toFixed(3)) * 100}% accurate`;
    document.getElementById("ducscore").innerHTML = `${Math.max(0, drho.toFixed(3)) * 100}% accurate`;
}