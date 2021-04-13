//  Start waarden spel
var legeBord = [5, 5, 5, 5, 5, 5, 5];
var spelersBord = [];
var speler1Beurt = true;

//  Standaard waarden voor spelers als niks ingevuld
var speler1Naam = "Player 1";
var speler2Naam = "Player 2";
var speler1Kleur = "red";
var speler2Kleur = "yellow";

//  Vervang de standaard waarden als er wat ingevuld is in de tekstvelden van "/start.html"
if(localStorage["speler1Naam"] != ""){
    speler1Naam  = localStorage["speler1Naam"];
}
if(localStorage["speler1Kleur"] != ""){
    speler1Kleur = localStorage["speler1Kleur"];
}
if(localStorage["speler2Naam"] != ""){
    speler2Naam  = localStorage["speler2Naam"];
}
if(localStorage["speler2Kleur"] != ""){
    speler2Kleur = localStorage["speler2Kleur"];
}

//  Toon op het scherm dat speler 1 begint
document.getElementById("huidigeSpeler").innerHTML = speler1Naam + "'s beurt!";

//  Voeg klik en hover luisteraars aan de tabel cellen
var cellen = document.getElementById("bord").getElementsByTagName("td");
for (var i = 0; i < cellen.length; i++) {
    cellen[i].addEventListener('mouseover', zweefWaarValt, false);
    cellen[i].addEventListener('mouseout', wegWaarValt, false);
    cellen[i].addEventListener('click', geldigeKlik, false);
}

/**
 * Sla meegegeven waaarden van "/start.html" op in browsergeheugen
 * @param {*} sp1naam   Naam van speler 1.
 * @param {*} sp1kleur  Kleur van speler 1.
 * @param {*} sp2naam   Naam van speler 2.
 * @param {*} sp2kleur  Kleur van speler 2.
 */
function startSpel(sp1naam, sp1kleur, sp2naam, sp2kleur){
    localStorage["speler1Naam"] = sp1naam;
    localStorage["speler1Kleur"] = sp1kleur;
    localStorage["speler2Naam"] = sp2naam;
    localStorage["speler2Kleur"] = sp2kleur;
}

/**
 * Handelt klik's af op tabelcellen. Een steen wordt in de eerstvolgende vrije plek van de kolom gezet.
 * Ook wordt op het scherm upgedate dat de beurt van de huidige speler over is.
 * @param {*} e Event object van de klik op een cel.
 */
function geldigeKlik(e){
    var kolom = krijgKolom(e);
    gooiSteen(kolom);
    if(wiensBeurt() == 1){
        document.getElementById("huidigeSpeler").innerHTML = speler1Naam + "'s beurt!";
    }
    else{
        document.getElementById("huidigeSpeler").innerHTML = speler2Naam + "'s beurt!";
    }
}

/**
 * Gooit een steen met de kleur van de huidige speler op de eerstvolgende beschikbare plek. 
 * Als er geen plek meer is in de kolom, verschijnt een popup en worden klikevents van de kolomcellen verwijderd.
 * @param {*} kolom Index van kolom van de geklikte cel.
 */
function gooiSteen(kolom){
    var cellen = document.getElementById("bord").getElementsByTagName("td");
    if(legeBord[kolom] >=  0){
        var gooiIndex = (legeBord[kolom] * 7) + kolom;
        spelersBord[gooiIndex] = wiensBeurt();
        cellen[gooiIndex].style.backgroundColor = geefKleur(true);
        isWinnaar(gooiIndex);
        legeBord[kolom]--; 
    }
    else{
        for(i = 0; i < 6; i++){
            cellen[kolom + i * 7].removeEventListener('click', geldigeKlik, false);
        }
        alert("In deze kolom kan niet meer gezet worden!");
    }
}

/**
 * Geeft de kleur van de huidige speler en verandert de kleur als een worp is gedaan.
 * @param {*} veranderKleur Boolean die aangeeft of de beurt van de huidige speler over is of niet.
 * @returns een string met de kleur van de speler die aan zet is.
 */
function geefKleur(veranderKleur){
    if(veranderKleur){
        if(speler1Beurt){
            speler1Beurt = false;
            return speler1Kleur;
        }
        else{
            speler1Beurt = true;
            return speler2Kleur;
        }
    }
    else{
        if(speler1Beurt){
            return speler1Kleur;
        }
        else{
            return speler2Kleur;
        }
    }
}

/**
 * Helper functie die kolom van de huidige cel teruggeeft.
 * @param {*} e Event object van de klik op de cel.
 * @returns Een nummer die de kolom van de geklikte cel teruggeeft
 */
