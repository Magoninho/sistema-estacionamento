import "./style.scss"

let form = document.querySelector("#placa-submission-form") as HTMLFormElement;
let placa_input = document.querySelector("#placa-veiculo") as HTMLInputElement;

let tableBody: HTMLTableElement = document.querySelector("#carsTable") as HTMLTableElement;


window.addEventListener("load", () => {
    const requestOptions = {
        method: "GET"
      };
    
      fetch("http://localhost:3000/api/estacionados", requestOptions)
        .then((response) => response.json())
        .then((result) => initTable(result))
        .catch((error) => console.error(error));
});

form?.addEventListener("submit", (e) => {
    e.preventDefault()
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");


    const urlencoded = new URLSearchParams();
    urlencoded.append("placa", placa_input.value);

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: urlencoded
    };

    fetch("http://localhost:3000/api/estacionar", requestOptions)
        .then((response) => {
            if (!response.ok) {
                alert("Erro: Essa placa já foi cadastrada!");
                throw new Error("Deu erro pois já existe essa placa");
            } else {
                response.text();
            }
        })
        .then((result) => location.reload())
        .catch((error) => console.error(error));
    
});

// initializes the table for the first time, placing the data from the backend
function initTable(db: Vaga[]) {
    for (let i = 0; i < db.length; i++) {
        const element = db[i];
        let row = tableBody.insertRow();
        let cell = row.insertCell();
        var newText = document.createTextNode(`${i + 1}`);
        cell.appendChild(newText);

        for (const [key, value] of Object.entries(db[i])) {
            let cell = row.insertCell();
            var newText = document.createTextNode(value);
            cell.appendChild(newText);
        }

        let removeCell = row.insertCell(6);
        var removeBtn = document.createElement("button");
        removeBtn.textContent = "Remover";
        removeBtn.classList.add("btn");
        removeBtn.classList.add("btn-danger");
        removeCell.appendChild(removeBtn);
    }
}


// function udpateTable(db: Array<Object>) {
//     var table = document.getElementById("carsTable") as HTMLTableElement;
//     for (var i = 1, row; row = table.rows[i]; i++) {
//         for (var j = 1, col; col = row.cells[j]; j++) {
//             col.textContent = db[i - 1].placa
//         }
//     }
// }

// udpateTable();

function addRow(placa: string, estado: string, chegada: string, saida: string): void {
    
}