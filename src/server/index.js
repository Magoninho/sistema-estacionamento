// const express = require("express");
// const 
import express, { json } from "express";
import cors from "cors";
import fs from "fs"

const app = express()
const port = 3000
app.use(cors());
app.use(express.urlencoded({ extended: true }));


app.post('/api/estacionar', (req, res) => {

    let placa = req.body.placa;

    fs.readFile("./database.json", (err, data) => {
        let json = JSON.parse(data);
        let canPush = true;

        for (let i = 0; i < json.length; i++) {
            const element = json[i];
            if (element.placa === placa) {
                canPush = false;
                
            }
        }
        
        if (canPush) {
            json.push({
                placa: placa,
                estado: "",
                chegada: new Date().toUTCString(),
                saida: "",
                preco: 0.00
            });

            fs.writeFile("./database.json", JSON.stringify(json), (err) => err && console.error(err));
            res.status(200).send("Uploaded sucessfully")
        } else {
            res.status(500).send("Error: Já existe uma entrada com essa placa");
        }
        

        
    });
});

app.get('/api/estacionados', (req, res) => {
    fs.readFile("./database.json", (err, data) => {
        var json = JSON.parse(data);
        res.json(json);
    });
});

app.listen(port, () => {
    console.log("app listening to port: " + port);
});

app.patch('/api/estacionados/:placa', (req, res) => {
    const { placa } = req.params;
    const { saida, estado, preco } = req.body;

    fs.readFile("./database.json", (err, data) => {
        let jsonArray = JSON.parse(data);


        for (let i = 0; i < jsonArray.length; i++) {
            const element = jsonArray[i];
            if (element.placa === placa) {
                // updating stuff here
                if (saida) jsonArray[i].saida = saida;
                if (estado) jsonArray[i].estado = estado;
                if (preco) jsonArray[i].preco = preco;
                break;
            }
        }
        res.send("updated");

        fs.writeFile("./database.json", JSON.stringify(jsonArray), (err) => err && console.error(err));
    });
});