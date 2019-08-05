// main.js
let turns = 0;
let revealed = [];
let numMatches = 0;
let cards = [];
let card_id = '0'; // a number

let myStorage = window.localStorage;
localStorage.setItem('lastScore' , 0);

function main(){

    const button = document.querySelector(".play-btn"); //class play-btn
    //what to do once Game Start button is clicked
    //ONE CLICK = NEW GAME STARTS
    button.addEventListener('click', function (evt){
        console.log('HELLO', localStorage.getItem('lastScore'));
        //retrieve values of input fields & use to set up the game
        const total_cards = document.getElementById('total-cards').value;
        const max_turns = document.getElementById('max-turns').value;
        const setCards = document.getElementById('card-faces').value.split(','); //arr
        const game = document.querySelector('div.game');
        const form = document.querySelector('div.start');

      //<div class = game> </div>
        const result = document.querySelector('div.result'); //<div class = result> </div>
        const reset = document.querySelector('div.reset'); //<div class = reset> </div>
        const errormsg = document.querySelector('div.error-message');

        if(validate(total_cards, max_turns, setCards) === true){ //valid input
            form.style.display = 'none';
            result.style.display = 'none';
            reset.style.display = 'none';
            errormsg.style.display = 'none';
            game.style.visibility = 'visible';
            game.style.display = 'grid';
            game.innerHTML = "";

            if(document.querySelector('div.losediv') !== null){
                document.querySelector('div.losediv').innerHTML = "";
            }
            addGameBoard(total_cards, max_turns, setCards, game);
            addQuitToDoc(max_turns);
            addTurnsToDoc(max_turns);
        } else { //else, error message displayed, form element still visible though
            console.log('uhoh');
            form.style.visiblity = 'visible';
            result.style.display = 'none';
            reset.style.display = 'none';
            errormsg.style.display = 'inline';
            game.style.display = 'none';
        }
    });
}//end of main function

function addGameBoard(total_cards, max_turns, setCards, gameBoard){

    if(document.querySelector('gamewrap') === null){
        const gamewrap = document.createElement('div');
        gamewrap.setAttribute('class', 'gamewrap');
        gamewrap.appendChild(gameBoard);
    
        //put gamewrap, which contains gameBoard, after div.start
        document.querySelector('div.start').after(gamewrap);
    }

    const prevscore = document.createTextNode('Last score: ' + localStorage.getItem('lastScore'));
    const prevele = document.createElement('h1');
    prevele.setAttribute('class', 'prevscore');
    prevele.appendChild(prevscore);
    document.querySelector('div.gamewrap').after(prevele);  
    
    //gameBoard = <div class = game>  --fill in---  </div>

    //if the card values were specified
    if(setCards.length > 1){
        let count = 0;
        for(let i = 0; i < total_cards; i++){
            //create <div class = card> --fill in using setCards arr-- </div>
            const card = document.createElement('div');
            card.setAttribute('class', 'card');
            //create the content of the card
            const card_content = document.createTextNode(setCards[count]);
            const unflipped = document.createElement('div');
            unflipped.setAttribute('class', 'unflipped');
            unflipped.appendChild(card_content);
            count += 1;
            //add the content to the card, then add the card to the board
            card.appendChild(unflipped);
            //make the card a button
            addButton(card, max_turns, total_cards);
            //add the card to the gameBoard
            gameBoard.appendChild(card);
        }
    } else { //if the card values were not specified, create and shuffle the cards
        const cardobj = {};
        let face = 0;
        let newcount = 0;
        for(let j = 0; j < total_cards; j++){
            cardobj[j] = face;
            newcount += 1;
            if(newcount === 2){
                newcount = 0;
                face += 1;
            }
        }
        //cardobj keys = 0,1,2,3... values = 0,0,1,1,2,2...
        //shuffle
        while(isEmpty(cardobj) === false){
            //create <div class = card> --fill in using setCards arr-- </div>
            const card = document.createElement('div');
            card.setAttribute('class', 'card');
            //create the content of the card
            let random_num = Math.floor(Math.random() * total_cards);
            //if the random_num has already been removed from the cardobj
            while(cardobj.hasOwnProperty(random_num) === false){
                random_num = Math.floor(Math.random() * total_cards);
            }
            const card_content = document.createTextNode(cardobj[random_num]);
            delete cardobj[random_num];
            const unflipped = document.createElement('div');
            unflipped.setAttribute('class', 'unflipped');
            unflipped.appendChild(card_content);
            //add the content to the card, then add the card to the board
            card.appendChild(unflipped);
            //make the card a button
            addButton(card, max_turns, total_cards);
            //add the card to the gameBoard
            gameBoard.appendChild(card);
        }
        function isEmpty(obj){
            for(const prop in obj){
                if(obj.hasOwnProperty(prop)){
                    return false;
                }
            }
            return true;
        }
        
    }
    
}//end of function addGameBoard

