// require your module, connectmoji
// require any other modules that you need, like clear and readline-sync

const clear = require('clear');
const c = require('./connectmoji.js');
const readlineSync = require('readline-sync');

//If OPTIONS_AND_MOVES are specified
if(process.argv.length > 2){
    const arr = process.argv[2].split(',');
    const playerVal = arr[0];
    const moveString = arr[1];
    //const playerpiece = moveString.slice(0,1);
    const comppiece = moveString.slice(1,2);
    const numberRows = parseInt(arr[2]);
    const numberCols = parseInt(arr[3]);
    const numberConsec = parseInt(arr[4]);
    const board = c.generateBoard(numberRows, numberCols);

    const autoResult = c.autoplay(board, moveString, numberConsec);
    const pressEnter = readlineSync.question('All the moves have played out... press ENTER to continue');
    if(autoResult.hasOwnProperty('winner')){
        console.log('\nThe winner is', autoResult['winner']);
        console.log(c.boardToString(autoResult.board));
    }
    else{
        //there was no win and the moveString is finished
        //prompt user to finish game with a computer
        let totalSize = 0;
        let result = {
            lastPieceMoved : autoResult['lastPieceMoved']
        };
        console.log('\nThere was no winner...');
        console.log(c.boardToString(autoResult.board));

        for(let i = 0; i < numberRows * numberCols; i++){
            
            if(c.getAvailableColumns(autoResult['board']).length === 0){
                console.log('All columns are full. There is no winner');
            }
            if(result['lastPieceMoved'] === playerVal){
                //this means it is now the computer's turn
                const nextMove = readlineSync.question('\nPress <ENTER> to see computer move\n');
                result = c.computerTurn(autoResult['board'], numberConsec, comppiece);
                if(result['win'] === true){
                    clear();
                    console.log('dropping in column...', result['freeCol']);
                    console.log(c.boardToString(result['board']));
                    console.log('\n', comppiece, 'wins\n');
                    //gameFinished = true;
                    break;
                }else{
                    clear(); 
                    console.log('dropping in column...', result['freeCol']);
                    console.log(c.boardToString(result['board']));
                    totalSize += 1;
                    if(totalSize === (numberRows * numberCols - moveString.length)){
                        console.log('No winner. So sad');
                        break;
                    }
                }
                    autoResult['board'] = result['board'];
                    result['lastPieceMoved'] = comppiece;
            }
            else{
                //this means it is now the player's turn
                let chooseCol = readlineSync.question(`\nChoose a column letter to drop your piece in\n> `);
                result = c.playerTurn(autoResult['board'], chooseCol, numberConsec, playerVal);
                while(result['tryAgain'] === true){
                    chooseCol = readlineSync.question(`\nChoose a column letter to drop your piece in\n> `);
                    result = c.playerTurn(autoResult['board'], chooseCol, numberConsec, playerVal);
                }
                //console.log(result['win']);
                if(result['win'] === true){
                    clear();
                    console.log('dropping in column...', result['freeCol']);
                    console.log(c.boardToString(result['board']));
                    console.log('\n', playerVal ,'wins\n');
                    //gameFinished = true;
                    break;
                }else{
                    clear();
                    console.log('dropping in column...', result['freeCol']);
                    console.log(c.boardToString(result['board']));
                    totalSize += 1;
                    if(totalSize === (numberRows * numberCols - moveString.length)){
                        console.log('No winner. So sad');
                        break;
                    }
                }
                // const chooseCol = readlineSync.question(`\nChoose a column letter to drop your piece in\n> `);
                // result = c.playerTurn(autoResult['board'], chooseCol, numberConsec, playerVal);

                // if(result['win'] === true){
                //     clear();
                //     console.log(c.boardToString(result['board']));
                //     console.log('\nYou win!\n');
                //     break;
                // }else{
                //     clear();
                //     console.log(c.boardToString(result['board']));
                // }
                autoResult['board'] = result['board'];
                result['lastPieceMoved'] = playerVal;
            }
        }   
    }
}   



//If OPTIONS_AND_MOVES are not specified
else{
    const enterInfo = readlineSync.question(`Enter the number of rows, columns, and consecutive "pieces" for win
all separated by commas...for example: 6,7,4\n> `);
    const infoarr = enterInfo.split(',');
    const row = parseInt(infoarr[0]);
    const col = parseInt(infoarr[1]);
    const consec = parseInt(infoarr[2]);
    console.log('Using row, col and consecutive: ', row, col, consec);

    const enterChars = readlineSync.question(`Enter two characters that represent the player and computer
(separated by a comma... for example: P,C)\n> `);
let player, comp;
    if(enterChars.length === 0){
        player = '😎';
        comp = '💻';
    }
    else{
        const arr = enterChars.split(',');
        player = arr[0];
        comp = arr[1];
    }
    console.log('Using player and computer characters:', player, comp);

    let defaultT;
    let firstTurn = readlineSync.question(`Who goes first, (P)layer or (C)omputer?\n> `);
    if(firstTurn.length > 1 || firstTurn.length === 0 || (firstTurn !== 'P' && firstTurn !== 'C')){
        console.log('Invalid input, default first turn goes to Player');
        defaultT = 'P';
    }
    else if(firstTurn === 'P'){ console.log('Player goes first');}
        else{console.log('Computer goes first');}

    if(defaultT === 'P') {firstTurn = 'P';}
/* ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ S T A R T  G A M E ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ */
    const start = readlineSync.question('Press <ENTER> to start game');
    let board = c.generateBoard(row, col);
    //let gameFinished = false;
    let result;
    let totalSize = 0;
    for(let i = 0; i < row*col; i++){
    //while(gameFinished === false){
        
        if(firstTurn === 'P'){
            
            let chooseCol = readlineSync.question(`\nChoose a column letter to drop your piece in\n> `);
            result = c.playerTurn(board, chooseCol, consec, player);
            while(result['tryAgain'] === true){
                chooseCol = readlineSync.question(`\nChoose a column letter to drop your piece in\n> `);
                result = c.playerTurn(board, chooseCol, consec, player);
            }
            //console.log(result['win']);
            if(result['win'] === true){
                clear();
                console.log('dropping in column...', result['freeCol']);
                console.log(c.boardToString(result['board']));
                console.log('\n', player ,'wins\n');
                //gameFinished = true;
                break;
            }else{
                clear();
                console.log('dropping in column...', result['freeCol']);
                console.log(c.boardToString(result['board']));
                totalSize += 1;
                if(totalSize === row*col){
                    console.log('No winner. So sad');
                    break;
                }
            }
            board = result['board'];
            firstTurn = 'C';
        }

        else if(firstTurn === 'C'){
            const nextMove = readlineSync.question('\nPress <ENTER> to see computer move\n');
            result = c.computerTurn(board, consec, comp);
            if(result['win'] === true){
                clear();
                console.log('dropping in column...', result['freeCol']);
                console.log(c.boardToString(result['board']));
                console.log('\n', comp, 'wins\n');
                //gameFinished = true;
                break;
            }else{
                clear(); 
                console.log('dropping in column...', result['freeCol']);
                console.log(c.boardToString(result['board']));
                totalSize += 1;
                if(totalSize === row * col){
                    console.log('No winner. So sad');
                    break;
                }
            }
            board = result['board'];
            firstTurn = 'P';
            //gameFinished = true;   
        }
        
    }
}