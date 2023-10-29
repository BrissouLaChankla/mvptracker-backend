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
        const browser = await puppeteer.launch();
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
        if (await page.$('.css-1ki6o6m') !== null) {
            await page.click('.css-1ki6o6m');
            await delay(6000);
        }
       

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
                        const name = nameElement.textContent;
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




        results.forEach(game => {

            fetch('https://mvptracker-backend.vercel.app/storeGames', {
                method: 'POST',
                // headers: {
                //     "Content-Type": "application/json",
                // },
                body: JSON.stringify(game),
            }).then((response) => response.json())
                .then((data) => {
                    console.log(data);
                });

        });
        res.status(200).end('Tout s\'est bien passé');
        // return res.json({result:true, message:"Tout s'est bien passé"})

    })();


};

