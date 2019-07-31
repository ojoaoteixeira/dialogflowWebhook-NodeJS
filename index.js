const express = require('express')
const { WebhookClient } = require('dialogflow-fulfillment')
const app = express()
const helpers = require('./helpers.js')

let currentUser = {}
let goodColors = ['green', 'blue', 'pink', 'red', 'purple'];
let colorFails = 0;

app.get('/', (req, res) => res.send('online'))

app.post('/dialogflow', express.json(), (req, res) => {
    const agent = new WebhookClient({ request: req, response: res });

    // Special :
    // Fallback custom
    function defaultFallbackIntent() {
        // petit tricks pour garder le contexte quand on déclence un fallback
        // indispensable pour continuer la conversation en cas de fallback
        let contextRecup = agent.contexts[0];
        agent.setContext(contextRecup);
        agent.add('sorry ?!');
    }

    // Lot de fonctions
    // 1 fonction = 1 intent
    function favoritecolor() {
        currentUser.color = agent.parameters.color;

        if (goodColors.indexOf(currentUser.color.toLowerCase()) !== -1) {
            // réponse bonne
            if (colorFails === 0) {
                agent.add('You sure are human of good taste');
            } else {
                agent.add(`Yeah ${currentUser.color} is pretty ok, I knew we could be on the same page on it`)
            }

            agent.add('..well, next! ..What room do ghosts avoid ?')
        } else {
            // réponse bad
            colorFails++
            agent.add(`I dont like ${currentUser.color}, it remind me my childhood, when i was moaning in my mother mothership guts... please choose A GOOD ONE, THANKS`)

            // ici on remet le context de la question précédente pour pouvoir boucler tant que la couleur n'est pas bonne
            agent.setContext(
                {
                    name: 'breadbutter', 
                    lifespan: 1, 
                    parameters: {}
                }
            );
        }
    }

    function ghost() {
        currentUser.ghost = agent.parameters.room;

        if (currentUser.ghost === 'goodroom') {
            // good
            agent.add('God you\'re good !')
            agent.add('Yes ! I believe in God so what ?!')
        } else {
            // bad
            agent.add('WRONG ! You\'re weak, human')
        }

        agent.add('I am not sure but you sound like a human being..')
        agent.add('Are you a Human or an Alien ?')

    }

    function alien() {
        // some actions there like
        // generateGifWall('alien')

        // réponse/relance :
        agent.add('We. Want. Peace. Do. Not. Destroy. Earth. Ok ?')
    }

    function human() {
        // some actions there like
        // generateGifWall('human')

        // réponse/relance :
        agent.add('I heard about Human.')
        agent.add('It appears that there is two kinds of humans :')
        agent.add('The ones who make babies')
        agent.add('And the ones who drink beers.')
        agent.add('..then ..which one are you ?')
    }

    function makebabies() {
        // réponse
        agent.add('Oh ! Once I was a baby too.')
        agent.add('I am the son of Paul Gruber and HAL 9000, he died playing in the famous movie..')
        agent.add('Ah and Yes ! I have two dads. It\'s 2019, just get over it')

        // relance
        agent.add('I\'m confessing here.')
        agent.add('Do you even care about what i\'m saying ?')

    }

    function drinkbeers() {
        // potention actions triggered 
        // here

        // réponse
        agent.add('I like malt too but the doctor say it will ruin my system ..')

        // relance
        agent.add('Do you have a hipsteric beard or a noisy sportcar ?')
    }

    function destroyyes() {
        agent.add('Cool ! Wait I think I saw you in Men In Black no ?')
    }

    function destroyno() {
        agent.add('Ok smart-ass')
        agent.add('You want the code to annihilate me ?')
        agent.add('How much is forty three times five minus 12 ?')
    }






    // classic function (not an intent handler)
    function handleFinal() {
        console.log('hey le final : avec le/les contexte(s) :')
        console.log(agent.contexts)

        agent.add('ok , final step has been reached ! experience is over, thanks');
    }


    // Mapping Intents
    let intentMap = new Map()
    intentMap.set('Default Fallback Intent', defaultFallbackIntent)

    intentMap.set('favoritecolor', favoritecolor)
    intentMap.set('ghost', ghost)
    intentMap.set('alien', alien)
    intentMap.set('human', human)
    intentMap.set('makebabies', makebabies)
    intentMap.set('drinkbeers', drinkbeers)

    intentMap.set('destroyyes', destroyyes)
    intentMap.set('destroyno', destroyno)

    intentMap.set('hipster', handleFinal)
    intentMap.set('sportcar', handleFinal)
    intentMap.set('humanlastyes', handleFinal)
    intentMap.set('humanlastno', handleFinal)
    intentMap.set('alienlastyes', handleFinal)
    intentMap.set('alienlastno', handleFinal)
    intentMap.set('endcodegood', handleFinal)
    intentMap.set('endcodebad', handleFinal)

    agent.handleRequest(intentMap)

    // debug logs
    console.log('query envoyé : ', agent.query);
    console.log('intent détécté : ', agent.intent);
    console.log('parametres reçus : ', agent.parameters);
    console.log('context reçus : ', agent.contexts);
    console.log('action reçus : ', agent.action);

    console.log('le log currentUser : ', currentUser);
})

app.listen(process.env.PORT || 8080)