function addButton(card, max_turns, total_cards){
    //create a button for each card
    //<div class = card> <div class = unflipped> 0 </div> <button  class = cardbutton> </button> </div>
    const cardbutton = document.createElement('button');
    cardbutton.setAttribute('class', 'cardbutton');
    card.querySelector('div.unflipped').setAttribute('id', card_id);
    card_id += '0';
    //add button to the card
    card.appendChild(cardbutton);

    //FOR EACH TIME A CARD IS PRESSED!!
    //must update turns each time you press the button
    //must remove button each time you press the button (no double press)
    //must reveal card value each time you press the button
    cardbutton.addEventListener('click',function(evt){
        //console.log(cardbutton.parentNode.querySelector('div.unflipped').innerHTML);

        console.log('NUMMATCHES ', numMatches);
        console.log('TOTAL_CARDS/2 ', total_cards/2);

        //IF card is FLIPPED and being pressed, do NOTHING... no double flipping/clicking
        if(card.querySelector('div.unflipped') === null){
            console.log('tried to click a button that has already been flipped: error');
        } 
        else { 
            cards.push(card.querySelector('div.unflipped').getAttribute('id', card_id));
            const cardValue = cardbutton.parentNode.querySelector('div.unflipped').innerHTML;
            revealed.push(cardValue);

            //make the face visible
            card.querySelector('div.unflipped').setAttribute('class', 'flipped');

            turns += 0.5;

            if(Number.isInteger(turns)){ //turn was made
                // console.log(document.querySelector('div.t').innerHTML)
                const str = turns + '/' + max_turns;
                document.querySelector('div.t').innerHTML = str;
                if(revealed[0] === revealed[1]){
                    //show result = Match
                    document.querySelector('div.result').style.display = 'inline';
                    document.querySelector('div.result').innerHTML = 'You made a match';
                    console.log('match!');
                    numMatches += 1;
                    console.log('MATCHES = ', numMatches);
                    match(card, cardbutton);
                }else{
                    //show result = No Match
                    document.querySelector('div.result').style.display = 'inline';
                    document.querySelector('div.result').innerHTML = 'You did not make a match. Try again';
                    console.log('not a match');
                    noMatch(card, cardbutton);
                }
                //reset revealed array
                revealed = [];
            }

            if(numMatches == ((total_cards/2))){ //game was won
                console.log('matches done');

                
                //delete the current game
                //reset button should be visible now
                document.querySelector('div.reset').style.display = 'initial';

                document.querySelector('div.quitdiv').style.display = 'none';

                //clear the game board
                document.querySelector('div.game').innerHTML = "";

                //make the lose message
                const losediv = document.createElement('div');
                losediv.setAttribute('class', 'losediv');
                const lose = document.createTextNode('You Win');
                losediv.appendChild(lose);
                document.querySelector('div.game').parentNode.appendChild(losediv);
            
                //dont display the result
                document.querySelector('div.result').style.display = 'none';

                //remove the quit button / quitdiv
                document.querySelector('div.game').parentNode.removeChild(document.querySelector('div.quitdiv'));
            
                //ONCE RESET BUTTON is pressed
                document.querySelector('button.reset-btn').addEventListener('click', function(evt){
                    //make form visible again
                    document.querySelector('div.start').style.display = 'initial';

                    //reset game board
                    document.querySelector('div.game').innerHTML = "";
                    
                    //hide the result and reset divs
                    document.querySelector('div.result').style.display = 'none';
                    document.querySelector('div.reset').style.display = 'none';

                    //dont show lose message
                    document.querySelector('div.losediv').innerHTML = '';

                    //delete the turns div
                    //document.querySelector('div.gamewrap').removeChild(document.querySelector('div.turnsdiv'));
                    //document.querySelector('div.turns').innerHTML = "";
                    console.log(document.querySelector('div.turnsdiv'));
                    document.querySelector('div.game').parentNode.removeChild(document.querySelector('div.turnsdiv'));
                    
                    //calculate the new lastscore
                    localStorage.setItem('lastScore' , turns/max_turns);
                    console.log(localStorage.getItem('lastScore'));

                    //reset means delete the old lastscore
                    document.querySelector('div.gamewrap').parentNode.removeChild(document.querySelector('h1.prevscore'));

                    turns = 0;
                    revealed = [];
                    numMatches = 0;
                    cards = [];
                    card_id = '0'; // a number
                });

                
            }//end of if numMatches == totalcards/2 -1
            
            else if(turns == max_turns){ //first make sure that the game is not over; game was lost
                //reset button should be visible now
                document.querySelector('div.reset').style.display = 'initial';

                document.querySelector('div.quitdiv').style.display = 'none';

                //clear the game board
                document.querySelector('div.game').innerHTML = "";

                //make the lose message
                const losediv = document.createElement('div');
                losediv.setAttribute('class', 'losediv');
                const lose = document.createTextNode('You Lose');
                losediv.appendChild(lose);
                document.querySelector('div.game').parentNode.appendChild(losediv);

                //dont display the result
                document.querySelector('div.result').style.display = 'none';

                //remove the quit button / quitdiv
                document.querySelector('div.game').style.display = 'none';
            
                //ONCE RESET BUTTON is pressed
                document.querySelector('button.reset-btn').addEventListener('click', function(evt){
                    //make form visible again
                    document.querySelector('div.start').style.display = 'initial';

                    //reset game board
                    document.querySelector('div.game').innerHTML = "";
                    
                    //hide the result and reset divs
                    document.querySelector('div.result').style.display = 'none';
                    document.querySelector('div.reset').style.display = 'none';
                    //dont show lose message
                    document.querySelector('div.losediv').innerHTML = '';

                    //delete the turns div
                    document.querySelector('div.game').parentNode.removeChild(document.querySelector('div.turnsdiv'));
                    //document.querySelector('div.gamewrap').removeChild(document.querySelector('div.turnsdiv'));
           
                      //calculate the new lastscore
                      localStorage.setItem('lastScore' , -1);
                      console.log(localStorage.getItem('lastScore'));
  
                      //reset means delete the old lastscore
                      document.querySelector('div.gamewrap').parentNode.removeChild(document.querySelector('h1.prevscore'));
  

                    //console.log(document.querySelector('h1.prevscore').parentNode)
                    document.querySelector('h1.prevscore').parentNode.removeChild(document.querySelector('h1.prevscore'));
                    
                    turns = 0;
                    revealed = [];
                    numMatches = 0;
                    cards = [];
                    card_id = '0'; // a number
                });
            }
            
        }//end of else

    });
   
}

