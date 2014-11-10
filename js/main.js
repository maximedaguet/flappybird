'use strict'

var game;

window.addEventListener('load', init, false);

function init () {
    var bird = function() {
		this.posX = 225;
        this.posY = 305;
        this.width = 34;
        this.height = 24;
        this.showBird();
	}
    
    bird.prototype.showBird = function(){
        var div = document.createElement('div');
        div.id = 'bird';
        document.getElementById('game').appendChild(div);
        document.getElementById('bird').style.left = this.posX +'px';
        document.getElementById('bird').style.top = this.posY +'px';
        document.getElementById('bird').style.width = this.width +'px';
        document.getElementById('bird').style.height = this.height +'px';
    }
    
     bird.prototype.upBird = function(){
        this.posY -= 70;
        document.getElementById('bird').style.top = this.posY +'px';
     }
     
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
     }
    
    game = function(speed){
		this.points = 0;
        this.speed = speed;
        this.started = 'no';
        this.backgroundPosX = 0;
        this.limitBottom = 520;
        this.limitTop = 0;
	}
    
    game.prototype.initGame = function(){
		bird = new bird();
	}
    
    game.prototype.playGame = function(){
        document.getElementById('bird').classList.add('animated-wings');
        
		var interId = setInterval(function(){
            game.backgroundPosX -= 2;
			document.getElementById('ground').style.backgroundPositionX = game.backgroundPosX + 'px'; 
            if(bird.posY >= game.limitBottom) {
                clearInterval(interId);
            }
		},this.speed);
	}

	/**
	*	On lance la partie
	**/
    game = new game(10);
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
    }
    
}