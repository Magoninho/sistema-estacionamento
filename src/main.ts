import "./style.scss";
import "./signFinder";
import { findSignState } from "./signFinder";


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
    urlencoded.append("estado", findSignState(placa_input.value));

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
        let newText = document.createTextNode(`${i + 1}`);
        cell.appendChild(newText);

        let placa: string = "";
        for (const [key, value] of Object.entries(db[i])) {
            let cell = row.insertCell();
            let newText = document.createTextNode(value);
            cell.appendChild(newText);

            if (key == "placa") {
                placa = value;
            }
        }

        let removeCell = row.insertCell(6);
        let removeBtn = document.createElement("button");
        removeBtn.textContent = "Liberar";
        removeBtn.classList.add("btn");
        removeBtn.classList.add("btn-success");
        removeBtn.addEventListener("click", () => {
            console.log(placa);
            liberarSaida(placa);

        });
        removeCell.appendChild(removeBtn);

        // TODO: addEventListener no botão de remover
        // usando os dados do dataset para apagar no banco de dados a placa


    }
}

function getTimeDifferenceInMinutes(dateString1: string, dateString2: string): number {
    // Parse the date strings into Date objects
    const date1: any = new Date(dateString1);
    const date2: any = new Date(dateString2);

    // Get the time difference in milliseconds
    const timeDifferenceInMilliseconds = date2 - date1;

    // Convert the time difference from milliseconds to minutes
    const timeDifferenceInMinutes = timeDifferenceInMilliseconds / (1000 * 60);

    return timeDifferenceInMinutes;
}

function calculatePrice(timeDifference: number): number {
    let hours = timeDifference / 60;

    if (hours <= 0.25) {
        return 0;
    } else if (hours > 0.25 && hours <= 3) {
        return 5;
    } else {
        return Math.ceil(hours) + 2;
    }
}

async function liberarSaida(placa: string): Promise<void> {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    let saida = (new Date()).toUTCString()
    let chegada = await (() => {
        const requestOptions = {
            method: "GET"
        };


        return fetch(`http://localhost:3000/api/estacionados/${placa}`, requestOptions)
            .then((response) => response.text())
            .then((result) => JSON.parse(result).chegada)
            .catch((error) => console.log(error));
    })();

    let timeDifference: number = getTimeDifferenceInMinutes(chegada, saida);
    
    let price: number = calculatePrice(timeDifference);

    // console.log(price);
    
    

    const urlencoded = new URLSearchParams();
    urlencoded.append("saida", saida);
    urlencoded.append("preco", `R$${price},00`);

    const requestOptions = {
        method: "PATCH",
        headers: myHeaders,
        body: urlencoded
    };

    fetch(`http://localhost:3000/api/estacionados/${placa}`, requestOptions)
        .then((response) => {
            if (!response.ok) {
                alert("Erro: Placa não encontrada!");
                throw new Error("Erro: Placa não encontrada");
            } else {
                response.text();
            }
        })
        .then((result) => location.reload())
        .catch((error) => console.error(error));
}
