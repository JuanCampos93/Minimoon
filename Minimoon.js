let ctx, canvas;
let bgm;
let winMusic;
let lostMusic;
let i = 300;
let j = 300;
let menuArrow = 422;
let introOnce = false;

let background = new Image();
let friendlyChar = new Image();
let enemyChar = new Image();

friendlyChar.src = "images/blueMon.png"
enemyChar.src = "images/enemy.png"
background.src = "images/Background.png";

let srcX, srcY = 0;
let sheetWidth = 256;
let sheetHeight = 32;
let frameCount = 8;
let currentFrame = 0;
let width = sheetWidth / frameCount;

let srcXEM, srcYEM = 0;
let sheetWidthEM = 440;
let sheetHeightEM = 30;
let frameCountEM = 10;
let currentFrameEM = 0;
let widthEM = sheetWidthEM / frameCountEM;

function character(HP, mana, attDamage, attDefense) {}
let userChar = new character();
let enemyEasy = new character();
userChar = {
    HP: 100,
    mana: 100,
    attDamage: 15,
    attDefense: 10,
};
enemyEasy = {
    HP: 80,
    mana: 40,
    attDamage: 15,
    attDefense: 5,
};

let userDefending = false;
let enemyDefending = false;

let userTurn = true;
let turnNum = 0;
let lastUserAct = null;
let enemyFocused = null;

let notifText = "";



function setup() {
    canvas = document.getElementById("surface");
    bgm = document.getElementById('bgm');
    winMusic = document.getElementById('winMusic');
    lostMusic = document.getElementById('lostMusic');
    ctx = canvas.getContext("2d");

    let menuSelec = 0;

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 600, 600);

    addEventListener("click", start);

    addEventListener("keyup", (event) => {
        if (userTurn) {
            if (event.code == "KeyP") {
                youWin();
            }

            if (event.code == "KeyS") {
                menuSelec += 1;
                menuArrow += 40;
                if (menuSelec > 3) {
                    menuSelec = 0
                    menuArrow = 422;
                }
                draw();
            }
            if (event.code == "KeyW") {
                menuSelec -= 1;
                menuArrow -= 40;
                if (menuSelec < 0) {
                    menuSelec = 3;
                    menuArrow = 542;
                }
                draw();
            }

            if (event.code == "Enter") {
                switch (menuSelec) {
                    //Normal Attack
                    case 0:
                        friendlyAttack();
                        lastUserAct = "A";
                        break;

                        //Spell
                    case 1:
                        friendlySpell();
                        lastUserAct = "S";
                        break;

                        //Focus
                    case 2:
                        friendlyFocus();
                        lastUserAct = "F";
                        break;

                        //Defend
                    case 3:
                        friendlyDefend();
                        lastUserAct = "D";
                        break;

                    default:

                }
                userTurn = false;
                turnNum++;
                setTimeout(monsterTree, 1500);
            }
        }
    })
}

function GetRandomInteger(a, b) {

    if (a > b) {
        small = b;
        large = a;
    } else {
        small = a;
        large = b;
    }

    let x = parseInt(Math.random() * (large - small + 1)) + small
    return x;
}

function start() {
    bgm.play();
    drawIntro();
}

function draw() {
    ctx.clearRect(0, 0, 600, 600);
    ctx.drawImage(background, 0, 0);

    //Attack Menu
    ctx.fillStyle = "#FFF3DE";
    ctx.fillRect(41, 401, 118, 148);


    ctx.strokeStyle = "#3EF6FC";
    ctx.lineWidth = "3";
    ctx.rect(40, 400, 120, 150);
    ctx.stroke();

    ctx.font = "20px Courier New";
    ctx.fillStyle = "black";

    ctx.fillText("Attack", 43, 420);
    ctx.fillText("Spell", 43, 460);
    ctx.fillText("Focus", 43, 500);
    ctx.fillText("Defend", 43, 540);

    ctx.fillText("◀", 125, menuArrow);

    //Notifications
    ctx.fillStyle = "#FFF3DE";
    ctx.fillRect(41, 101, 478, 148);

    ctx.font = "bold 20px Courier New";
    ctx.fillStyle = "black";
    ctx.fillText(notifText, 43, 120);

}

function drawIntro() {
    ctx.drawImage(background, 0, 0);
    ctx.fillRect(0, j, 600, 600);
    ctx.fillRect(0, 0, 600, i);

    i--;
    j++;

    if (i > 0)
        setTimeout(drawIntro, 29.5);
    else if (introOnce == false) {
        drawChar();
        introOnce = true;
    }
}

function updateFrame() {
    currentFrame = ++currentFrame % frameCount;
    srcX = currentFrame * width;

    currentFrameEM = ++currentFrameEM % frameCountEM;
    srcXEM = currentFrameEM * widthEM;
}

