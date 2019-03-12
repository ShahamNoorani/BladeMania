var canvas = document.getElementById("game")
var context = canvas.getContext("2d")

var level = 1
var hasBeenSetup = false
var dead = true
var shopBool = false
var statsAssigned = true
var lastMove = -1

var autoRun = false


class Player {
    constructor(x, y, w, h, health, stats) {
        this.player = {
            gold: 0,
            x: x,
            y: y,
            w: w,
            h: h,
            sprite: "player.png",
            image: new Image(50, 20),

            movingLeft: false,
            movingRight: false,

            health: health,
            stats: 
            {
                level: stats.level,
                vit: stats.vit,
                // atributes to health
                agi: stats.agi,
                // atributes to movement speed
                str: stats.str,
                // atributues to damage
                luk: stats.luk,
                // attributes to probability of getting hit
                currentXP: stats.currentXP,
            }
        }
    }

    getMaxHealth() {
        return 100 + this.player.stats.vit * 25 - 25
    }

    getSpeed() {
        return 20 + this.player.stats.agi * 10 - 10
    }

    getHitProb() {
        return 70/this.player.stats.luk
    }
}

// Use if class isn't working

// var player = 
// {
//     x: 80,
//     y: 280,
//     w: 400,
//     h: 160,

//     sprite: "player.png",
//     image: new Image(50, 20),

//     movingLeft: false,
//     movingRight: false,

//     health: 100,
//     stats: 
//     {
//         level: 1,
//         vit: 1,
//         // atributes to health
//         agi: 1,
//         // atributes to movement speed
//         str: 1,
//         // atributues to damage
//         luk: 1,
//         // attributes to probability of getting hit
//         currentXP: 0,
//     }
// }

var game = new Player(80, 280, 400, 160, 100, {level: 1, vit: 1, agi: 1, luk: 1, str: 1, currentXP: 0})
var player = game.player

var count = 0

var lvlTable = []
for(var i = 1; i < 100; i++) {
    lvlTable[i-1] = Math.floor((8 * i ** 2 / 10))
    // makes the curve for the amount of xp needed per level
}

var cyclops = {
    sprite: "cyclops.png",
}

var background = new Image(1440, 800)
background.src = "back3.png"

// main background

var titleBack = new Image(1440, 800)
titleBack.src = "Unknown.jpeg"

var titleButtonColor = "rgb(240, 0, 0)"

var mouseX = 0
var mouseY = 0
var click = false

var monsterPositions = [300, 500, 700, 900]
var currentPos = [true, false, false, false]
var monsterHealth = [1, 1, 1, 1]


function title() {
    if (dead == true) 
    {
    requestAnimationFrame(title)
    }

    else 
    {
        context.clearRect(0, 0, canvas.width, canvas.height)
        draw()
    }
    context.beginPath()
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.drawImage(titleBack, 0, 0)
    context.fillStyle = "gray"
    context.font = "normal 60px Lato"
    context.fillText("Click To Start!", 200, 200)

    if(click == true && mouseX > 400 && mouseX < 600 && mouseY > 400 && mouseY < 600) {
        shopBool = true
        shop()
    }

    if(click == true)
        {
            dead = false
        }
    context.fill()
    click = false
    
}

function levelUp() {
    if(statsAssigned == false) 
    {
        requestAnimationFrame(levelUp)
    }

    else 
    {
        context.clearRect(0, 0, canvas.width, canvas.height)
        draw()
    }

    context.beginPath()
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.drawImage(background, 0, 0)
    context.fillStyle = "black"
    context.font = "normal 30px Lato"
    context.fillText("Press 1 for agi    Press 2 for vit    Press 3 for str    Press 4 for luk", 150, 529)
    context.fill()

}

function shop() {
    if(shopBool) {
        requestAnimationFrame(shop)
    }
    else {
        title()
    }
    context.fill()
    context.beginPath()
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.drawImage(background, 0, 0)

}

function draw() 
{
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.drawImage(background, 0, 0)
    // timer
    count++
    levelSetup()
    //spawns enemies and moves the player to the right spot
    drawPlayer()
    drawEnemies()
    checkCollision()
    // assignes experience here as well
    if(statsAssigned == false) 
    {
        requestAnimationFrame(levelUp)
    }

    else if(dead == false) 
    {
        requestAnimationFrame(draw)
    }

    else if(dead == true) 
    {
        requestAnimationFrame(title)
    }
    context.fill()
}

