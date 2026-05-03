const fs = require("fs");
const express= require("express");
const path= require("path");

app= express();
app.set("view engine", "ejs");

const vect_foldere = ["temp", "logs", "backup", "fisiere_uploadate"];

for (let folder of vect_foldere) {
    let caleFolder = path.join(__dirname, folder);
    if (!fs.existsSync(caleFolder)) {
        fs.mkdirSync(caleFolder);
    }
}

const obGlobal = {
    obErori: null
};

function initErori() {
    const caleJSON = path.join(__dirname, "resurse/json/erori.json");
    const dateFisier = fs.readFileSync(caleJSON, "utf8");
    obGlobal.obErori = JSON.parse(dateFisier);

    // Setăm căile "absolute" (de la rădăcina serverului) pentru imagini
    obGlobal.obErori.eroare_default.imagine = path.posix.join(obGlobal.obErori.cale_baza, obGlobal.obErori.eroare_default.imagine);

    for (let eroare of obGlobal.obErori.info_erori) {
        eroare.imagine = path.posix.join(obGlobal.obErori.cale_baza, eroare.imagine);
    }
}

initErori();

function afisareEroare(res, identificator, titlu, text, imagine) {
    let eroare = obGlobal.obErori.info_erori.find(e => e.identificator == identificator);
    if (!eroare) eroare = obGlobal.obErori.eroare_default;

    let titluAfisat = titlu || eroare.titlu;
    let textAfisat = text || eroare.text;
    let imagineAfisata = imagine ? path.posix.join(obGlobal.obErori.cale_baza, imagine) : eroare.imagine;

    let status_raspuns = (eroare.status && identificator) ? identificator : 200;

    res.status(status_raspuns).render("pagini/eroare", {
        titlu: titluAfisat,
        text: textAfisat,
        imagine: imagineAfisata
    });
}

console.log("Folder index.js", __dirname);
console.log("Folder curent (de lucru)", process.cwd());
console.log("Cale fisier", __filename);

app.use("/resurse", express.static(path.join(__dirname, "resurse")));

app.get(/^\/resurse\/(.*)/, (req, res) =>{
    afisareEroare(res, 403);
});

app.get(/\.ejs$/, function(req, res) {
    afisareEroare(res, 400);
});

app.get("/favicon.ico", function(req, res) {
    res.sendFile(path.join(__dirname, "resurse/imagini/favicon/favicon.ico"));
});

app.get(["/", "/index", "/home"], function(req, res) {
    res.render("pagini/index");
});

app.get(/^(.*)$/, function(req, res) {
    res.render("pagini" + req.url, function(err, rezHtml) {
        if (err) {
            if (err.message.startsWith("Failed to lookup view")) {
                afisareEroare(res, 404);
            } else {
                afisareEroare(res, 500);
            }
        } else {
            res.send(rezHtml);
        }
    });
});

app.listen(8080);
console.log("Serverul a pornit!");