function match(card, cardbutton){
    const ok = document.createElement('button');
    const okstr = document.createTextNode('Ok');
    ok.appendChild(okstr);
    ok.setAttribute('class', 'okbutton');
    document.querySelector('div.result').appendChild(ok);
    ok.addEventListener('click', function(evt){
        console.log('ok');
        document.querySelector('div.result').style.display = 'none';

        //remove the card buttons, keep the cards open?
        // let firstbtn = document.getElementById(cards[0]).parentNode.querySelector('button.cardbutton');
        // console.log(firstbtn);

        cards = [];
        
    });
}

function noMatch(card, cardbutton){
    //add an OK button to result
    const ok = document.createElement('button');
    const okstr = document.createTextNode('Ok');
    ok.appendChild(okstr);
    ok.setAttribute('class', 'okbutton');
    document.querySelector('div.result').appendChild(ok);
    ok.addEventListener('click', function(evt){
        console.log('ok');
        document.querySelector('div.result').style.display = 'none';

        //make the card values invisible again
        //CHANGE BACK TO UNFLIPPED
        document.getElementById(cards[0]).setAttribute('class', 'unflipped');
        document.getElementById(cards[1]).setAttribute('class', 'unflipped');

        //reset cards
        cards = [];
    });
    
}

function validate(total_cards, max_turns, setCards){
    //if no setCards is specified, but max_turns and total_cards are specified, it is valic
    if(setCards.length === 1 && setCards[0] === "" && 
    max_turns !== "" && total_cards !== ""){
        return true;
    } else { //else, the setCards is specified and we must check validity
        if(total_cards % 2 != 0 || total_cards <= 2 || total_cards > 36 ||
            setCards.length != total_cards){
            return false;
        }
        //making sure that there are exactly 2 of each card in the setCards arr
        const copy = {};
        for(let i = 0; i < setCards.length; i++){
            if(copy.hasOwnProperty(setCards[i]) === false){
                copy[setCards[i]] = 1;
            }
            else{
                copy[setCards[i]] += 1;
            }
        }
        for(const property in copy){
            if(copy[property] !== 2){
                return false;
            }
        }
        return true;
    }
}