function levelSetup() 
{
    if (player.x >= 960) 
    {
        level += 1
        hasBeenSetup = false
        player.x = 80
    }

    if(hasBeenSetup == true)
    {
        return
    }

    spawnEnemies()
    hasBeenSetup = true
}

function spawnEnemies() 
{
    for(var i = 0; i < monsterPositions.length; i++) 
    {
        if (Math.floor(Math.random() * 2) == 1) 
        {
            // one in 2 chance of spawning an enemy in a certain spot
            currentPos[i] = true
            monsterHealth[i] = level * 2
        }
    }
}

function drawEnemies() {
    for(var i = 0; i < 4; i++) 
    {
        if (currentPos[i] == true) 
        {
        var monster = new Image(player.w, player.h)
        monster.src = cyclops.sprite
        context.drawImage(monster, monsterPositions[i], player.y)
        }
    }
}

function restart() 
{
    player.health = 100 + player.stats.vit * 25 - 25
    player.x = 80
    level = 1
}

function drawPlayer() 
{
    if (player.x > 980) 
    {
        player.x = 960
    }

    if (player.x < 0) 
    {
        player.x = 20
    }

    if(player.stats.currentXP > lvlTable[player.stats.level-1])
    {
        statsAssigned = false
        player.stats.currentXP -= lvlTable[player.stats.level-1]
        player.stats.level++
    }
    if(count > lastMove && autoRun) 
        {
                player.x += 20 + player.stats.agi * 10 - 10
                lastMove = count
        }
    context.save()
    var playerIMG = new Image(player.w, player.h)
    playerIMG.src = player.sprite
    context.drawImage(playerIMG, player.x, player.y)
    context.fillStyle = "black"
    context.font = "normal 20px Lato"
    context.fillText("Health: " + player.health, 50, 50)
    context.fillText("Level: " + player.stats.level, 200, 50)
    context.fillText("Current XP: " + Math.floor(player.stats.currentXP), 350, 50)
    context.fillText("Time: " + Math.floor(count/60), 500, 50)
    context.fillText("Distance: " + level + " km", 650, 50)
    context.fill()
    context.restore()
}

function checkCollision() 
{
    for(var i = 0; i < currentPos.length; i++) 
    {
        var attackProb = Math.floor(Math.random() * 100)
        if (currentPos[i] == true) 
        {
            if (player.x + 120 > monsterPositions[i] && player.x + 80 < monsterPositions[i] + 40) 
            {
                monsterHealth[i] -= player.stats.str
                if(attackProb <= 70/player.stats.luk) 
                {
                    player.health -= level * 10
                }
                if(player.health <= 0) 
                {
                    player.health = 0
                    dead = true 
                    restart()
                }

                if(monsterHealth[i] <= 0) 
                {
                    currentPos[i] = false
                    player.stats.currentXP += level
                    attackProb = -1
                }

                else 
                {
                    player.x -= 40
                }

            }
        }
    }
}

function keyLetGo(event)
{
    switch(event.keyCode)
    {
        case 32:
            // Spacebar
            click = false

        case 37:
            // Left Arrow key
            player.movingLeft = false
            break

        case 39:
            // Right Arrow key
            player.movingRight = false
            break

    }
}

document.addEventListener('keyup', keyLetGo)

function keyPressed(event)
{
    switch(event.keyCode)
    {
        case 88:
            autoRun = autoRun ? false : true
            break
        case 32:
        // Spacebar
            click = true
            break
        case 37:
        // Left Arrow key
            if(count > lastMove) 
            {
                player.x -= 20 + player.stats.agi * 10 - 10
                lastMove = count
            }
            break
        case 39:
        // Right Arrow key
            if(count > lastMove && !autoRun) 
            {
                player.x += 20 + player.stats.agi * 10 - 10
                lastMove = count
            }
            break
        case 49:
        // number 1
            if (!statsAssigned) 
            {
                player.stats.agi++
                statsAssigned = true
            }
            break
        case 50:
        // number 2
            if (!statsAssigned) 
            {
                player.stats.vit++
                statsAssigned = true
            }
            break
        case 51:
        // number 3
            if (!statsAssigned)
            {
                player.stats.str++
                statsAssigned = true
            }
            break
        case 52:
        // number 4
            if (!statsAssigned) 
            {
                player.stats.luk++
                statsAssigned = true
            }
        break
    }
}

document.addEventListener('keydown', keyPressed)

canvas.addEventListener('click', function(evt) {  
    click = true
})

function setMouseXY(event)
{
    mouseX = event.clientX
    mouseY = event.clientY
}

title()