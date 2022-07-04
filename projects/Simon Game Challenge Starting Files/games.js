var colors = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickPattern = [];
var level = 0;
var begin = 0;

$(document).keypress(function(){
    if(!begin){   
        $("#level-title").html("Level " + level);
        nextSequence();
        begin = !begin;
    }
})

function nextSequence(){
    level++;
    $("#level-title").html("Level " + level);
    userClickPattern = [];
    let random = Math.floor(Math.random()*4);
    let randomColor = colors[random];
    gamePattern.push(randomColor);
    $("#" + randomColor).fadeIn(100).fadeOut(100).fadeIn(100);
    playSound(randomColor);
}

$(".btn").click(function(){
    var color = $(this).attr("id");
    userClickPattern.push(color);
    playSound(color);
    animatePress(color);
    checkUserAnswer(userClickPattern.length - 1);
});

function playSound(color){
    var audioColor = new Audio("sounds/"+color+".mp3");
    audioColor.play();
}

function animatePress(currentColor){
    var self = "#"+currentColor;
    $(self).addClass("pressed");
    setTimeout(function(){
        $(self).removeClass("pressed");
    }, 100);
}

function checkUserAnswer(currentLevel){
    if(gamePattern[currentLevel] === userClickPattern[currentLevel]){
        if(userClickPattern.length  === gamePattern.length){
            setTimeout(function(){
                nextSequence();
            }, 1000);
        }
    }else{
        $("body").addClass("game-over");
        setTimeout(function(){
            $("body").removeClass("game-over");
        }, 200);
        $("#level-title").html("Game Over, Press Any Key to Restart");
        startOver();
    }
}

function startOver(){
    level = 0;
    gamePattern = [];
    userClickPattern = [];
    begin = false;
}