'use strict';

var game;
var pipes = [];

window.addEventListener('load', init, false);

function init() {
    var bird = function() {
		this.posX = 225;
        this.posY = 305;
        this.width = 34;
        this.height = 24;
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
     };
     
    bird.prototype.downBird = function(){
        var downId = setInterval(function(){
            bird.posY += 1.5;
            document.getElementById('bird').style.top = bird.posY +'px'; 
            if(bird.posY >= game.limitBottom) {
                clearInterval(downId);
                document.getElementById('bird').classList.remove('animated-wings');
                document.getElementById('restart').style.display = 'block';
                game.started = 'loose';
                
            }
		},game.speed);
     };
    
    var pipe = function() {
        this.space = game.pipeSpace;
        this.width = 69;
        this.maxHeight = 282;
        this.minHeight = 138;
        this.height = Math.floor(Math.random() * (this.maxHeight - this.minHeight)) + this.minHeight;
        this.left = 600;
    };
    
    pipe.prototype.createPipe = function() {
        var pipeBottom = document.createElement('div');
        pipeBottom.classList.add('pipe');
        pipeBottom.classList.add('pipe-bottom');
        pipeBottom.style.width = pipe.width +'px'; 
        pipeBottom.style.height = pipe.height +'px'; 
        pipeBottom.style.left = pipe.left+'px';
        document.getElementById('game').appendChild(pipeBottom);
        
        var pipeTop = document.createElement('div');
        pipeTop.classList.add('pipe');
        pipeTop.classList.add('pipe-top');
        pipeTop.style.width = pipe.width +'px'; 
        pipeTop.style.height = (520 - pipe.height - pipe.space) +'px'; 
        pipeTop.style.left = pipe.left+'px';
        document.getElementById('game').appendChild(pipeTop);  
    };
    
//    pipe.prototype.showPipe = function() {
//        var divPipes = document.getElementsByClassName('pipe');
//        for(var i = 0; i < divPipes.length; i++){
//            divPipes[i].style.left = pipes[i].left + 'px';
//        }
//    };
    
//    pipe.prototype.movePipe = function(){
//        var pipesId = setInterval(function(){
//            for(var i = 0; i < pipes.length; i++){
//                pipes[i].left -= 1;
//            } 
//            if(bird.posY >= game.limitBottom) {
//                clearInterval(pipesId);
//            }
//		},game.speed);
//    }
    
    game = function(speed, pipeSpace){
		this.points = 0;
        this.speed = speed;
        this.started = 'no';
        this.backgroundPosX = 0;
        this.limitBottom = 520;
        this.limitTop = 0;
        this.pipeSpace = pipeSpace;
	};
    
    game.prototype.initGame = function(){
		bird = new bird();
	};
    
    game.prototype.playGame = function(){
        document.getElementById('bird').classList.add('animated-wings');
        
		var interId = setInterval(function(){
            game.backgroundPosX -= 2;
			document.getElementById('ground').style.backgroundPositionX = game.backgroundPosX + 'px'; 
            if(bird.posY >= game.limitBottom) {
                clearInterval(interId);
            }
		},this.speed);
        
        var newPipesId = setInterval(function(){
            var newPipe = [];
            newPipe = new pipe();
            pipes[pipes.length] = newPipe;
//            pipes[pipes.length - 1].createPipe();
//            pipes[pipes.length - 1].movePipe();
            
            console.log(pipes);
            
            if(bird.posY >= game.limitBottom) {
                clearInterval(newPipesId);
            }
		},1000);
	};

	/**
	*	On lance la partie
	**/
    game = new game(10, 100);
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