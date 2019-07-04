// implement your functions here
// ...don't forget to export functions!
const c = {
    //generateBoard function: creates and return object with the three specified
    //properties- row, cols, fill
    // ~~~ Assuming the rows/cols given refer to the NUMBER of rows/cols in the board (not zero based)
    generateBoard: function (rows, cols, fill) {//generateBoard = function(rows, cols, fill){
    
        const board = {
            rows: rows,
            cols: cols,
            data: new Array(rows * cols)
        };
    
        if(typeof fill !== 'undefined'){
            board.data.fill(fill);
        }
        else{
            board.data.fill(null);
        }
        
    
        return board;
    }

    //rowColToIndex function: returns a Number, the index that's mapped to by the given
    //row and col based on the board's internal rows and cols properties
    //translates a row and col to an index
    // ~~~ Assuming row/col numbers always begin at 0 (zero based) so the row&col input will be less than the total number of rows&cols 
    ,rowColToIndex: function(board, row, col){
        const index = row * board.cols + col;
        return index;
    }
    
    //indexToRowCol(board, i) function: returns an object that has two properties row and col
    //representing the row and column that the index maps to
    ,indexToRowCol : function(board, i){
        const object = {
            row: Math.floor(i/board.cols),
            col: Math.floor(i % board.cols)
            //col: i - (board.rows * Math.floor(i/board.rows) )
        };
        return object;
    }
    
    //setCell(board, row, col, value) function: returns a NEW board that has a NEW data array
    //representing the board where the row and col is set to the value of value
    , setCell : function(board, row, col, value){
        const updatedBoard = c.generateBoard(board.rows, board.cols, board.fill);
        updatedBoard.data = board.data.slice();
        updatedBoard.data[c.rowColToIndex(board, row, col)] = value;
        return updatedBoard;
    }
    
    //const setCells(board, <any nunber of move objects>) function: returns a NEW board that edits the 
    //data array to the values specified by the objects in the parameter
    , setCells : function(board, moves){
        const updatedBoard = c.generateBoard(board.rows, board.cols, board.fill);
        updatedBoard.data = board.data.slice();
        for(let i = 1; i < arguments.length; i ++){
            updatedBoard.data[c.rowColToIndex(board, arguments[i].row, arguments[i].col)] = arguments[i].val;
        }
        return updatedBoard;
    }
 
    //boardToString(board)
    , boardToString : function(board){
        const wcwidth = require('wcwidth');
            let boardString = ``;
            const boardSize = board.rows * board.cols;
        
            let adjust = false;
            let columnCount = 0;
            let rowCount = 0;
         
            for(let i = 0; i < boardSize; i++){
            
                boardString += `|`;
    
                if(board.data[i] === null){
                    boardString += `    `;
                }
                else if(wcwidth(board.data[i]) === 1){
                        boardString = boardString + ` ` + board.data[i] + `  `;
                    }
                    else{
                        boardString = boardString + ` ` + board.data[i] + ` `;
                        adjust = true;
                    } 
                //if the row has finished, print a finishing '|' and reset
                 columnCount += 1;
                 if(columnCount === board.cols){
                    boardString = boardString + `|\n`; 
                    columnCount = 0;
                    rowCount += 1;
                 }
    
                 if(rowCount === board.rows){
                     let labelString = ``;
                     boardString += `|`;
                     let charint = 65;
                    for(let j = 0; j < board.cols; j++){
                        if(j !== board.cols - 2){   
                            boardString += `----+`;
                        }
                        labelString = labelString + `| ` + String.fromCharCode(charint) + `  `;
                        charint += 1;
                    }
                    boardString = boardString + `----|\n` + labelString + "|";
                 }
    
    
            }

            if(adjust === true){
                return boardString;
            }
    
            else {
                let columnCount = 0;
                let rowCount = 0;
                boardString = ``;
                for(let i = 0; i < boardSize; i++){
                
                    boardString += `|`;
        
                    if(board.data[i] === null){
                        boardString += `   `;
                    }
                    else if(wcwidth(board.data[i]) === 1){
                            boardString = boardString + ` ` + board.data[i] + ` `;
                        }
                    
                    //if the row has finished, print a finishing '|' and reset
                     columnCount += 1;
                     if(columnCount === board.cols){
                        boardString = boardString + `|\n`; 
                        columnCount = 0;
                        rowCount += 1;
                     }
        
                     if(rowCount === board.rows){
                         let labelString = ``;
                         boardString += `|`;
                         let charint = 65;
                        for(let j = 0; j < board.cols; j++){
                            if(j !== board.cols - 2){   
                                boardString += `---+`;
                            }
                            labelString = labelString + `| ` + String.fromCharCode(charint) + ` `;
                            charint += 1;
                        }
                        boardString = boardString + `---|\n` + labelString + "|";
                     }
        
                }
                return boardString;
            }
    
    
        }
    
    //letterToCol(board)
    ,letterToCol : function(letter){
        const charstring = letter.charCodeAt(0);
        if(charstring >= 65 && charstring <= 90 && letter.length === 1){
            return charstring - 65;
        }
        else{
            return null;
        }
    }
    
    //getEmptyRowCol(board, letter, empty) function that returns the row and col of an EMPTY cell in column letter
    , getEmptyRowCol : function(board, letter, empty){
    
        let column = c.letterToCol(letter);
    
        //make sure that the board has the specified letter column
        if(column >= board.cols){
            column = null;
        }
    
        //calculate the highest possible row number that has nothing in it
        let rowEmpty = null;
        if(column !== null){

            //check for even if min row is filled and nothing else is, return null
            if(board.data[0] !== null){
                const count = c.letterToCol(letter);
                for(let i = 0; i < board.rows; i++){
                    if(board.data[count] !== null){
                        return null;
                    }
                }
            }

            let count = c.letterToCol(letter);
            let topCellIndex; 
            let bottomCellIndex;
            let btwnTwoCells = false;
    
            for(let i = 0; i < board.rows; i++){
    
                //Below is to account for any holes in the column, where a cell has something on top and on the bottom
                if(i === 0 || i === board.rows - 1){
                    btwnTwoCells = false;
                }
                else{
                    topCellIndex = count - board.cols;
                    bottomCellIndex = count + board.cols;
                    if(board.data[topCellIndex] !== null && board.data[bottomCellIndex] !== null){
                        btwnTwoCells = true;
                    }
                }
    
                if(board.data[count] === null && btwnTwoCells === false){
                    rowEmpty = c.indexToRowCol(board, count).row;
                }
                
                //increase the count index by column length to iterate through the 1D data array
                //simulating moving down a column in a 2D array
                count += board.cols;
    
                //reset
                btwnTwoCells = false;
            }
        }
    
        //prepare for the case that the whole rows is full and there are no empty cells
        //prepare for the case that the letter specified column does not exist
        if(rowEmpty !== null && column !== null){
            const emptyCell = {
                row: rowEmpty,
                col: column
            };
            return emptyCell;
        }
    
        else{
            return null;
        }
    }
    
    //getAvailableColumns(board) returns all columns that have an empty cell
    , getAvailableColumns : function(board) {
        let number = 65;
        const array = [];
        for(let i = 0; i < board.cols; i++){
            if(c.getEmptyRowCol(board, String.fromCharCode(number)) !== null){
                array.push(String.fromCharCode(number));
            }
            number += 1;
        }
        return array;
    }
    
    //hasConsecutiveValues(board, row, col, n) return true if there are n consecutive values
    //horizontally, vertically, or diagonally; else return false
    , hasConsecutiveValues : function(board, row, col, n){
        const piece = board.data[c.rowColToIndex(board, row, col)];
        //console.log('Current piece:' , piece);
    
        const currentIndexInDataArray = c.rowColToIndex(board, row, col);
        //console.log('Current index in 1D array:', currentIndexInDataArray);
    
        const vertWin = function(index){
            let count = 1; //count is 1 to include the piece that we are starting with
            const copy = index;
            //up
            for(let a = 0; a < row; a++){
                index = index - board.cols;
                if(board.data[index] === piece){
                    count += 1;
                }
                if(board.data[index] !== piece){
                    //not consecutive anymore
                    break;
                }
                if(count === n){
                    return true;
                }   
            }
            //down
            index = copy;
            for(let a = 0; a < board.rows - row; a++){
                index = index + board.cols;
                if(board.data[index] === piece){
                    count += 1;
                }
                if(board.data[index] !== piece){
                    //not consecutive anymore
                    break;
                }
                if(count === n){
                    return true;
                }   
            }
            return false;
        };
    
        const horizontalWin = function(index){
            let count = 1;
            const copy = index;
            //right
            for(let a = 0; a < board.cols - col - 1; a++){
                index = index + 1;
                if(board.data[index] === piece){
                    count += 1;
                }
                if(board.data[index] !== piece){
                    //not consecutive anymore
                    break;
                }
                if(count === n){
                    return true;
                }   

            }
            //left
            index = copy;
            for(let a = 0; a < col; a++){
                index = index - 1;
                if(board.data[index] === piece){
                    count += 1;
                }
                if(board.data[index] !== piece){
                    //not consecutive anymore
                    break;
                }
                if(count === n){
                    return true;
                }   
            }
    
            return false;
        };
    
        const diagonalWin1 = function(index){
            //upper right and lower left
            let count = 1;
            const copy = index;
            let visitedCols = {};
            visitedCols[c.indexToRowCol(board,index).col] = 0;
            let keepGoing = true;
            //upper right
            while(keepGoing === true){

                index = index - board.cols + 1;

                const currentColumn = c.indexToRowCol(board, index).col;

                if(index > (board.rows * board.cols) - 1 || index < 0 ||
                currentColumn < 0 ||
                currentColumn >= board.cols ||
                currentColumn <= col){
                    keepGoing = false;
                    break;
                }

                if(visitedCols.hasOwnProperty(currentColumn)){
                    keepGoing = false;
                    break;
                }
                else{
                    visitedCols[currentColumn] = 0;
                }
                
                if(board.data[index] === piece){
                    count += 1;
                }

                if(count === n){      
                    return true;
                }
            }
                        
            //lower left
            visitedCols = {};
            index = copy;
            visitedCols[c.indexToRowCol(board,index).col] = 0;
            keepGoing = true;
            while(keepGoing === true){

                index = index + board.cols - 1;

                const currentColumn = c.indexToRowCol(board, index).col;

                if(index > (board.rows * board.cols) - 1 || index < 0 ||
                currentColumn < 0 || 
                currentColumn >= board.cols || 
                currentColumn >= col)
                {
                    keepGoing = false;
                    break;
                }

                if(visitedCols.hasOwnProperty(currentColumn)){
                    keepGoing = false;
                    break;
                }
                else{
                    visitedCols[currentColumn] = 0;
                }
                
                if(board.data[index] === piece){
                    count += 1;
                }

                if(count === n){      
                    return true;
                }
            }
            return false;
        };
    
        const diagonalWin2 = function(index){

            //upper left and lower right
            let count = 1;
            const copy = index;
            let visitedCols = {};
            visitedCols[c.indexToRowCol(board,index).col] = 0;
            let keepGoing = true;
            //upper left
            while(keepGoing === true){

                index = index - board.cols - 1;

                const currentColumn = c.indexToRowCol(board, index).col;

                if(index > (board.rows * board.cols) - 1 || index < 0 ||
                currentColumn < 0 ||
                currentColumn >= board.cols ||
                currentColumn >= col){
                    keepGoing = false;
                    break;
                }

                if(visitedCols.hasOwnProperty(currentColumn)){
                    keepGoing = false;
                    break;
                }
                else{
                    visitedCols[currentColumn] = 0;
                }
                
                if(board.data[index] === piece){
                    count += 1;
                }

                if(count === n){      
                    return true;
                }
            }
            
            //lower right
            visitedCols = {};
            index = copy;
            visitedCols[c.indexToRowCol(board,index).col] = 0;
            keepGoing = true;
            while(keepGoing === true){

                index = index + board.cols + 1;

                const currentColumn = c.indexToRowCol(board, index).col;

                if(index > (board.rows * board.cols) - 1 || index < 0 ||
                currentColumn < 0 || 
                currentColumn >= board.cols || 
                currentColumn <= col)
                {
                    keepGoing = false;
                    break;
                }

                if(visitedCols.hasOwnProperty(currentColumn)){
                    keepGoing = false;
                    break;
                }
                else{
                    visitedCols[currentColumn] = 0;
                }
                
                if(board.data[index] === piece){
                    count += 1;
                }

                if(count === n){      
                    return true;
                }
            } 
            return false;
        };


         if(vertWin(currentIndexInDataArray) === true || 
         horizontalWin(currentIndexInDataArray) === true || 
         diagonalWin1(currentIndexInDataArray)=== true || 
         diagonalWin2(currentIndexInDataArray) === true
        )
        {
            return true;
        }

        else{
            return false;
        }

    }
    
    //autoplay(board, s, numConsecutive)
    , autoplay : function(board, s, numConsecutive){
        const result = { board: board};
        const piece1 = s.slice(0,1);
        const piece2 = s.slice(1,2);
        const moveString = s.slice(2, s.length);
        result['pieces'] = [piece1, piece2];

        let move = 1;
        if(moveString.length % 2 === 0){
            result['lastPieceMoved'] = piece2;
        }
        else{
            result['lastPieceMoved'] = piece1;
        }

        let currentPiece = piece1;
        for(let i = 0; i < moveString.length; i++){
            //console.log(c.boardToString(board))

            if(i % 2 === 0){
                currentPiece = piece1;
            }
            else{
                currentPiece = piece2;
            }
            const columnLetter = moveString.slice(i, i+1);

            //check if the move is invalid
            //check if the specified column exists or not
            if(c.letterToCol(moveString.slice(i, i+1)) >= board.cols ){
                //console.log('invalid move because column doesnt exist')
                result['board'] = null;
                result['error'] = {num: move, val: currentPiece, col: columnLetter};
                return result;
            }

            //if the move is valid, we can find an empty row in the col
            const freeRowColObj = c.getEmptyRowCol(board, columnLetter);
            if(freeRowColObj !== null){
                //meaning there IS an empty cell
                //console.log('free cell at row', freeRowColObj.row, 'column', c.letterToCol(columnLetter))
                //console.log(currentPiece)
                board = c.setCell(board, freeRowColObj.row, c.letterToCol(columnLetter), currentPiece);
                //console.log(c.boardToString(board))
                result['lastPieceMoved'] = currentPiece;
            }
            else{
                //the column is full
            }

            //after dropping the piece, check if there is a win
            if(freeRowColObj !== null){
            if(c.hasConsecutiveValues(board, freeRowColObj.row, c.letterToCol(columnLetter), numConsecutive) === true){
                if(result.hasOwnProperty('winner')){
                    delete result.winner;
                    //console.log('winner found but there are still more moves')
                    result['board'] = null;
                    result['error'] = { num: move, val: currentPiece, col: columnLetter};
                    return result;
                }
                else{
                    result['winner'] = currentPiece;
                }
            }
 
        }

        move += 1;
    }//end of for loop/moving through the moveString
        //since there was no winner found and there was no error detected
        result['board'] = board;
        return result;
        
    }

    , playerTurn : function(board, colLet, numConsecutive, currentPiece){
        const result = {
            board: board,
            win: false
        };
        //return true if there is a winner,
        //return false if there is no winner yet
        //col is the columnLETTER
        //check if the move is invalid
            //check if the specified column exists or not
            if(c.letterToCol(colLet) >= board.cols || c.letterToCol(colLet) < 0){
                //console.log('invalid move because column doesnt exist')
                console.log('\nOops, that is not a valid move, try again!\n');
                result['tryAgain'] = true;
                return result;
            }

            //if the move is valid, we can find an empty row in the col
            const freeRowColObj = c.getEmptyRowCol(board, colLet);
            if(freeRowColObj !== null){
                //meaning there IS an empty cell
                //console.log('free cell at row', freeRowColObj.row, 'column', c.letterToCol(colLet)
                //console.log(currentPiece)
                board = c.setCell(board, freeRowColObj.row, freeRowColObj.col, currentPiece);
                //console.log('...dropping in column', colLet);
                result['freeCol'] = colLet;
                if(c.hasConsecutiveValues(board, freeRowColObj.row, freeRowColObj.col, numConsecutive) === true){
                    result['board'] = board;
                    result['win'] = true;
                    result['tryAgain'] = false;
                    return result;
                }
                else{
                    result['board'] = board;
                    result['win'] = false;
                    result['tryAgain'] = false;
                    return result;
                }
            }
            else{
                console.log('Oops, that is not a valid move, try again!\n');
                result['tryAgain'] = true;
                return result;
            }

            //after dropping the piece, check if there is a win
            
    }

    , computerTurn : function(board, consec, compPiece){
        const result = {
            board: board,
            win: false
        };
        const arrayFreeCols = c.getAvailableColumns(board);
        //console.log('free cols:', arrayFreeCols);
        const randomCol = Math.floor(Math.random() * (arrayFreeCols.length-1)); //pick random index of array
        
        const freeColLet = arrayFreeCols[randomCol];
        //console.log(freeColLet);
        //console.log('random col:', c.letterToCol(freeColLet), '=', freeColLet);
        const freeRowColObj = c.getEmptyRowCol(board, freeColLet);

        if(freeRowColObj !== null){
            //meaning there IS an empty cell
            //console.log('free cell at row', freeRowColObj.row, 'column', freeColLet);
            board = c.setCell(board, freeRowColObj.row, freeRowColObj.col, compPiece);
            //console.log('...dropping in column', freeColLet);
            result['freeCol'] = freeColLet;
            if(c.hasConsecutiveValues(board, freeRowColObj.row, freeRowColObj.col, consec) === true){
                result['board'] = board;
                result['win'] = true;
                return result;
            }
            else{
                result['board'] = board;
                console.log(c.boardToString(board));
                result['win'] = false;
                return result;
            }
        }
        else{
            return result;
        }

    }


    };// end of const c

    module.exports = c;