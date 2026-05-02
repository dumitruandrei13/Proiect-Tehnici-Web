const express= require("express");
const path= require("path");

app= express();
app.set("view engine", "ejs")

console.log("Folder index.js", __dirname);
console.log("Folder curent (de lucru)", process.cwd());
console.log("Cale fisier", __filename);

app.get("/cale",function(req,res){
    console.log("Am primit o cerere GET la adresa /cale");
    res.send("Raspuns la <b style='color:red;'>cererea </b> GET la adresa /cale.");
});


app.get("/cale/:a/:b",function(req,res){
  res.send(parseInt(req.params.a) + parseInt(req.params.b));
});

app.get("/:a/:b",function(req,res){
  res.sendFile(path.join(__dirname,"index.html"));
});




// app.get("/resurse/css/general.css",function(req,res){
//     res.sendFile(path.join(__dirname,"resurse/css/general.css"));
// });


app.use("/resurse", express.static(path.join(__dirname, "resurse")));

app.get("/cale2",function(req,res){
    res.write("ceva ");
    res.write("altceva");
    res.end();
});


app.get("/despre",function(req,res){
res.render("pagini/despre")
});

app.get("/", function(req, res) {
    res.render("pagini/index");
});

app.get("/index", function(req, res) {
    res.render("pagini/index");
});

app.listen(8080);
console.log("Serverul a pornit!");