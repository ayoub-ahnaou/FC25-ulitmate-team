const body = document.querySelector("body");
import data from "../data/players.json" with { type: "json" };
const players = data.players;

const background = document.querySelector(".background");
const playerDetailsContainer = document.getElementById("player-details-container");
window.showPlayerDetails = (player_id) => {
    const player = players[player_id - 1];
    const stats_keys = Object.keys(player.stats);
    const stats_values = Object.values(player.stats);

    body.classList.add("my-body-noscroll-class");
    background.classList.add("blur");
    playerDetailsContainer.classList.remove("hidden")
    playerDetailsContainer.classList.add("fixed");
    playerDetailsContainer.innerHTML = `
        <div class="flex w-[400px] h-[400px] max-md:h-auto rounded-md overflow-hidden max-md:flex-col relative" id="player-details">
            <div class="max-md:w-full w-2/3 relative">
                <img src=${player.large_pic} class="h-full max-md:h-[350px] w-full object-cover" alt="">
                <span class="absolute top-0 p-8 text-6xl drop-shadow-[5px_5px_20px_rgba(255,255,255,0.99)] text-goldColor">${player.rating}</span>
                <div class="absolute p-4 w-full bottom-0 min-h-24 bg-gradient-to-b from-transparent flex flex-col to-black">
                    <span class="text-white text-2xl font-gaMaamli shadow-5xl">${player.name}</span>
                    <div class="flex justify-between items-center h-full">
                        <span class="text-xl text-goldColor">${player.position}</span>
                        <div class="flex gap-2 h-full">
                            <img src=${player.logo} class="h-10" alt="">
                            <img src=${player.flag} class="h-10" alt="">
                        </div>
                    </div>
                </div>
            </div>
            <div class="bg-darkGray w-1/3 h-full max-md:w-full flex flex-col p-4 gap-2 max-md:gap-4 justify-between">
                <div class="flex flex-col gap-2" id="stats-details">    </div>
                <div class="h-10 max-md:mt-2 items-center flex justify-end gap-2">
                    <span class="cursor-pointer">More Option</span>
                </div>
            </div>
        </div>
    `;
    for(let i=0; i<6; i++){
        document.getElementById("stats-details").innerHTML += `
        <div class="flex justify-between items-center">
            <span>${stats_keys[i]}</span>
            <span 
                class="p-1 text-black rounded-md ${stats_values[i] <= 20 ? "bg-veryPoor" : 
                    (stats_values[i] <= 40 ? "bg-poor" : 
                        (stats_values[i] <= 60 ? "bg-average" : 
                            (stats_values[i] <= 80 ? "bg-aboveAverage" : 
                                (stats_values[i] <= 90 ? "bg-good" : 
                                    'bg-excellent'))))}" >
                ${stats_values[i]}
            </span>
        </div>
        `;
    }
}

// functionmment of closing the details player when user click outside of the box
document.addEventListener("click", (e) => {
    if(e.target.id == "player-details-container"){
        body.classList.remove("my-body-noscroll-class");
        background.classList.remove("blur");
        playerDetailsContainer.classList.add("hidden")
        playerDetailsContainer.classList.remove("fixed");
        playerDetailsContainer.innerHTML = "";
    }
})

const starters = JSON.parse(localStorage.getItem("starters")) || []; // array where the 11 players will be stored
const bench = JSON.parse(localStorage.getItem("bench")) || []; // array where changment will be stored
const team = JSON.parse(localStorage.getItem("team")) || []; // variable contains all players starters and bench

// function to add a player from the list players to the TEAM
window.addPlayerToTeam = (player_position, card_position, players_role, type, add_icons_id) => {
    // player position: CM/RM/CB... card_position: goalKeeper, centreRightBack, centralMidfielder, centralRightMidfielder... type: bench/starter
    let goalkepeers = players.filter((gk) => gk.position === "GK" && !gk.selected)
    let deffenders = players.filter((cb) => (cb.position === "CB" || cb.position === "RB" || cb.position === "LB") && !cb.selected)
    let midfielders = players.filter((cm) => cm.position === "CM" && !cm.selected)
    let attackers = players.filter((ac) => (ac.position === "RW" || ac.position === "LW" || ac.position === "ST") && !ac.selected)
    
    const card_area = document.getElementById(card_position);

    document.getElementById(add_icons_id).style.display = "none"; // hide the plus icon
    // show the players filtered
    if(players_role == "goalkepeers") updateListPlayers(goalkepeers); 
    if(players_role == "deffenders") updateListPlayers(deffenders); 
    if(players_role == "midfielders") updateListPlayers(midfielders); 
    if(players_role == "attackers") updateListPlayers(attackers); 
    cancelBtn.classList.remove("hidden");
    card_area.classList.add("gold-shadow");

}

// function to update list players with possible players based on the position
function updateListPlayers(array) {
    const playersList = document.getElementById("players-list");

    playersList.innerHTML = "";
    array.map((player) => {
        playersList.innerHTML += `
            <div onclick="appendPlayerToTeam('${player.id}')" class="h-12 max-md:h-10 w-full p-1 hover:bg-darkGray transition-all delay-150 ease-in-out cursor-pointer flex gap-4 items-center">
                <img class="h-full" src=${player.photo} alt=${player.name}>
                <div class="flex flex-col h-full text-[10px] justify-center">
                    <span>${player.name}</span>
                    <span class="text-goldColor">${player.position}</span>
                </div>
                <div class="flex-1 h-full flex items-center gap-2 justify-end">
                    <img src=${player.logo} class="h-1/2" alt="">
                    <img src=${player.flag} class="h-1/2" alt="">
                    <span class="text-goldColor text-lg">${player.rating}</span>
                </div>
            </div>
        `;
    });
}
