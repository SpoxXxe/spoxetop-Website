let data = null;

async function loadData() {
  const response = await fetch('../scripts/data.json');
  data = await response.json();
  build_table();
  calculate_accuracy();
  document.querySelector('#grid thead tr').prepend(document.createElement('th'));
  document.querySelectorAll('#grid tbody tr').forEach(setupRow);
}

function build_table(){
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
    document.querySelector("#grid tbody").replaceChildren(...[...document.querySelector("#currTable tbody").rows].map(row => row.cloneNode(true)));
}

function calculate_accuracy(){
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
    var yourtable = document.getElementById("grid").getElementsByTagName("tr");
    yourtable = Array.from(yourtable).slice(1).map(row => {
  const cells = row.getElementsByTagName('td');
  return cells[3] ? cells[3].innerHTML : undefined;
});
    let nsum = 0;
    let dsum = 0;
    let ysum = 0;
    var n = 18
    for(var i = 0; i < totalStandings.table.length; i++){
        let name = totalStandings.table[i].team.name;
        nsum += (i-noahtable.indexOf(name))**2;
        dsum += (i-ductable.indexOf(name))**2;
        ysum += (i-yourtable.indexOf(name))**2;
    }
    var nrho = 1 - (6 * nsum) / (n * (n * n - 1));
    var drho = 1 - (6 * dsum) / (n * (n * n - 1));
    var yrho = 1 - (6 * ysum) / (n * (n * n - 1));
    document.getElementById("noahscore").innerHTML = `${Math.max(0, nrho.toFixed(3)) * 100}% accurate`;
    document.getElementById("ducscore").innerHTML = `${Math.max(0, drho.toFixed(3)) * 100}% accurate`;
    document.getElementById("yourscore").innerHTML = `${Math.max(0, yrho.toFixed(3)) * 100}% accurate`;
}


const EDITABLE_COLUMNS = [3,4,5,6,7,8,9];

let dragged = null;

function setupRow(tr) {
    // 1. Lock or unlock each cell based on its index
    [...tr.cells].forEach((td, index) => {
        if (EDITABLE_COLUMNS.includes(index)) {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = td.textContent.trim();
            td.textContent = '';
            td.appendChild(input);
        } else {
            td.classList.add('locked');
        }
    });

    // 2. Add the drag handle cell at the start (after the step above,
    //    so it doesn't shift your column indexes)
    const handle = document.createElement('td');
    handle.className = 'handle';
    handle.textContent = '⠿';
    handle.addEventListener('mousedown', () => tr.draggable = true);
    tr.prepend(handle);

    // 3. Drag and drop swapping
    tr.addEventListener('dragstart', () => {
        dragged = tr;
        tr.classList.add('dragging');
    });
    tr.addEventListener('dragend', () => {
        tr.draggable = false;
        tr.classList.remove('dragging');
        document.querySelectorAll('.over').forEach(r => r.classList.remove('over'));
        dragged = null;
    });
    tr.addEventListener('dragover', e => {
        if (!dragged || dragged === tr) return;
        e.preventDefault();
        tr.classList.add('over');
    });
    tr.addEventListener('dragleave', () => tr.classList.remove('over'));
    tr.addEventListener('drop', e => {
        e.preventDefault();
        if (!dragged || dragged === tr) return;
        swapRows(dragged, tr);
    });
}

function swapRows(a, b) {
    const marker = document.createElement('tr');
    a.before(marker);
    b.before(a);
    marker.replaceWith(b);

    renumberRows();
    calculate_accuracy();
}

function renumberRows() {
  document.querySelectorAll('#grid tbody tr').forEach((tr, i) => {
    // +1 because setupRow adds the drag handle cell at the start
    tr.cells[0 + 1].textContent = i + 1;
  });
}