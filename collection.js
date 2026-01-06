const cases = document.querySelectorAll(".case");

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












//function afficherCollection(){
    // Récupérer toutes les cartes stockées
    //const cartes = [];
    //for(let i=0; i<localStorage.length; i++){
        //const key = localStorage.key(i);
        //if(key.startsWith("carte-")){
            //const src = localStorage.getItem(key);
            //if(!cartes.includes(src)) cartes.push(src); // pas de doublon
        //}
    //}

    // remplir les cases fixes avec les cartes tirées
    //let index = 0;
    //cases.forEach(c => {
        //c.innerHTML = ""; // case vide par défaut (fond gris)
        //if(cartes[index]){
            //c.innerHTML = `<img src="${cartes[index]}">`;
            //index++;
        //}
    //});
//}
function afficherCollection(){
    cases.forEach(c => {
        const id = c.dataset.id;

        if(localStorage.getItem("carte-" + id)){
            c.innerHTML = `<img src="face${id}.png">`;
        } else {
            c.innerHTML = ""; // fond gris
        }
    });
}

window.onload = afficherCollection;
