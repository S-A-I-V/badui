const Catcher = document.getElementById('catcher');
const NameBox = document.getElementById('name-box');
const SubmitButton = document.getElementById('submit-btn');
const resetButton = document.getElementById('reset-btn');
const bewareMessage = document.getElementById('beware-message');

const targetString = "abcdefghijklmnopqrstuvwxyz";

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

let divList = [] 
let catcherData = {
    'x':100,
    'length': 200,
}

let divid=0;
let field=1;

const generateLetterDiv = (left_padding , divid) => {
    let letterDiv = document.createElement('div')
    letterDiv.style.cssText = `
    position:fixed;
    left: ${left_padding}px;
    top: 20px;
    opacity:1;
    z-index:100;
   `
    ;
    let letterText = document.createElement('h1')
    letterText.innerHTML=randomChar();
    

    letterDiv.appendChild(letterText);
    letterDiv.id = divid
    document.body.appendChild(letterDiv)

    return letterDiv
}

const randomChar = () => {
    let char = targetString[getRandomInt(0, targetString.length)];
    return char;
}

let loginLoopInterval = setInterval(loginLoop, 10);
let spawnTime = 0;

function loginLoop(){
    spawnTime+=10;
    if(spawnTime == 1000){
        spawnTime=0;
        divList.push(generateLetterDiv(getRandomInt(20, window.innerWidth-20), divid))
        divid+=1;
    }

    if(field == 1){
        NameBox.style.borderColor = "purple";
    }
   
    moveLetters();
}

function stopLoginLoop(){
    clearInterval(loginLoopInterval);
    console.log('login stopped')
}

function startLoginLoop(){
    loginLoopInterval = setInterval(loginLoop, 10);
}

function removeElement(id){
    const elementToRemove = document.getElementById(id);
    if(elementToRemove != null)
        elementToRemove.remove()
}

function moveLetters(){
    divList.forEach(element => {
        const computedStyle = window.getComputedStyle(element);
        let currentTop = parseInt(computedStyle.getPropertyValue("top"));
        currentTop+=2;
        element.style.top =  `${currentTop}px`;
        if(element.id == 0)

        if(parseInt(element.style.top) > window.innerHeight)
                removeElement(element.id)

        if(parseInt(element.style.top) > window.innerHeight-120 && parseInt(element.style.top) < window.innerHeight-20 && parseInt(element.style.left) >=  catcherData.x && parseInt(element.style.left) <= catcherData.x + catcherData.length)
        {
            const parentDiv = document.getElementById(element.id);
            if(parentDiv != null){
                const childText = parentDiv.querySelector("h1").textContent;
                addLetterToBox(childText);
                removeElement(element.id);   
            }
        }
    });
}

function addLetterToBox(chr){
    NameBox.value += chr;
}

function removeLetterFromBox(){
    NameBox.value = NameBox.value.substring(0, NameBox.value.length - 1);
}

function submitName() {
    alert('Welcome, ' + NameBox.value + '!');
    showPartyPoppers();
}

function resetGame() {
    NameBox.value = "";
    divList.forEach(element => removeElement(element.id));
    divList = [];
    targetIndex = 0;
    startLoginLoop();
}

function showPartyPoppers() {
    stopLoginLoop();
    
    const confettiInterval = setInterval(createConfetti, 100); // Creates a confetti piece every 100ms

    setTimeout(() => {
        clearInterval(confettiInterval);
    }, 10000); // 10 seconds
}

function createConfetti() {
    const confetti = document.createElement('div');
    confetti.classList.add('confetti');
    
    const colors = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    confetti.style.backgroundColor = randomColor; 
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.animationDelay = `${Math.random() * 2}s`;
    document.body.appendChild(confetti);
    
    setTimeout(() => confetti.remove(), 3000);
}

document.addEventListener("keydown", function(event) {
    const key = event.key;
  
    if(key == 'ArrowRight' && catcherData.x+catcherData.length < window.innerWidth-20 )
        catcherData.x += 50;
    else if (key == 'ArrowLeft' && catcherData.x > 20)
        catcherData.x -= 50;
    else if(key == 'Enter') {
        submitName();
    } else if (key == 'Backspace')
        removeLetterFromBox()
    
    Catcher.style.left=`${catcherData.x}px`
});

resetButton.addEventListener('mouseover', () => {
    const rect = resetButton.getBoundingClientRect();
    bewareMessage.style.top = `${rect.bottom + 5}px`;
    bewareMessage.style.left = `${rect.left}px`;
    bewareMessage.style.display = 'block'; // Show beware message
});

resetButton.addEventListener('mouseout', () => {
    bewareMessage.style.display = 'none'; // Hide beware message
});

function moveResetButton() {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const randomX = Math.random() * (viewportWidth - resetButton.offsetWidth);
    const randomY = Math.random() * (viewportHeight - resetButton.offsetHeight);

    resetButton.style.left = `${randomX}px`;
    resetButton.style.top = `${randomY}px`;
}

setInterval(moveResetButton, 2000);
