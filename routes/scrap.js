const fetch = require('node-fetch');
const puppeteer = require('puppeteer');


export default function handler(req, res) {

    function delay(time) {
        return new Promise(function (resolve) {
            setTimeout(resolve, time)
        });
    }
    
    
    
    let gamesFound = 0;
    let results = [];
    
    
    (async () => {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
    
        // Bepo
        // Vivi
        // Brice
        // Guibi
        // Schboun
    
    
        const pseudos = [
            "Skander Gυissi",
            "Skander Guιssi",
            "Skαnder Guissi",
            "Skander Guissi",
            "Skander Guìssi",
        ]
    
    
        await page.goto('https://www.op.gg/summoners/euw/Sk%CE%B1nder%20Guissi');
    
        // ferme la modal cookie
        // await page.click('.css-1ey59fx');
    
    
        // rafraichis les datas 
        await page.click('.css-1ki6o6m');
        await delay(7000);
    
        const flexGames = await page.$$('.game-item--FLEXRANKED');
        let maxGamesToLook = 10;
    
        for (const [i, flexGame] of flexGames.entries()) {
            if (i >= maxGamesToLook) { break; }
    
            let nbOfSkandersInGame = 0;
    
            // Utilisez `element.$` pour sélectionner les éléments avec la classe ".name" à l'intérieur de chaque élément de la liste.
            const playersNames = await flexGame.$$('.name');
    
            for (const playerName of playersNames) {
                // Récupérez le texte à l'intérieur de chaque élément ".name".
                const name = await playerName.evaluate(playerName => playerName.textContent);
    
                if (pseudos.includes(name)) {
                    nbOfSkandersInGame++;
                }
            }
            if (nbOfSkandersInGame === 5) {
                const detailBtn = await flexGame.$('.detail');
                await detailBtn.click();
    
    
                const infoPlayer = await flexGame.evaluate((el) => {
                    const nameElements = Array.from(el.querySelectorAll('table .name a'));
    
                    const players = nameElements.map((nameElement) => {
                        const trElement = nameElement.closest('tr');
                        const scoreElement = trElement.querySelector('.score');
                        let name = nameElement.textContent;
                        const score = scoreElement ? scoreElement.textContent : 'Score non trouvé';
                       
                        return { name, score };
                    });
                    return players;
                });
    
                results.push({
                    id: "id",
                    date: "date",
                    op_link: "oplink",
                    values: infoPlayer.filter(el => pseudos.includes(el.name))
                });
    
    
                console.log('... game found');
                gamesFound++;
            }
        }
    
        console.log(`Sur les 10 dernières flex, ${gamesFound} sont des flex en Team`)
    
        const gameLinks = await page.evaluate(() => {
            const links = Array.from(document.querySelectorAll('.copy-link'));
            return links.map(link => link.value);
        });
    
    
        gameLinks.forEach((link, i) => {
            results[i].op_link = link;
            results[i].date = new Date();
        });
    
    
    
    
        results.forEach((game,i) => {
    
            for(const value of game.values){
                if (value.name == "Skander Gυissi") {
                    value.name = "Bepo"
                } else if (value.name == "Skander Guιssi") {
                    value.name = "Vivi"
                } else if (value.name == "Skαnder Guissi") {
                    value.name = "Brice"
                } else if (value.name == "Skander Guissi") {
                    value.name = "Guibi"
                } else if (value.name == "Skander Guìssi") {
                    value.name = "Schboun"
                } else {
                    value.name = "Non identifié"
                }
            }
          
            fetch('https://mvptracker-backend.vercel.app/storeGames', {
                method: 'POST',
                // headers: {
                //     "Content-Type": "application/json",
                //   },
                body: JSON.stringify(game),
            }).then((response) => response.json())
                .then((data) => {
                    console.log(data);
                });
    
        });
    
    
    
    })();
    


};

