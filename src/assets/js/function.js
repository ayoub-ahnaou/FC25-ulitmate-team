
const body = document.querySelector("body");
import data from "../data/players.json" with { type: "json" };
import countries from "../data/countries.json" with { type: "json" };
import clubs from "../data/clubs.json" with { type: "json" };
const players = data.players;

setTimeout(() => {
    document.querySelector(".loader").style.display = "none";
}, 2000);

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
        <div class="flex w-[400px] h-[400px] max-md:h-auto rounded-md overflow-hidden max-md:flex-col relative shadow-lg" id="player-details">
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
            <div class="bg-darkGray dark:bg-white dark:text-black w-1/3 h-full max-md:w-full flex flex-col p-4 gap-2 max-md:gap-4 justify-between">
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
                    <p class="px-4 cursor-pointer hover:bg-gray-100" onclick="removePlayerFromTeam('${player.id}')">
                        ${player.selected ? "Remove player from team" : ""}
                    </p>
                    <p class="px-4 cursor-pointer hover:bg-gray-100" onclick="insertPlayerIntoTeam('${player.id}')">
                        ${!player.selected ? "Insert player into Team" : ""}
                    </p>
                    <p class="px-4 cursor-pointer hover:bg-gray-100">
                        ${!player.selected ? "Delete Player from players list" : ""}
                    </p>
                    <p class="px-4 cursor-pointer hover:bg-gray-100" onclick="substitutePlayer('${player.id}')">
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

let goalkepeers;
let deffenders;
let midfielders;
let attackers;

const starters = []; //JSON.parse(localStorage.getItem("starters")) || []; // array where the 11 players will be stored
const bench = []; //JSON.parse(localStorage.getItem("bench")) || []; // array where changment will be stored
const team = []; //JSON.parse(localStorage.getItem("team")) || []; // variable contains all players starters and bench

const cancelBtn = document.getElementById("cancel-btn");
const toast_notif = document.getElementById("toast-notif");
const toastWarning = document.getElementById("toast-warning");
const toast_succes = document.getElementById("toast-succes");
const toast_error = document.getElementById("toast-error");

