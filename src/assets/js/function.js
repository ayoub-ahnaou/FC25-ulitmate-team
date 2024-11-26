const body = document.querySelector("body");
import data from "../data/players.json" with { type: "json" };
const players = data.players;

const background = document.querySelector(".background");
const playerDetailsContainer = document.getElementById("player-details-container");
window.showPlayerDetails = (player_id) => {
    const player = players[player_id - 1];
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
                <div class="flex flex-col gap-2">
                    <div class="flex justify-between items-center">
                        <span>Pace</span> <span class="p-1 text-black rounded-md bg-veryPoor">19</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span>Shooting</span> <span class="p-1 text-black rounded-md bg-poor">38</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span>Passing</span> <span class="p-1 text-black rounded-md bg-average">50</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span>Dribbling</span> <span class="p-1 text-black rounded-md bg-aboveAverage">62</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span>Defending</span> <span class="p-1 text-black rounded-md bg-good">84</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span>Physical</span> <span class="p-1 text-black rounded-md bg-excellent">94</span>
                    </div>
                </div>
                <div class="h-10 max-md:mt-12 items-center flex justify-end gap-2">
                    <span class="cursor-pointer"></span>
                    <span class="cursor-pointer">More Option</span>
                </div>
            </div>
        </div>
    `;
}
