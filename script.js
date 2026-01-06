function direBonjour() {
    alert("Bonjour 👋 Application JavaScript !");
}

const joursContainer = document.getElementById("jours");
const moisAnnee = document.getElementById("moisAnnee");
const btnPrec = document.getElementById("precedent");
const btnSuiv = document.getElementById("suivant");
const compteurDiv = document.getElementById("compteur");

let dateCourante = new Date();
const aujourdHui = new Date();
aujourdHui.setHours(0,0,0,0);


const pagePrev = document.getElementById("pagePrev");
const pageNext = document.getElementById("pageNext");

const pages = ["calendrier.html", "collection.html"];
const currentPage = pages.findIndex(p => window.location.href.includes(p));

// Flèche gauche
pagePrev.disabled = currentPage <= 0;
pagePrev.onclick = () => {
    if(currentPage > 0){
        window.location.href = pages[currentPage - 1];
    }
};

// Flèche droite
pageNext.disabled = currentPage >= pages.length - 1;
pageNext.onclick = () => {
    if(currentPage < pages.length - 1){
        window.location.href = pages[currentPage + 1];
    }
};






const nomsMois = [
  "Janvier","Février","Mars","Avril","Mai","Juin",
  "Juillet","Août","Septembre","Octobre","Novembre","Décembre"
];

function cleJour(a,m,j){
  return `${a}-${m}-${j}`;
}

function semaineCourante(){
  const debut = new Date(aujourdHui);
  const d = (debut.getDay() + 6) % 7; // lundi=0
  debut.setDate(debut.getDate() - d);
  const fin = new Date(debut);
  fin.setDate(debut.getDate() + 6);
  return {debut, fin};
}

function majCompteur(){
  const cochees = document.querySelectorAll(".jour.coche").length;
  compteurDiv.textContent = `Jours cochés : ${cochees}`;
}

function chargerCalendrier(){
  joursContainer.innerHTML = "";
  const mois = dateCourante.getMonth();
  const annee = dateCourante.getFullYear();
  moisAnnee.textContent = `${nomsMois[mois]} ${annee}`;
  
  const premierJour = new Date(annee, mois,1).getDay();
  const joursDansMois = new Date(annee, mois+1,0).getDate();
  const decalage = (premierJour + 6)%7;
  const {debut, fin} = semaineCourante();

  for(let i=0;i<decalage;i++){
    joursContainer.appendChild(document.createElement("div"));
  }

  for(let jour=1;jour<=joursDansMois;jour++){
    const div = document.createElement("div");
    div.textContent = jour;
    div.classList.add("jour");

    const dateJour = new Date(annee, mois, jour);
    dateJour.setHours(0,0,0,0);
    const key = cleJour(annee, mois, jour);

    // ✅ applique coche d’abord
    if(localStorage.getItem(key)){
      div.classList.add("coche");
    }

    // aujourd’hui
    if(dateJour.getTime() === aujourdHui.getTime()){
      div.classList.add("aujourdhui");
    }

    // jours futurs → bloqués
    if(dateJour > aujourdHui){
      div.classList.add("bloque");
    }
    
    if(dateJour <= aujourdHui && dateJour >= debut && dateJour <= fin){
    div.addEventListener("click", ()=>{
        //if(div.classList.contains("coche")) return;

        div.classList.add("coche");
        localStorage.setItem(key,"true");
        majCompteur();
        genererCarteMystere();
    });
}



    // ✅ Les jours passés déjà cochés restent verts
    // Les jours passés non cochés restent blancs par défaut (pas de classe bloquée)
    joursContainer.appendChild(div);
  }

  majCompteur();
}


btnPrec.addEventListener("click", ()=>{
  dateCourante.setMonth(dateCourante.getMonth()-1);
  chargerCalendrier();
});

btnSuiv.addEventListener("click", ()=>{
  dateCourante.setMonth(dateCourante.getMonth()+1);
  chargerCalendrier();
});

chargerCalendrier();

//carte//

const cartesFace = [
    { id:1, src:"face1.png", rarete:50 }, // 50% chance
    {id:2, src:"face2.png", rarete:30}, // 30% chance
    //{id:3, src:"face3.png", rarete:20}  // 20% chance
];

function genererCarteMystere(){
    const container = document.getElementById("carte-container");
    const carte = document.getElementById("carte");
    const faceDos = document.getElementById("face-dos");

    // Choisir image aléatoire selon rareté
    const total = cartesFace.reduce((acc,c)=>acc+c.rarete,0);
    let rand = Math.random()*total;
    //let choisie;
    //for(let c of cartesFace){
        //if(rand < c.rarete){ choisie = c.src; break; }
        //rand -= c.rarete;
    //}
	let choisie;
	for(let c of cartesFace){
		if(rand < c.rarete){
        choisie = c;   // 👈 on garde TOUT l'objet
        break;
    }
    rand -= c.rarete;
    }
	if(!choisie) return;

    faceDos.src = "dos.png";
    carte.dataset.id = choisie.id;
    carte.dataset.src = choisie.src;

    container.style.display = "block";


    //faceDos.src = "dos.png"; // toujours le dos
    //carte.dataset.face = choisie;
	//arte.dataset.id = choisie.id;
	//carte.dataset.src = choisie.src;

    //container.style.display = "block";

    //carte.onclick = ()=>{
    //faceDos.src = choisie;      // on montre la carte
    //ajouterCollection(choisie); // on l’enregistre

    // (optionnel) on ferme la carte après clic
	
    //setTimeout(()=>{
        //container.style.display = "none";
    //}, 2500);
	carte.onclick = ()=>{
        faceDos.src = carte.dataset.src;
        ajouterCollection(carte.dataset.id);

        setTimeout(()=>{
            container.style.display = "none";
        }, 2500);
    };
}
function ajouterCollection(id){//src){
    //let i = 1;
    //while(localStorage.getItem("carte-"+i)){
        //i++;
    //}
    //localStorage.setItem("carte-"+i, src);
	//console.log("Carte ajoutée :", "carte-" + i, src);
	
	// si déjà débloquée → doublon, on ignore
    if(localStorage.getItem("carte-" + id)){
        console.log("Doublon tiré : carte-" + id);
        return;
    }

    localStorage.setItem("carte-" + id, "true");
    console.log("Nouvelle carte débloquée : carte-" + id);

}

//pour le mettre sur le portable 
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}


