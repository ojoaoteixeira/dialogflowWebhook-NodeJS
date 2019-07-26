// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
// 'use strict';

// const functions = require('firebase-functions');
// const {WebhookClient} = require('dialogflow-fulfillment');
// const {dialogflow} = require('actions-on-google');
//
// const app = dialogflow();
//
// const WELCOME_INTENT = "Default Welcome Intent"
// const FALLBACK_INTENT = "Default Fallback Intent"
// const HUMAN_ALIEN_INTENT = "HumanOrAlien"
// const TYPE_BEING_ENTITY = "TypeOfBeing"
//
// process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
//
// app.intent(WELCOME_INTENT, (conv) => {
//     conv.ask('Welcome to the Saint Tropez');
// });
//
// app.intent(FALLBACK_INTENT, (conv) => {
//     conv.ask('Welcome to the Saint Tropez');
// });
//
// app.intent(HUMAN_ALIEN_INTENT, (conv) => {
//     const type_being = conv.parameters[TYPE_BEING_ENTITY].toLowerCase();
//     switch (type_being) {
//         case 'human':
//             conv.ask('Take your car and go your home')
//             break;
//         case 'alien':
//             conv.ask('Take your spaceship and go your home')
//             break;
//         default:
//             conv.ask('Who are you ?')
//             break;
//     }
// });
//
// exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app)

// MAP
// MAP
// MAP
// MAP
// --> https://app.mindmup.com/map/_free/2019/07/c13439f0afa911e9bd8721f7ba8a01fe


const express = require('express')
const { WebhookClient } = require('dialogflow-fulfillment')
const app = express()
const responses = require('./responses.js')
const relances = require('./relances.js')
const helpers = require('./helpers.js')

let currentUser = {}

app.get('/', (req, res) => res.send('online'))

app.post('/dialogflow', express.json(), (req, res) => {
    const agent = new WebhookClient({ request: req, response: res });

    // Lot de fonctions
    // 1 fonction = 1 intent


    // Welcome - - - - - - - - - -
    function welcome () {
        agent.add(responses.welcome)
        agent.add(relances.welcome)
    }
    // - - - - - - - - - - - - - -

    // Fallback - - - - - - - - - -
    function fallback () {
        agent.add(responses.fallback)
    }
    // x x x x x x x x x x x x x x


    function humanOrAlien () {
        currentUser.type = agent.parameters.userKind
        let updatedResponse = helpers.replace(responses.humanOrAlien, 'type', currentUser.type)

        agent.addResponse_(updatedResponse)

        if (currentUser.type === 'human') {
            agent.addResponse_(relances.humanOrAlien.human)
        } else if (currentUser.type === 'alien') {
            agent.addResponse_(relances.humanOrAlien.alien)
        }
    }
    // x x x x x x x x x x x x x x

    function mariedYesNo () {

        currentUser.maried = agent.parameters.yesNoMaybe

        if (currentUser.maried === 'yes') {
            agent.addResponse_(responses.mariedYesNo.yes)
        } else if (currentUser.maried === 'no') {
            agent.addResponse_(responses.mariedYesNo.no)
        }

        agent.addResponse_(relances.mariedYesNo)

    }
    // x x x x x x x x x x x x x x

    function parisienYesNo () {
        currentUser.parisien = agent.parameters.yesNoMaybe

        if (currentUser.parisien === 'yes') {
            agent.addResponse_(responses.parisienYesNo.yes)
        } else if (currentUser.parisien === 'no') {
            agent.addResponse_(responses.parisienYesNo.no)
        }

        agent.addResponse_(relances.parisienYesNo)
    }
    // x x x x x x x x x x x x x x

    function colors () {
        currentUser.color = agent.parameters.color
        agent.add(responses.colors);
        agent.add(relances.colors);
    }
    // x x x x x x x x x x x x x x
    
    function coffeeYesNo () {
        currentUser.color = agent.parameters.color
        agent.add(responses.colors);
        agent.add(relances.colors);
    }
    // x x x x x x x x x x x x x x

    function superpowerYesNo () {

        currentUser.superpowerYesNo = agent.parameters.yesNoMaybe

        if (currentUser.superpowerYesNo === 'yes') {
            agent.addResponse_(responses.superpowerYesNo.yes)
            agent.addResponse_(relances.superpowerYesNo.yes)

        } else if (currentUser.superpowerYesNo === 'no') {
            agent.addResponse_(responses.superpowerYesNo.no)
            agent.addResponse_(relances.superpowerYesNo.no)
        }
    }
    // x x x x x x x x x x x x x x

    function superpowerWhich () {
        currentUser.superpowerWhich = agent.parameters.power
        agent.add(responses.superpowerWhich);
        agent.add(relances.superpowerWhich);
    }
    // x x x x x x x x x x x x x x

    function hostileYesNo () {
        currentUser.hostileYesNo = agent.parameters.yesNoMaybe

        if (currentUser.hostileYesNo === 'yes') {
            agent.addResponse_(responses.hostileYesNo.yes)
            agent.addResponse_(relances.hostileYesNo.yes)

        } else if (currentUser.hostileYesNo === 'no') {
            agent.addResponse_(responses.hostileYesNo.no)
            agent.addResponse_(relances.hostileYesNo.no)
        }
    }
    // x x x x x x x x x x x x x x

    function hostileWhy () {
        // currentUser.hostileWhy = agent.parameters.power
        agent.add(responses.hostileWhy);
        agent.add(relances.hostileWhy);
    }
    // x x x x x x x x x x x x x x

    function planet () {
        // currentUser.hostileWhy = agent.parameters.power
        agent.add(responses.planet);
        agent.add(relances.planet);
    }
    // x x x x x x x x x x x x x x





    // Mapping Intents
    let intentMap = new Map()
    intentMap.set('Default Welcome Intent', welcome)
    intentMap.set('Default Fallback Intent', fallback)

    intentMap.set('humanOrAlien', humanOrAlien)

    intentMap.set('mariedYesNo', mariedYesNo)

    intentMap.set('parisienYesNo', parisienYesNo)
    
    intentMap.set('superpowerYesNo', superpowerYesNo)
    intentMap.set('superpowerWhich', superpowerWhich)

    intentMap.set('hostileYesNo', hostileYesNo)
    intentMap.set('hostileWhy', hostileWhy)
    
    intentMap.set('planet', planet)
    
    intentMap.set('colors', colors)
    intentMap.set('coffeeYesNo', coffeeYesNo)


    agent.handleRequest(intentMap)

    // debug logs
    console.log('query envoyé : ', agent.query);
    console.log('intent détécté : ', agent.intent);
    console.log('parametres reçus : ', agent.parameters);
    console.log('context reçus : ', agent.contexts);

    console.log('le log currentUser : ', currentUser);


})