function updateHPMana() {
    ctx.font = "40px Courier New";
    ctx.fillStyle = "#3EF6FC";

    ctx.fillText("HP: " + userChar.HP, 45, 350);
    ctx.fillText("MANA: " + userChar.mana, 45, 310);

    ctx.font = "40px Courier New";
    ctx.fillStyle = "white";

    ctx.fillText("HP: " + enemyEasy.HP, 350, 410);
    ctx.fillText("MANA: " + enemyEasy.mana, 350, 450);
}

function drawChar() {
    draw();
    updateFrame();
    updateHPMana();

    ctx.drawImage(friendlyChar, srcX, srcY, width, sheetHeight, 50, 350, width, sheetHeight);
    ctx.drawImage(enemyChar, srcXEM, srcYEM, widthEM, sheetHeightEM, 430, 330, widthEM, sheetHeightEM);

    setTimeout(drawChar, 100);

    if (enemyEasy.HP <= 0)
        youWin();

    if (userChar.HP <= 0)
        youLose();
}



function friendlyAttack() {
    if (enemyDefending) {
        enemyEasy.HP -= (userChar.attDamage - enemyEasy.attDefense);
        notifText = ("You did damage, but your enemy was defending.");
    } else {
        enemyEasy.HP -= userChar.attDamage;
        notifText = ("You attacked the monster!");
    }
    enemyDefending = false;
}

function friendlySpell() {
    if (userChar.mana >= 25) {
        enemyEasy.HP -= Math.round(userChar.attDamage + (userChar.attDamage / 2));
        userChar.mana -= 25;
        notifText = ("You used a spell! Your mana is: " + userChar.mana);
    } else {
        notifText = ("You don't have enough mana!");
    }
}

function friendlyFocus() {
    userChar.mana += 20;
    notifText = ("You recovered 20 mana!");
}

function friendlyDefend() {
    notifText = ("You're defending");
    userDefending = true;
}

function monsterTree() {
    let enemyAction;

    //Enemy action 1: Attack
    //Enemy Action 2: Spell
    //Enemy Action 3: Focus
    //Enemy Action 4: Defend

    enemyAction = GetRandomInteger(1, 4);

    if (enemyAction == 1) {
        monsterAttack();
    }

    if (enemyAction == 2) {
        monsterSpell();
    }

    if (enemyAction == 3) {
        if (enemyFocused == true) {
            monsterSpell();
        } else {
            monsterFocus();
        }
    }

    if (enemyAction == 4) {
        monsterDefend();
    }

    userTurn = true;
}

function monsterAttack() {
    if (userDefending) {
        userChar.HP -= (enemyEasy.attDamage - userChar.attDefense);
        notifText = ("You took damage\nbut you were defending!");
    } else {
        userChar.HP -= enemyEasy.attDamage;
        notifText = ("You took damage!");
    }
    userDefending = false;
}

function monsterSpell() {
    if (enemyEasy.mana >= 20) {
        userChar.HP -= Math.round(enemyEasy.attDamage + (enemyEasy.attDamage / 2));
        enemyEasy.mana -= 20;
        notifText = ("The enemy used a spell!");
        console.log("Enemy monster mana: " + enemyEasy.mana);
    } else {
        notifText = ("The enemy monster attacked" + "\n" + "but it didn't have enough mana!");
    }
}

function monsterFocus() {
    enemyEasy.mana += 20;
    notifText = ("The enemy recovered 20 mana!");
}

function monsterDefend() {
    notifText = ("The monster is defending");
    enemyDefending = true;
}

function youWin() {
    bgm.pause();
    winMusic.play();

    ctx.clearRect(0, 0, 600, 600);
    ctx.drawImage(background, 0, 0);

    ctx.fillStyle = "#FFF3DE";
    ctx.fillRect(40, 50, 500, 500);

    ctx.strokeStyle = "#3EF6FC";
    ctx.lineWidth = "3";
    ctx.rect(39, 49, 499, 499);
    ctx.stroke();

    ctx.font = "50px Courier New";
    ctx.fillStyle = "#3EF6FC";

    ctx.fillText("You win!", 150, 300);

}

function youLose() {
    bgm.pause();
    lostMusic.play();

    ctx.clearRect(0, 0, 600, 600);
    ctx.drawImage(background, 0, 0);

    ctx.fillStyle = "black";
    ctx.fillRect(40, 50, 500, 500);

    ctx.strokeStyle = "red";
    ctx.lineWidth = "3";
    ctx.rect(39, 49, 499, 499);
    ctx.stroke();

    ctx.font = "50px Courier New";
    ctx.fillStyle = "red";

    ctx.fillText("You lose...", 150, 300);
}