// function to add a player from the list players to the TEAM
window.addPlayerToTeam = (current_position, player_position_in_stadium, player_role, bench_or_starter, add_icons_id) => {
    // player position: CM/RM/CB... card_position: goalKeeper, centreRightBack, centralMidfielder, centralRightMidfielder... type: bench/starter
    const all_add_icons = Array.from(document.getElementsByClassName("add-icon"));
    all_add_icons.map((icon_item) => {
        if(icon_item.id != add_icons_id){
            document.getElementById(icon_item.id).parentElement.classList.remove("gold-shadow");
            document.getElementById(icon_item.id).style.display = "flex";
        }
    })

    goalkepeers = players.filter((gk) => gk.position === "GK" && !gk.selected)
    deffenders = players.filter((cb) => (cb.position === "CB" || cb.position === "RB" || cb.position === "LB") && !cb.selected)
    midfielders = players.filter((cm) => cm.position === "CM" && !cm.selected)
    attackers = players.filter((ac) => (ac.position === "RW" || ac.position === "LW" || ac.position === "ST") && !ac.selected)

    const card_player_area = document.getElementById(player_position_in_stadium);

    // Style for toast notification
    toast_notif.textContent = "You can add a player from the players list";
    toast_notif.style.right = "1%";
    setTimeout(() => {
        toast_notif.style.right = "-100%";
    }, 2000);

    document.getElementById(add_icons_id).style.display = "none"; // hide the plus icon
    // show the players filtered
    if(player_role == "goalkepeers") updateListPlayers(goalkepeers); 
    if(player_role == "deffenders") updateListPlayers(deffenders); 
    if(player_role == "midfielders") updateListPlayers(midfielders); 
    if(player_role == "attackers") updateListPlayers(attackers); 
    cancelBtn.classList.remove("hidden");
    card_player_area.classList.add("gold-shadow");

    // show all players if the user want cancel the add action
    cancelBtn.onclick = () => {
        document.getElementById(add_icons_id).style.display = "flex";
        cancelBtn.classList.add("hidden");
        card_player_area.classList.remove("gold-shadow");
        list_players();
    }

    window.appendPlayerToTeam = (player_id) => {
        const player = players[player_id - 1];
        player.selected = true;
        
        player.current_position = current_position;
        player.player_position_in_stadium = player_position_in_stadium;
        player.player_role = player_role;
        player.bench_or_starter = bench_or_starter;
        player.add_icons_id = add_icons_id;
    
        card_player_area.innerHTML = `
            <img src="../assets/images/stadium/card-normal.webp" class="h-full" alt="">
            <div class="h-3/5 w-full absolute top-0 flex pl-2 cursor-pointer" onclick="showPlayerDetails('${player.id}')">
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

        if(bench_or_starter == "starter") starters.push(player);
        if(bench_or_starter == "bench") bench.push(player);
        team.push(player); // push the player to team

        cancelBtn.classList.add("hidden");
        card_player_area.classList.remove("gold-shadow");
        // HACK: localStorage.setItem("starters", JSON.stringify(starters));
        // HACK: localStorage.setItem("bench", JSON.stringify(bench));
        // HACK: localStorage.setItem("team", JSON.stringify(team));
        
        list_players();
    }
}

// function to update list players with possible players based on the position
function updateListPlayers(array) {
    const playersList = document.getElementById("players-list");

    playersList.innerHTML = "";
    array.map((player) => {
        playersList.innerHTML += `
            <div onclick="appendPlayerToTeam('${player.id}')" class="h-12 max-md:h-10 w-full p-1 hover:bg-darkGray dark:hover:bg-gray-50 dark:text-black transition-all delay-150 ease-in-out cursor-pointer flex gap-4 items-center">
                <img class="h-full" src=${player.photo} alt="${player.name}">
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

    toastWarning.textContent = "You have to choose the position first, then select the player you want to insert";
    toastWarning.style.right = "1%";

    document.addEventListener("click", (e) => {
        if(e.target.id == "toast-warning"){
            toastWarning.style.right = "-200%";
        }
    })
    setTimeout(() => toastWarning.style.right = "-200%", 10000);
}

// function to handle remove a player from the starter or bench players
window.removePlayerFromTeam = (player_id) => {
    const player = players[player_id - 1];
    const card_area = document.getElementById(player.player_position_in_stadium);

    card_area.innerHTML = `
        <img src="../assets/images/stadium/card-normal.webp" class="h-full" alt="">
        <div class="absolute top-0 bottom-0 w-full center flex-col gap-2" id="${player.add_icons_id}">
        <img onclick="addPlayerToTeam('${player.current_position}', '${player.player_position_in_stadium}', '${player.player_role}', '${player.bench_or_starter}', '${player.add_icons_id}')" src="../assets/images/icons/plus-square.svg" class="h-10 cursor-pointer" alt="">
        <span class="text-darkGray">${player.current_position}</span>
        </div>
    `;
    
    toast_succes.textContent = `Player removed succsefully from ${player.bench_or_starter}`;
    toast_succes.style.right = "1%";
    setTimeout(() => {
        toast_succes.style.right = "-100%";
    }, 2000);
    
    player.selected = false;
    player.add_icons_id = "";
    player.current_position = "";
    player.player_position_in_stadium = "";
    player.bench_or_starter = "";
    player.player_role = "";
    closeDetailsPopUpPlayer();
}

// function to handle substituting player
window.substitutePlayer = (player_id) => {
    const player = players[player_id - 1];

    goalkepeers = players.filter((player) => player.position === "GK" && player.selected && player.id != player_id);
    deffenders = players.filter((player) => (player.position === "CB" || player.position === "RB" || player.position === "LB") && player.selected && player.id != player_id);
    midfielders = players.filter((player) => player.position === "CM" && player.selected && player.id != player_id);
    attackers = players.filter((player) => (player.position === "RW" || player.position === "LW" || player.position === "ST") && player.selected && player.id != player_id);

    if(player.player_role === "goalkepeers"){
        if(!goalkepeers.length){
            toast_error.textContent = "Aucun player possible to substitute with " +player.name+ " in your Team.";
            toast_error.style.right = "1%";
            setTimeout(() => {
                toast_error.style.right = "-100%";
                toast_error.textContent = "";
            }, 2500);
            closeDetailsPopUpPlayer();
            return;
        }
        cancelBtn.classList.toggle("hidden");
        goalkepeers.map((player_to_substitute) => {
            document.getElementById(player_to_substitute.player_position_in_stadium).classList.add("gold-shadow");
            const safeJson = JSON.stringify(goalkepeers).replace(/'/g, "\\'").replace(/"/g, '&quot;');

            // change the function in card player while substituting
            document.getElementById(player_to_substitute.player_position_in_stadium).innerHTML = `
                <img src="../assets/images/stadium/card-normal.webp" class="h-full" alt="">
                <div class="h-3/5 w-full absolute top-0 flex pl-2 cursor-pointer" onclick="switchPlayer('${player_to_substitute.id}', '${player.id}', ${safeJson})">
                    <div class="w-1/4 flex flex-col items-center justify-center">
                        <p class="text-lg max-sm:text-xs font-bold">${player_to_substitute.rating}</p>
                        <img src=${player_to_substitute.logo} class="max-md:size-auto" alt="">
                    </div>
                    <div class="center w-3/4">
                        <img src=${player_to_substitute.photo} class="w-full" alt="">
                    </div>
                </div>
                <p class="absolute bottom-0 text-[.7rem] max-md:text-[.5rem] h-2/5 px-1 text-center w-full font-bold">${player_to_substitute.name}</p>
            `;
        });

        // Make the player card clickable to cancel the substitung option
        document.getElementById(player.player_position_in_stadium).innerHTML = `
            <img src="../assets/images/stadium/card-normal.webp" class="h-full" alt="">
            <div class="h-3/5 w-full absolute top-0 flex pl-2 cursor-pointer" onclick="cancelSubstitution()">
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

        cancelBtn.onclick = () => {
            cancelSubstitution(goalkepeers, player.id);
        }
    }

    if(player.player_role === "deffenders"){
        if(!deffenders.length){
            toast_error.textContent = "Aucun player possible to substitute with " +player.name+ " in your Team.";
            toast_error.style.right = "1%";
            setTimeout(() => {
                toast_error.style.right = "-100%";
                toast_error.textContent = "";
            }, 2500);
            closeDetailsPopUpPlayer();
            return;
        }
        cancelBtn.classList.toggle("hidden");
        deffenders.map((player_to_substitute) => {
            document.getElementById(player_to_substitute.player_position_in_stadium).classList.add("gold-shadow");
            const safeJson = JSON.stringify(deffenders).replace(/'/g, "\\'").replace(/"/g, '&quot;');

            // change the function in card player while substituting
            document.getElementById(player_to_substitute.player_position_in_stadium).innerHTML = `
                <img src="../assets/images/stadium/card-normal.webp" class="h-full" alt="">
                <div class="h-3/5 w-full absolute top-0 flex pl-2 cursor-pointer" onclick="switchPlayer('${player_to_substitute.id}', '${player.id}', ${safeJson})">
                    <div class="w-1/4 flex flex-col items-center justify-center">
                        <p class="text-lg max-sm:text-xs font-bold">${player_to_substitute.rating}</p>
                        <img src=${player_to_substitute.logo} class="max-md:size-auto" alt="">
                    </div>
                    <div class="center w-3/4">
                        <img src=${player_to_substitute.photo} class="w-full" alt="">
                    </div>
                </div>
                <p class="absolute bottom-0 text-[.7rem] max-md:text-[.5rem] h-2/5 px-1 text-center w-full font-bold">${player_to_substitute.name}</p>
            `;
        });

        // Make the player card clickable to cancel the substitung option
        document.getElementById(player.player_position_in_stadium).innerHTML = `
            <img src="../assets/images/stadium/card-normal.webp" class="h-full" alt="">
            <div class="h-3/5 w-full absolute top-0 flex pl-2 cursor-pointer" onclick="cancelSubstitution()">
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

        cancelBtn.onclick = () => {
            cancelSubstitution(deffenders, player.id);
        }
    }

    if(player.player_role === "midfielders"){
        if(!midfielders.length){
            toast_error.textContent = "Aucun player possible to substitute with " +player.name+ " in your Team.";
            toast_error.style.right = "1%";
            setTimeout(() => {
                toast_error.style.right = "-100%";
                toast_error.textContent = "";
            }, 2500);
            closeDetailsPopUpPlayer();
            return;
        }
        cancelBtn.classList.toggle("hidden");
        midfielders.map((player_to_substitute) => {
            document.getElementById(player_to_substitute.player_position_in_stadium).classList.add("gold-shadow");
            const safeJson = JSON.stringify(midfielders).replace(/'/g, "\\'").replace(/"/g, '&quot;');

            // change the function in card player while substituting
            document.getElementById(player_to_substitute.player_position_in_stadium).innerHTML = `
                <img src="../assets/images/stadium/card-normal.webp" class="h-full" alt="">
                <div class="h-3/5 w-full absolute top-0 flex pl-2 cursor-pointer" onclick="switchPlayer('${player_to_substitute.id}', '${player.id}', ${safeJson})">
                    <div class="w-1/4 flex flex-col items-center justify-center">
                        <p class="text-lg max-sm:text-xs font-bold">${player_to_substitute.rating}</p>
                        <img src=${player_to_substitute.logo} class="max-md:size-auto" alt="">
                    </div>
                    <div class="center w-3/4">
                        <img src=${player_to_substitute.photo} class="w-full" alt="">
                    </div>
                </div>
                <p class="absolute bottom-0 text-[.7rem] max-md:text-[.5rem] h-2/5 px-1 text-center w-full font-bold">${player_to_substitute.name}</p>
            `;
        });

        // Make the player card clickable to cancel the substitung option
        document.getElementById(player.player_position_in_stadium).innerHTML = `
            <img src="../assets/images/stadium/card-normal.webp" class="h-full" alt="">
            <div class="h-3/5 w-full absolute top-0 flex pl-2 cursor-pointer" onclick="cancelSubstitution()">
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

        cancelBtn.onclick = () => {
            cancelSubstitution(midfielders, player.id);
        }
    }

    if(player.player_role === "attackers"){
        if(!attackers.length){
            toast_error.textContent = "Aucun player possible to substitute with " +player.name+ " in your Team.";
            toast_error.style.right = "1%";
            setTimeout(() => {
                toast_error.style.right = "-100%";
                toast_error.textContent = "";
            }, 2500);
            closeDetailsPopUpPlayer();
            return;
        }
        cancelBtn.classList.toggle("hidden");
        attackers.map((player_to_substitute) => {
            document.getElementById(player_to_substitute.player_position_in_stadium).classList.add("gold-shadow");
            const safeJson = JSON.stringify(attackers).replace(/'/g, "\\'").replace(/"/g, '&quot;');

            // change the function in card player while substituting
            document.getElementById(player_to_substitute.player_position_in_stadium).innerHTML = `
                <img src="../assets/images/stadium/card-normal.webp" class="h-full" alt="">
                <div class="h-3/5 w-full absolute top-0 flex pl-2 cursor-pointer" onclick="switchPlayer('${player_to_substitute.id}', '${player.id}', ${safeJson})">
                    <div class="w-1/4 flex flex-col items-center justify-center">
                        <p class="text-lg max-sm:text-xs font-bold">${player_to_substitute.rating}</p>
                        <img src=${player_to_substitute.logo} class="max-md:size-auto" alt="">
                    </div>
                    <div class="center w-3/4">
                        <img src=${player_to_substitute.photo} class="w-full" alt="">
                    </div>
                </div>
                <p class="absolute bottom-0 text-[.7rem] max-md:text-[.5rem] h-2/5 px-1 text-center w-full font-bold">${player_to_substitute.name}</p>
            `;
        });

        // Make the player card clickable to cancel the substitung option
        document.getElementById(player.player_position_in_stadium).innerHTML = `
            <img src="../assets/images/stadium/card-normal.webp" class="h-full" alt="">
            <div class="h-3/5 w-full absolute top-0 flex pl-2 cursor-pointer" onclick="cancelSubstitution()">
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

        cancelBtn.onclick = () => {
            cancelSubstitution(attackers, player.id);
        }
    }
    
    closeDetailsPopUpPlayer();
}

window.switchPlayer = (player_in_id, player_out_id, players_array) => {
    const player_in = players[player_in_id - 1];
    const player_out = players[player_out_id - 1];

    // switch information between players in and out
    document.getElementById(player_out.player_position_in_stadium).innerHTML = `
        <img src="../assets/images/stadium/card-normal.webp" class="h-full" alt="">
        <div class="h-3/5 w-full absolute top-0 flex pl-2 cursor-pointer" onclick="showPlayerDetails('${player_in.id}')">
            <div class="w-1/4 flex flex-col items-center justify-center">
                <p class="text-lg max-sm:text-xs font-bold">${player_in.rating}</p>
                <img src=${player_in.logo} class="max-md:size-auto" alt="">
            </div>
            <div class="center w-3/4">
                <img src=${player_in.photo} class="w-full" alt="">
            </div>
        </div>
        <p class="absolute bottom-0 text-[.7rem] max-md:text-[.5rem] h-2/5 px-1 text-center w-full font-bold">${player_in.name}</p>
    `;
    document.getElementById(player_in.player_position_in_stadium).innerHTML = `
        <img src="../assets/images/stadium/card-normal.webp" class="h-full" alt="">
        <div class="h-3/5 w-full absolute top-0 flex pl-2 cursor-pointer" onclick="showPlayerDetails('${player_out.id}')">
            <div class="w-1/4 flex flex-col items-center justify-center">
                <p class="text-lg max-sm:text-xs font-bold">${player_out.rating}</p>
                <img src=${player_out.logo} class="max-md:size-auto" alt="">
            </div>
            <div class="center w-3/4">
                <img src=${player_out.photo} class="w-full" alt="">
            </div>
        </div>
        <p class="absolute bottom-0 text-[.7rem] max-md:text-[.5rem] h-2/5 px-1 text-center w-full font-bold">${player_out.name}</p>
    `;

    players_array.map((player) => {
        document.getElementById(player.player_position_in_stadium).classList.remove("gold-shadow");
        if(player.id != player_out.id && player.id != player_in.id){
            document.getElementById(player.player_position_in_stadium).innerHTML = `
                <img src="../assets/images/stadium/card-normal.webp" class="h-full" alt="">
                <div class="h-3/5 w-full absolute top-0 flex pl-2 cursor-pointer" onclick="showPlayerDetails('${player.id}')">
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
        }
    });

    switchDomValues(player_in.id, player_out.id);
    cancelBtn.classList.add("hidden");
}

// function to cancel substitution
window.cancelSubstitution = (array_of_filtred_players, player_id) => {
    const player = players[player_id - 1];

    cancelBtn.classList.add("hidden");
    array_of_filtred_players.map((player) => {
        document.getElementById(player.player_position_in_stadium).classList.remove("gold-shadow");
        document.getElementById(player.player_position_in_stadium).innerHTML = `
            <img src="../assets/images/stadium/card-normal.webp" class="h-full" alt="">
            <div class="h-3/5 w-full absolute top-0 flex pl-2 cursor-pointer" onclick="showPlayerDetails('${player.id}')">
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
    });
    document.getElementById(player.player_position_in_stadium).innerHTML = `
        <img src="../assets/images/stadium/card-normal.webp" class="h-full" alt="">
        <div class="h-3/5 w-full absolute top-0 flex pl-2 cursor-pointer" onclick="showPlayerDetails('${player.id}')">
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
}

const switchDomValues = (player_in_id, player_out_id) => {
    const player_out = players[player_out_id - 1];
    const player_in = players[player_in_id - 1];
    const tmp_player = {};

    tmp_player.add_icons_id = player_in.add_icons_id;
    tmp_player.bench_or_starter = player_in.bench_or_starter;
    tmp_player.current_position = player_in.current_position;
    tmp_player.player_position_in_stadium = player_in.player_position_in_stadium;
    tmp_player.player_role = player_in.player_role;

    player_in.add_icons_id = player_out.add_icons_id;
    player_in.bench_or_starter = player_out.bench_or_starter;
    player_in.current_position = player_out.current_position;
    player_in.player_position_in_stadium = player_out.player_position_in_stadium;
    player_in.player_role = player_out.player_role;

    player_out.add_icons_id = tmp_player.add_icons_id;
    player_out.bench_or_starter = tmp_player.bench_or_starter;
    player_out.current_position = tmp_player.current_position;
    player_out.player_position_in_stadium = tmp_player.player_position_in_stadium;
    player_out.player_role = tmp_player.player_role;
}

const add_player_icon = document.getElementById("add-player-icon");
// handle showing the pop-up form after clicking the add new player icon
add_player_icon.onclick = () => {
    document.getElementById("add-player-form").classList.remove("hidden");
    document.getElementById("add-player-form").classList.add("absolute");
    document.getElementById("add-player-form").classList.add("center");
    body.classList.add("my-body-noscroll-class");
    background.classList.add("blur");
}

// handle closing form pop-up by clicking outside of it
document.addEventListener("click", (e) => {
    if(e.target.id == "add-player-form"){
        document.getElementById("add-player-form").classList.add("hidden");
        document.getElementById("add-player-form").classList.remove("absolute");
        document.getElementById("add-player-form").classList.remove("center");

        closeDetailsPopUpPlayer();
    }
});

// handle close the form pop-up
window.hideFormPopUp = () => {
    document.getElementById("add-player-form").classList.add("hidden");
    document.getElementById("add-player-form").classList.remove("absolute");
    document.getElementById("add-player-form").classList.remove("center");

    closeDetailsPopUpPlayer();
}

// handle update stats values if user select a goalkepeer
window.handleUpdateStatsValues = () => {
    const position = document.getElementById("positions").value;
    const goalkepeerStats = ["DIV", "HAN", "KIC", "REF", "SPE", "POS"];
    const normalPlayersStats = ["PAC", "SHO", "PAS", "DRI", "DEF", "PHY"];

    const stats_Dom_values = document.getElementById("stats").children;
    if(position === "gk")
        Array.from(stats_Dom_values).map((item, index) => item.children[0].textContent = goalkepeerStats[index]);
    else 
        Array.from(stats_Dom_values).map((item, index) => item.children[0].textContent = normalPlayersStats[index]);

}

// function to handle creating new player
window.handleCreateNewPlayer = () => {
    // get all inputs values from the form
    const name = document.getElementById("name");
    const position = document.getElementById("positions");
    const club = document.getElementById("clubs");
    const country = document.getElementById("countries");

    const stats = affectStrengthStats(position.value.toUpperCase());
    
    const player = {
        id: players.length + 1,
        name: name.value,
        photo: "../assets/images/icons/user-white.svg",
        large_pic: "../assets/images/icons/user-white.svg",
        position: position.value.toUpperCase(),
        nationality: country.value,
        club: club.value,
        rating: 99,
        salacted: false,
        stats: stats,
    };

    affectCountryFlag(country.value, player);
    affectClubLogo(club.value, player);

    const isDataValid = validateData(player);
    if(isDataValid != 1){
        toast_error.textContent = isDataValid;
        toast_error.style.right = "1%";
        setTimeout(() => {
            toast_error.style.right = "-100%";
        }, 2500);
    }
    else {
        toast_succes.textContent = "Player added succesfully.";
        toast_succes.style.right = "1%";
        setTimeout(() => {
            toast_succes.style.right = "-100%";
        }, 2500);

        // push the new player to players list then show the new players updated
        players.push(player);
        
        const playersList = document.getElementById("players-list");
        playersList.innerHTML = "";
        players.map((player) => {
            playersList.innerHTML += `
                <div onclick="showPlayerDetails('${player.id}')" class="h-12 max-md:h-10 w-full p-1 hover:bg-darkGray transition-all delay-150 ease-in-out cursor-pointer flex gap-4 items-center">
                    <img class="h-full" src=${player.photo} alt="${player.name}">
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

        hideFormPopUp();
        name.value = ""; country.value = ""; position.value = ""; club.value = "";

        const stats_Dom_values = document.getElementById("stats").children;
        const array_of_stats = Array.from(stats_Dom_values);
        for(let i=0; i<6; i++){
            array_of_stats[i].children[1].value = "";
        }
    }

}

function validateData(player) {
    const nameRegex = /^[^:;?!@&#$<>&'"-_=+²1234567890%*µ]+$/; // regex for special character
    const emptyRegex = /^\s*$/; // regex for empty values

    if (emptyRegex.test(player.name)) return "Please fill the name field.";
    if (!nameRegex.test(player.name.toLowerCase())) return "Please do not use a special characters or numbers.";
    if (emptyRegex.test(player.position)) return "Please select the player position.";
    if (emptyRegex.test(player.club)) return "Please select a club.";
    if (emptyRegex.test(player.nationality)) return "Please select a country.";

    const stats_Dom_values = document.getElementById("stats").children;

    const array_of_stats = Array.from(stats_Dom_values);
    for(let i=0; i<6; i++){
        if(array_of_stats[i].children[1].value == "")
            return "Please fill the "+ array_of_stats[i].children[0].textContent.toLocaleLowerCase() +" strentgh field.";
        if(array_of_stats[i].children[1].value > 100 || array_of_stats[i].children[1].value < 0)
            return "Strength value in "+ array_of_stats[i].children[0].textContent.toLocaleLowerCase() +" must be between 0 and 100."
    }

    return 1;
}

function affectStrengthStats(position) {
    const stats_Dom_values = document.getElementById("stats").children;
    const array_of_stats = Array.from(stats_Dom_values);
    
    let stats = {};
    // handle if the player position different of goalkepeer
    if(position === "GK" || position === "gk"){
        stats = {
            diving: array_of_stats[0].children[1].value,
            handling: array_of_stats[1].children[1].value,
            kicking: array_of_stats[2].children[1].value,
            reflexes: array_of_stats[3].children[1].value,
            speed: array_of_stats[4].children[1].value,
            positioning: array_of_stats[5].children[1].value
        }
    }
    else {
        stats = {
            pace: array_of_stats[0].children[1].value,
            shooting: array_of_stats[1].children[1].value,
            passing: array_of_stats[2].children[1].value,
            dribbling: array_of_stats[3].children[1].value,
            defending: array_of_stats[4].children[1].value,
            physical: array_of_stats[5].children[1].value
        }
    }

    return stats;
}
function affectCountryFlag(country, player) {
    countries.map((element) => {
        if(country == element.country){
            player.flag = element.flag;
            return;
        }
    })
}
function affectClubLogo(club, player) {
    clubs.map((element) => {
        if(club == element.club){
            player.logo = element.logo;
            return;
        }
    })
}