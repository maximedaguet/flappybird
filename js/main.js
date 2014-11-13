'use strict';

var game;
var pipes = new Array();
var length = 0;
var downId;
var interId;
var newPipeId;

window.addEventListener('load', init, false);

function init() {
    var pipe = function() {
        this.space = game.pipeSpace;
        this.width = 69;
        this.maxHeight = 282;
        this.minHeight = 138;
        this.height = Math.floor(Math.random() * (this.maxHeight - this.minHeight)) + this.minHeight;
        this.left = 600;
    };

    var bird = function() {
        this.posX = 225;
        this.posY = 305;
        this.width = 51;
        this.height = 36;
        this.showBird();
    };
    
    bird.prototype.showBird = function(){
        var div = document.createElement('div');
        div.id = 'bird';
        document.getElementById('game').appendChild(div);
        document.getElementById('bird').style.left = this.posX +'px';
        document.getElementById('bird').style.top = this.posY +'px';
        document.getElementById('bird').style.width = this.width +'px';
        document.getElementById('bird').style.height = this.height +'px';
    };
    
     bird.prototype.upBird = function(){
        this.posY -= 70;
        document.getElementById('bird').style.top = this.posY +'px';

        bird.checkCollisions();
     };
     
    bird.prototype.downBird = function(){
        downId = setInterval(function(){
            bird.posY += 1.5;
            document.getElementById('bird').style.top = bird.posY +'px'; 
            if(bird.posY >= game.limitBottom) {
                clearInterval(downId);
                document.getElementById('bird').classList.remove('animated-wings');
                document.getElementById('loose').style.display = 'block';
                game.started = 'loose';
                
            }

            bird.checkCollisions();
		},game.speed);
     };

     bird.prototype.checkCollisions = function(){
        for(var i =0; i < pipes.length; i ++){
            if((bird.posX + bird.width) > pipes[i].left && bird.posX < (pipes[i].left + bird.width)){
                if((bird.posY + bird.height) > (540 - pipes[i].height)
                ||
                (bird.posY < (540 - pipes[i].space - pipes[i].height))){
                    clearInterval(downId);
                    clearInterval(interId);
                    clearInterval(newPipeId);
                    
                    document.getElementById('bird').style.top = game.limitBottom + 'px';
                    document.getElementById('bird').classList.remove('animated-wings');
                    document.getElementById('loose').style.display = 'block';
                    game.started = 'loose';

                }
            }
        }
     };
    
    game = function(speed, pipeSpace){
		this.points = 0;
        this.speed = speed;
        this.started = 'no';
        this.backgroundPosX = 0;
        this.limitBottom = 508;
        this.limitTop = 0;
        this.pipeSpace = pipeSpace;
	};
    
    game.prototype.initGame = function(){
		bird = new bird();
	};

    game.prototype.createPipe = function(){
        var divTop = document.createElement('div');
        divTop.setAttribute('data-id',pipes.length);
        divTop.setAttribute('class','pipe-bottom');
        divTop.style.left = pipes[length].left + 'px';
        divTop.style.width = pipes[length].width + 'px';
        divTop.style.height = pipes[length].height + 'px';

        var divBottom = document.createElement('div');
        divBottom.setAttribute('data-id',pipes.length);
        divBottom.setAttribute('class','pipe-top');
        divBottom.style.left = pipes[length].left + 'px';
        divBottom.style.width = pipes[length].width + 'px';
        divBottom.style.height = (520 - pipes[length].space - pipes[length].height) + 'px';

        document.getElementById('game').appendChild(divTop);
        document.getElementById('game').appendChild(divBottom);
    };

    game.prototype.movePipes = function(){
        for(var i = 0; i < pipes.length; i++){
            pipes[i].left -= 2;

            var pipeDivTop = document.getElementsByClassName('pipe-top');
            var pipeDivBottom = document.getElementsByClassName('pipe-bottom');

            pipeDivTop[i].style.left = pipes[i].left + 'px';
            pipeDivBottom[i].style.left = pipes[i].left + 'px';
        }
    };
    
    game.prototype.playGame = function(){
        document.getElementById('bird').classList.add('animated-wings');
        
		interId = setInterval(function(){
            game.backgroundPosX -= 2;
			document.getElementById('ground').style.backgroundPositionX = game.backgroundPosX + 'px';

            if(pipes.length > 0){
                game.movePipes();
            }

            if(bird.posY >= game.limitBottom) {
                clearInterval(interId);
            }
		},this.speed);
        
        newPipeId = setInterval(function(){
            length = pipes.length;
            pipes[length] = new pipe();

            game.createPipe();

            if(bird.posY >= game.limitBottom) {
                clearInterval(newPipeId);
            }
        },1500);
	};

	/**
	*	On lance la partie
	**/
    game = new game(10, 150);
    game.initGame();
    document.addEventListener('keypress', startGame, false);
    
    function startGame(evt) {
        var keydown = evt.keyCode;
        if(game.started == 'no' && keydown == 32) {
            game.playGame();
            game.started = 'yes';
            bird.downBird();
        }else if(game.started == 'yes' && keydown == 32){
            bird.upBird();
        }
    };
    
}