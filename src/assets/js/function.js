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
        <div class="flex w-[500px] h-[400px] max-md:h-auto rounded-md overflow-hidden max-md:flex-col" id="player-details">
            <div class="max-md:w-full w-2/3 relative">
                <img src=${player.large_pic} class="h-full max-md:h-[350px] w-full object-cover" alt="">
                <span class="absolute top-0 p-8 text-6xl drop-shadow-[5px_5px_20px_rgba(255,255,255,0.99)] text-goldColor">${player.rating}</span>
                <div class="absolute p-4 w-full bottom-0 min-h-24 bg-gradient-to-b from-transparent flex flex-col to-black">
                    <span class="text-white text-2xl font-gaMaamli shadow-5xl">${player.name}</span>
                    <div class="flex justify-between items-center h-full">
                        <span class="text-xl text-goldColor">${player.position}</span>
                        <div class="flex gap-2 h-full">
                            <img src=${player.club} class="h-10" alt="">
                            <img src=${player.logo} class="h-10" alt="">
                        </div>
                    </div>
                </div>
            </div>
            <div class="bg-darkGray w-1/3 h-full max-md:w-full flex flex-col p-4 gap-2 max-md:gap-6 justify-between">
                <div class="flex flex-col gap-2" id="stats-details">    </div>
                <div class="h-10 max-md:mt-12 items-center flex justify-end gap-2">
                    <span class="cursor-pointer"></span>
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

const goalkepeers = players.filter((gk) => gk.position === "GK")
const centralMidfielders = players.filter((cm) => cm.position === "CM")
const deffencers = players.filter((cb) => cb.position === "CB" || cb.position === "RB" || cb.position === "LB")
const attackers = players.filter((ac) => ac.position === "RW" || ac.position === "LW" || ac.position === "ST")

const starters = []; // array where the 11 players will be stored
const bench = []; // array where changment will be stored
