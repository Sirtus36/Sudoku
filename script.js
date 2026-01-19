var numSelected4 = null;
var numSelected9 = null;
var numSelected16 = null;

var errors4 = 0;
var errors9 = 0;
var errors16 = 0;

var currentDifficulty = "easy";
var currentSize = "9";

var board4 = [];
var solution4 = [];
var board9 = [];
var solution9 = [];
var board16 = [];
var solution16 = [];




function showGame(size) {
    currentSize = size;

    document.getElementById("game4").style.display = "none";
    document.getElementById("game9").style.display = "none";
    document.getElementById("game16").style.display = "none";

    if (size == "4") { document.getElementById("game4").style.display = "block"; startGame4(); }
    if (size == "9") { document.getElementById("game9").style.display = "block"; startGame9(); }
    if (size == "16") { document.getElementById("game16").style.display = "block"; startGame16(); }
}




function setDifficulty(diff) {
    currentDifficulty = diff;
    if(currentSize=="4") startGame4();
    if(currentSize=="9") startGame9();
    if(currentSize=="16") startGame16();
}




function getSymbols(size){
    if(size<=9){ let arr=[]; for(let i=1;i<=size;i++) arr.push(i.toString()); return arr; }
    return ["1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G"];
}

function shuffle(arr){ for(let i=0;i<arr.length;i++){ let j=Math.floor(Math.random()*arr.length); let t=arr[i]; arr[i]=arr[j]; arr[j]=t; } return arr; }

function copyBoard(board){ let b=[]; for(let r=0;r<board.length;r++) b.push([...board[r]]); return b; }

function isValid(board,row,col,val,size){
    let box=Math.sqrt(size);
    for(let i=0;i<size;i++){ if(board[row][i]==val) return false; if(board[i][col]==val) return false; }
    let startRow=Math.floor(row/box)*box; let startCol=Math.floor(col/box)*box;
    for(let r=0;r<box;r++){ for(let c=0;c<box;c++){ if(board[startRow+r][startCol+c]==val) return false; } }
    return true;
}

function fillBoard(board,size,symbols){
    for(let r=0;r<size;r++){
        for(let c=0;c<size;c++){
            if(board[r][c]==""){
                let choices = shuffle([...symbols]);
                for(let v of choices){
                    if(isValid(board,r,c,v,size)){
                        board[r][c]=v;
                        if(fillBoard(board,size,symbols)) return true;
                        board[r][c]="";
                    }
                }
                return false;
            }
        }
    }
    return true;
}

function removeCells(board,size){
    let total=size*size;
    let clues=total*0.6;
    if(currentDifficulty=="medium") clues=total*0.45;
    if(currentDifficulty=="hard") clues=total*0.3;
    let remove=total-Math.floor(clues);
    while(remove>0){
        let r=Math.floor(Math.random()*size);
        let c=Math.floor(Math.random()*size);
        if(board[r][c]!=""){ board[r][c]=""; remove--; }
    }
}

function generateSudoku(size){
    let board=Array.from({length:size},()=>Array(size).fill(""));
    let symbols=getSymbols(size);
    fillBoard(board,size,symbols);
    let solution=copyBoard(board);
    removeCells(board,size);
    return {board,solution};
}




function startGame4(){ let g=generateSudoku(4); board4=g.board; solution4=g.solution; drawBoard(board4,solution4,4,"board4","digits4","errors4"); }
function startGame9(){ let g=generateSudoku(9); board9=g.board; solution9=g.solution; drawBoard(board9,solution9,9,"board9","digits9","errors9"); }
function startGame16(){ let g=generateSudoku(16); board16=g.board; solution16=g.solution; drawBoard(board16,solution16,16,"board16","digits16","errors16"); }

function drawBoard(board,solution,size,boardId,digitsId,errorsId){
    let boardEl=document.getElementById(boardId);
    let digitsEl=document.getElementById(digitsId);
    boardEl.innerHTML=""; digitsEl.innerHTML="";
    document.getElementById(errorsId).innerText="0";

    let selected=null;

    // digits
    let symbols=getSymbols(size);
    symbols.forEach(sym=>{
        let d=document.createElement("div");
        d.className="number"; d.innerText=sym;
        d.onclick=function(){ if(selected) selected.classList.remove("number-selected"); selected=d; d.classList.add("number-selected"); }
        digitsEl.appendChild(d);
    });

    // tiles
    for(let r=0;r<size;r++){
        for(let c=0;c<size;c++){
            let t=document.createElement("div"); t.className="tile";
            if(board[r][c]!=""){ t.innerText=board[r][c]; t.classList.add("tile-start"); }
            let box=Math.sqrt(size);
            if((r+1)%box==0 && r!=size-1) t.classList.add("horizontal-line");
            if((c+1)%box==0 && c!=size-1) t.classList.add("vertical-line");
            t.onclick=function(){
                if(!selected||t.innerText!="") return;
                if(solution[r][c]==selected.innerText) t.innerText=selected.innerText;
                else{ let e=document.getElementById(errorsId); e.innerText=parseInt(e.innerText)+1; }
            };
            boardEl.appendChild(t);
        }
    }
}



function showSolution(){
    let tiles=document.getElementsByClassName("tile");
    let sol=[];
    if(currentSize=="4") sol=solution4;
    if(currentSize=="9") sol=solution9;
    if(currentSize=="16") sol=solution16;

    let idx=0;
    for(let r=0;r<sol.length;r++){
        for(let c=0;c<sol.length;c++){
            tiles[idx].innerText=sol[r][c];
            idx++;
        }
    }
}



showGame("9");