function krijgKolom(e){
    var item = e.target;
    return item.cellIndex;
}

/**
 * Toont positie van waar een steen zou vallen als er in de huidige cel/kolom geklikt zou worden. 
 * Gebeurd bij hoveren over een cel. 
 * @param {*} e Event object van de hover over een cel.
 */
function zweefWaarValt(e){
    var kolom = krijgKolom(e);
    var cellen = document.getElementById("bord").getElementsByTagName("td");
    if(legeBord[kolom] >=  0){
        cellen[(legeBord[kolom] * 7) + kolom].style.backgroundColor = geefKleur(false);
    }
}

/**
 * Verwijdert de positie van waar een steen zou vallen als er in de huidige cel/kolom geklikt zou worden. 
 * Gebeurd wanneer er niet meer gehoverd wordt over een cel.
 * @param {*} e Event object van het stoppen met hoveren over een cel.
 */
function wegWaarValt(e){
    var kolom = krijgKolom(e);
    var cellen = document.getElementById("bord").getElementsByTagName("td");
    if(legeBord[kolom] >=  0){
        cellen[(legeBord[kolom] * 7) + kolom].style.backgroundColor = "";
    }
}

/**
 * Helper functie die teruggeeft welke speler aan de beurt is.
 * @returns Een nummer die aangeeft welke speler aan de beurt is.
 */
function wiensBeurt(){
    if (speler1Beurt){
        return 1;
    }
    else{
        return 2; 
    }
}

/**
 * Checkt of de laatste zet ervoor gezorgd heeft dat er een rij van successie is van 4 stenen van een speler.
 * Returnt als er een winnaar is en anders 0.
 * @param {*} index Waar de laatste steen gezet is.
 * @returns Een nummer 0, 1 of 2, die respectievelijk aangeven dat er nog geen, speler 1 of speler 2 gewonnen heeft.
 */
function kijkOfGewonnen(index){
    var result;
    result = horizontaalWin(index);
    if(result[1]){
        return result[0];
    }
    result = verticaalWin(index);
    if(result[1]){
        return result[0];
    }
    result = diagonaalLRWin(index);
    if(result[1]){
        return result[0];
    }
    result = diagonaalRLWin(index);
    if(result[1]){
        return result[0];
    }
    return 0;
}

/**
 * Gaat horizontaal van de laatstgezette steen na of er nog minstens 3 aaneengesloten stenen van een speler zijn.
 * @param {*} index De index van de laatstgezette steen.
 * @returns Een array met wiens steen de laatstgezette was en of de speler gewonnen heeft.
 */
function horizontaalWin(index){
    var totaalGelijk = 1;
    totaalGelijk += kijkRichting(index, "rechts");
    if(totaalGelijk < 4){
        totaalGelijk += kijkRichting(index, "links");
    }
    return [spelersBord[index], totaalGelijk >= 4];
}

/**
 * Gaat verticaal van de laatstgezette steen na of er nog minstens 3 aaneengesloten stenen van een speler zijn.
 * @param {*} index De index van de laatstgezette steen.
 * @returns Een array met wiens steen de laatstgezette was en of de speler gewonnen heeft.
 */
function verticaalWin(index){
    var totaalGelijk = 1;
    totaalGelijk += kijkRichting(index, "onder");
    if(totaalGelijk < 4){
        totaalGelijk += kijkRichting(index, "boven");
    }
    return [spelersBord[index], totaalGelijk >= 4]; 
}

/**
 * Gaat diagonaal van linksboven naar rechtsonder van de laatstgezette steen na of er nog minstens 3 aaneengesloten stenen van een speler zijn.
 * @param {*} index De index van de laatstgezette steen.
 * @returns Een array met wiens steen de laatstgezette was en of de speler gewonnen heeft.
 */
function diagonaalLRWin(index){
    var totaalGelijk = 1;
    totaalGelijk += kijkRichting(index, "linksBoven");
    if(totaalGelijk < 4){
        totaalGelijk += kijkRichting(index, "rechtsOnder");
    }
    return [spelersBord[index], totaalGelijk >= 4];
}

/**
 * Gaat diagonaal van linksonder naar rechtsboven van de laatstgezette steen na of er nog minstens 3 aaneengesloten stenen van een speler zijn.
 * @param {*} index De index van de laatstgezette steen.
 * @returns Een array met wiens steen de laatstgezette was en of de speler gewonnen heeft.
 */
function diagonaalRLWin(index){
    var totaalGelijk = 1;
    totaalGelijk += kijkRichting(index, "linksOnder");
    if(totaalGelijk < 4){
        totaalGelijk += kijkRichting(index, "rechtsBoven");
    }
    return [spelersBord[index], totaalGelijk >= 4];
}

