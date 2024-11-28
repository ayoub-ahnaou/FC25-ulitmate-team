const body = document.querySelector("body");
import data from "../data/players.json" with { type: "json" };
const players = data.players;

const background = document.querySelector(".background");
const playerDetailsContainer = document.getElementById("player-details-container");
window.showPlayerDetails = (player_id, player_position, card_position, players_role, add_icons_id, type) => {
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
                <div class="h-10 max-md:mt-2 items-center flex justify-end gap-2" id="player-option">
                    <span class="cursor-pointer" onclick="playerOption()">More Option</span>
                </div>
            </div>

            <div id="player-option-list" class="absolute flex flex-col justify-between bottom-[-100%] transition-all delay-100 ease-in-out right-0 w-[100%] rounded-md h-[40%] bg-white text-black shadow-[0_0_20px_rgba(0,0,0,0.9)]">
                <div class="w-full flex justify-between p-4">
                    <p>Player Options</p>
                    <span class="cursor-pointer" onclick="closePlayerOption()">X</span>
                </div>
                <div class="flex-grow-0 pb-4">
                    <p class="px-4 cursor-pointer hover:bg-gray-100" onclick="removePlayerFromTeam('${player.id}', '${player_position}', '${card_position}', '${players_role}', '${add_icons_id}', '${type}')">
                        ${player.selected ? "Remove player from team" : ""}
                    </p>
                    <p class="px-4 cursor-pointer hover:bg-gray-100" onclick="insertPlayerIntoTeam('${player.id}')">
                        ${!player.selected ? "Insert player into Team" : ""}
                    </p>
                    <p class="px-4 cursor-pointer hover:bg-gray-100">
                        ${!player.selected ? "Delete Player from players list" : ""}
                    </p>
                    <p class="px-4 cursor-pointer hover:bg-gray-100">
                        ${player.selected ? "Substitute Player" : ""}
                    </p>
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
        closeDetailsPopUpPlayer();
    }
})

function closeDetailsPopUpPlayer() {
    body.classList.remove("my-body-noscroll-class");
    background.classList.remove("blur");
    playerDetailsContainer.classList.add("hidden")
    playerDetailsContainer.classList.remove("fixed");
    playerDetailsContainer.innerHTML = "";
}

const starters = JSON.parse(localStorage.getItem("starters")) || []; // array where the 11 players will be stored
const bench = JSON.parse(localStorage.getItem("bench")) || []; // array where changment will be stored
const team = JSON.parse(localStorage.getItem("team")) || []; // variable contains all players starters and bench

const cancelBtn = document.getElementById("cancel-btn");

// function to add a player from the list players to the TEAM
window.addPlayerToTeam = (player_position, card_position, players_role, type, add_icons_id) => {
    // player position: CM/RM/CB... card_position: goalKeeper, centreRightBack, centralMidfielder, centralRightMidfielder... type: bench/starter
    let goalkepeers = players.filter((gk) => gk.position === "GK" && !gk.selected)
    let deffenders = players.filter((cb) => (cb.position === "CB" || cb.position === "RB" || cb.position === "LB") && !cb.selected)
    let midfielders = players.filter((cm) => cm.position === "CM" && !cm.selected)
    let attackers = players.filter((ac) => (ac.position === "RW" || ac.position === "LW" || ac.position === "ST") && !ac.selected)
    
    const card_area = document.getElementById(card_position);

    // Style for toast notification
    const toast_notif = document.getElementById("toast-notif");
    toast_notif.style.right = "1%";
    setTimeout(() => {
        toast_notif.style.right = "-100%";
    }, 2000);

    document.getElementById(add_icons_id).style.display = "none"; // hide the plus icon
    // show the players filtered
    if(players_role == "goalkepeers") updateListPlayers(goalkepeers); 
    if(players_role == "deffenders") updateListPlayers(deffenders); 
    if(players_role == "midfielders") updateListPlayers(midfielders); 
    if(players_role == "attackers") updateListPlayers(attackers); 
    cancelBtn.classList.remove("hidden");
    card_area.classList.add("gold-shadow");

    // show all players if the user want cancel the add action
    cancelBtn.onclick = () => {
        document.getElementById(add_icons_id).style.display = "flex";
        cancelBtn.classList.add("hidden");
        card_area.classList.remove("gold-shadow");
        list_players();
    }

    window.appendPlayerToTeam = (player_id) => {
        const player = players[player_id - 1];
        player.selected = true;
        card_area.innerHTML = `
            <img src="../assets/images/stadium/card-normal.webp" class="h-full" alt="">
            <div class="h-3/5 w-full absolute top-0 flex pl-2 cursor-pointer" onclick="showPlayerDetails('${player.id}', '${player_position}', '${card_position}', '${players_role}', '${add_icons_id}', '${type}')">
                <div class="w-1/4 flex flex-col items-center justify-center">
                    <p class="text-lg max-sm:text-xs font-bold">${player.rating}</p>
                    <img src=${player.logo} class="max-md:size-auto" alt="">
                </div>
                <div class="center w-3/4">
                    <img src=${player.photo} class="w-full" alt="">
                </div>
            </div>
            <p class="absolute bottom-0 text-[.7rem] max-md:text-[.5rem] h-2/5 px-1 text-center w-full font-bold">${player.name}</p>
        `;

        if(type == "starter") starters.push(player);
        if(type == "bench") bench.push(player);
        team.push(player); // push the player to team

        cancelBtn.classList.add("hidden");
        card_area.classList.remove("gold-shadow");
        localStorage.setItem("starters", JSON.stringify(starters));
        localStorage.setItem("bench", JSON.stringify(bench));
        localStorage.setItem("team", JSON.stringify(team));
        
        list_players();
    }
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

// function to show the option list available for the player selected
window.playerOption = () => {
    const optionList = document.getElementById("player-option-list");
    optionList.style.bottom = "0";
}

// function to close the option list
window.closePlayerOption = () => {
    const optionList = document.getElementById("player-option-list");
    optionList.style.bottom = "-100%";
}

// function to handle adding player from option list
window.insertPlayerIntoTeam = (player_id) => {
    const player = players[player_id - 1];
    closeDetailsPopUpPlayer();

    const toastWarning = document.getElementById("toast-warning");
    toastWarning.style.right = "1%";

    document.addEventListener("click", (e) => {
        if(e.target.id == "toast-warning"){
            toastWarning.style.right = "-200%";
        }
    })
    setTimeout(() => toastWarning.style.right = "-200%", 10000);
}

// function to handle remove a player from the starter or bench players
window.removePlayerFromTeam = (player_id, player_position, card_position, players_role, add_icons_id, type) => {
    const player = players[player_id - 1];
    const card_area = document.getElementById(card_position);

    player.selected = false;
    card_area.innerHTML = `
        <img src="../assets/images/stadium/card-normal.webp" class="h-full" alt="">
        <div class="absolute top-0 bottom-0 w-full center flex-col gap-2" id="${add_icons_id}">
            <img onclick="addPlayerToTeam('${player_position}', '${card_position}', '${players_role}', '${type}', '${add_icons_id}')" src="../assets/images/icons/plus-square.svg" class="h-10 cursor-pointer" alt="">
            <span class="text-darkGray">${player_position}</span>
        </div>
    `;

    const toast_succes = document.getElementById("toast-succes");
    toast_succes.textContent = `Player removed succsefully from ${type}`;
    toast_succes.style.right = "1%";
    setTimeout(() => {
        toast_succes.style.right = "-100%";
    }, 2000);

    closeDetailsPopUpPlayer();
}