function addQuitToDoc(max_turns){
    //<div class = quitdiv> <button type = "button"> Quit </button> </div>
    const quitdiv = document.createElement('div');
    quitdiv.setAttribute('class', 'quitdiv');
    const quitbutton = document.createElement('button');
    const button_text = document.createTextNode('Quit');
    quitbutton.appendChild(button_text);
    quitdiv.appendChild(quitbutton);
    document.querySelector('div.game').parentNode.appendChild(quitdiv);
    //console.log(document.querySelector('div.game').parentElement); --> <body>...</body>
    quitdiv.style.display = 'initial';
    
    quitbutton.addEventListener('click',function(evt){
        //if quit button is pressed: end the game, remove the Quit button
        //because a new one will be created again once Game Start button is pressed

        //remove the quit button / quitdiv
        document.querySelector('div.game').parentNode.removeChild(document.querySelector('div.quitdiv'));

        //make form visible again
        document.querySelector('div.start').style.display = 'initial';
        //clear the game board
        document.querySelector('div.game').innerHTML = "";
        //gameBoard.parentNode.removeChild(document.querySelector('div.game'));

        //hide the result and reset divs
        document.querySelector('div.result').style.display = 'none';
        document.querySelector('div.reset').style.display = 'none';

        //reset lose message
        //document.querySelector('div.losediv').innerHTML = '';

        //delete the turns div
        document.querySelector('div.game').parentNode.removeChild(document.querySelector('div.turnsdiv'));

        //calculate the new lastscore
        localStorage.setItem('lastScore' , turns/max_turns);
        console.log(localStorage.getItem('lastScore'));
          
        //reset means delete the old lastscore
        document.querySelector('div.gamewrap').parentNode.removeChild(document.querySelector('h1.prevscore'));
        
        document.querySelector('h1.prevscore').parentNode.removeChild(document.querySelector('h1.prevscore'));
                    
        turns = 0;
        revealed = [];
        numMatches = 0;
        cards = [];
        card_id = '0'; // a number

    });
}

function addTurnsToDoc(max_turns){
    //START WITH 0 TURNS
    //<div class = turns> <div class = t> ~turns/max_turns~ </div> </div>
    turns = 0;
    const t = document.createElement('div');
    t.setAttribute('class', 't');
    const turnsdiv = document.createElement('div');
    turnsdiv.setAttribute('class', 'turnsdiv');
    const turns_text = document.createTextNode(turns + '/' + max_turns);
    t.appendChild(turns_text);
    turnsdiv.appendChild(t);
    document.querySelector('div.game').parentNode.appendChild(turnsdiv);
}


document.addEventListener('DOMContentLoaded', main);