/**
 * Helperfunctie die in de aangegeven richting vanaf de laatstgezette steen kijkt hoeveel stenen van dezelfde speler er zijn.
 * @param {*} index     De index van de laatstgezette steen.
 * @param {*} richting  Een string die aangeeft in welke richting er gekeken moet worden.
 * @returns Het totaal aantal stenen van dezelfde speler in de gezochtte richting.
 */
function kijkRichting(index, richting){
    var totaalGelijk = 0;
    var kolom = index % 7;
    var rij = Math.trunc(index / 7)
    var teller = 1;
    var wasGelijk = true;
    switch(richting) {
        case "rechts":
            while(kolom + teller < 7 && wasGelijk == true && totaalGelijk < 4){
                wasGelijk = spelersBord[index] == spelersBord[index + teller];
                if(wasGelijk){
                    totaalGelijk++;
                }
                teller++;
            }
            break;
        case "links": 
            while(kolom - teller >= 0 && wasGelijk == true && totaalGelijk < 4){
                wasGelijk = spelersBord[index] == spelersBord[index - teller];
                if(wasGelijk){
                    totaalGelijk++;
                }
                teller++;
            }
            break;
        case "onder":
            while(rij + teller < 6 && wasGelijk == true && totaalGelijk < 4){
                wasGelijk = spelersBord[index] == spelersBord[index + (teller * 7)];
                if(wasGelijk){
                    totaalGelijk++;
                }
                teller++;
            }
            break;
        case "boven": 
            while(rij - teller >= 0 && wasGelijk == true && totaalGelijk < 4){
                wasGelijk = spelersBord[index] == spelersBord[index - (teller * 7)];
                if(wasGelijk){
                    totaalGelijk++;
                }
                teller++;
            }
            break;
        case "linksBoven": 
            while(rij - teller >= 0 && kolom - teller >= 0  && wasGelijk == true && totaalGelijk < 4){
                wasGelijk = spelersBord[index] == spelersBord[index - teller - (teller * 7)];
                if(wasGelijk){
                    totaalGelijk++;
                }
                teller++;
            }
            break;
        case "rechtsOnder": 
            while(rij + teller < 6 && kolom + teller < 7  && wasGelijk == true && totaalGelijk < 4){
                wasGelijk = spelersBord[index] == spelersBord[index + teller + (teller * 7)];
                if(wasGelijk){
                    totaalGelijk++;
                }
                teller++;
            }
            break;
        case "linksOnder": 
            while(rij + teller < 6 && kolom - teller >= 0  && wasGelijk == true && totaalGelijk < 4){
                wasGelijk = spelersBord[index] == spelersBord[index - teller + (teller * 7)];
                if(wasGelijk){
                    totaalGelijk++;
                }
                teller++;
            }
            break;
        case "rechtsBoven": 
            while(rij - teller >= 0 && kolom + teller < 7  && wasGelijk == true && totaalGelijk < 4){
                wasGelijk = spelersBord[index] == spelersBord[index + teller - (teller * 7)];
                if(wasGelijk){
                    totaalGelijk++;
                }
                teller++;
            }
            break;
    }
    return totaalGelijk;
}

/**
 * Kijkt of er een winnaar is na het gooien van de laatste steen. 
 * Indien er een winnaar is wordt een popup bericht getoond met de winnaar en alle klik- en hoverevents verwijderd. 
 * @param {*} index De index van de laatstgezette steen.
 */
function isWinnaar(index){
    var isWinnaar = kijkOfGewonnen(index);
    var cellen = document.getElementById("bord").getElementsByTagName("td");
    if(isWinnaar == 1){
        alert("Speler " + speler1Naam + " wint! Druk op Start een nieuw spel voor een nieuwe ronde!");
        for(i = 0; i < cellen.length; i++){
            cellen[i].removeEventListener('click', geldigeKlik, false);
            cellen[i].removeEventListener('mouseover', zweefWaarValt, false);
            cellen[i].removeEventListener('mouseout', wegWaarValt, false);
            cellen[i].classList.remove("hoverEffect");
        }
    }
    else if(isWinnaar == 2){
        alert("Speler " + speler2Naam + " wint! Druk op Start een nieuw spel voor een nieuwe ronde!");
        for(i = 0; i < cellen.length; i++){
            cellen[i].removeEventListener('click', geldigeKlik, false);
            cellen[i].removeEventListener('mouseover', zweefWaarValt, false);
            cellen[i].removeEventListener('mouseout', wegWaarValt, false);
            cellen[i].classList.remove("hoverEffect");        
        }
    }
}