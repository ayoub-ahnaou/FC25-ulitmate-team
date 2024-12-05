import data from "../data/players.json" with { type: "json" };
const players = data.players;
const playersList = document.getElementById("players-list");

window.list_players = () => {
    playersList.innerHTML = "";
    players.map((player) => {
        playersList.innerHTML += `
            <div onclick="showPlayerDetails('${player.id}')" class="dark:text-black h-12 max-md:h-10 w-full p-1 hover:bg-darkGray hover:dark:bg-gray-50 transition-all delay-150 ease-in-out cursor-pointer flex gap-4 items-center">
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
    })
}

list_players();