app.listen(process.env.PORT || 8080)




// exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
//     const agent = new WebhookClient({ request, response });
//     console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
//     console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
//
//     function welcome(agent) {
//         agent.add(`Welcome to my agent!`);
//     }
//
//     function fallback(agent) {
//         agent.add(`I didn't understand`);
//         agent.add(`I'm sorry, can you try again?`);
//     }

    // // Uncomment and edit to make your own intent handler
    // // uncomment `intentMap.set('your intent name here', yourFunctionHandler);`
    // // below to get this function to be run when a Dialogflow intent is matched
    // function yourFunctionHandler(agent) {
    //   agent.add(`This message is from Dialogflow's Cloud Functions for Firebase editor!`);
    //   agent.add(new Card({
    //       title: `Title: this is a card title`,
    //       imageUrl: 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
    //       text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
    //       buttonText: 'This is a button',
    //       buttonUrl: 'https://assistant.google.com/'
    //     })
    //   );
    //   agent.add(new Suggestion(`Quick Reply`));
    //   agent.add(new Suggestion(`Suggestion`));
    //   agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
    // }

    // // Uncomment and edit to make your own Google Assistant intent handler
    // // uncomment `intentMap.set('your intent name here', googleAssistantHandler);`
    // // below to get this function to be run when a Dialogflow intent is matched
    // function googleAssistantHandler(agent) {
    //   let conv = agent.conv(); // Get Actions on Google library conv instance
    //   conv.ask('Hello from the Actions on Google client library!') // Use Actions on Google library
    //   agent.add(conv); // Add Actions on Google library responses to your agent's response
    // }
    // // See https://github.com/dialogflow/dialogflow-fulfillment-nodejs/tree/master/samples/actions-on-google
    // // for a complete Dialogflow fulfillment library Actions on Google client library v2 integration sample

    // Run the proper function handler based on the matched Dialogflow intent name
//     let intentMap = new Map();
//     intentMap.set('Default Welcome Intent', welcome);
//     intentMap.set('Default Fallback Intent', fallback);
//     // intentMap.set('your intent name here', yourFunctionHandler);
//     // intentMap.set('your intent name here', googleAssistantHandler);
//     agent.handleRequest(intentMap);
// });
