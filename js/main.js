'use strict';

var game; 
var pipes = new Array(); // Tableau dans lequel sont ajoutés les tuyaux
var length = 0; 
var downId; // Interval du timer qui fait descendre l'oiseau
var speedId; // Interval du timer qui fait bouger le sol et les tuyaux
var newPipeId; // Interval du timer ajoute des nouveaux tuyaux au tableau

window.addEventListener('load', init, false);

function init() {
    var pipe = function() {
        this.space = game.pipeSpace;
        this.width = 69;
        this.maxHeight = 340;
        this.minHeight = 50;
        this.height = Math.floor(Math.random() * (this.maxHeight - this.minHeight)) + this.minHeight;
        this.left = 600;
    };

    var bird = function() {
        this.posX = 225;
        this.posY = 305;
        this.width = 51;
        this.height = 36;
        this.score = 0;
        this.up = 0;
        this.rotation = 1;
        this.showBird();
    };
    
    bird.prototype.showBird = function(){
        // On attribue des propriétés à l'oiseau et on l'ajoute au DOM dans la balise #game
        var div = document.createElement('div');
        div.id = 'bird';
        document.getElementById('game').appendChild(div);
        document.getElementById('bird').style.left = this.posX +'px';
        document.getElementById('bird').style.top = this.posY +'px';
        document.getElementById('bird').style.width = this.width +'px';
        document.getElementById('bird').style.height = this.height +'px';
    };
    
     bird.prototype.upBird = function(){
        // Gestion du saut de l'oiseau
        if (this.up == 0){
            clearInterval(downId);
            this.posY -= 60;
            bird.rotation = -20;
            $( "#bird" ).animate({
                top: this.posY,
                '-webkit-transform' : 'rotate('+ bird.rotation +'deg)',
                 '-moz-transform' : 'rotate('+ bird.rotation +'deg)',
                 '-ms-transform' : 'rotate('+ bird.rotation +'deg)',
                 'transform' : 'rotate('+ bird.rotation +'deg)'
            }, 100, function() {
                this.up = 1;
                bird.checkCollisions();
                bird.checkPoints();
                bird.downBird();
            });
        }
        //document.getElementById('bird').style.top = this.posY +'px';

        //bird.checkCollisions();
        //bird.checkPoints();
        //bird.downBird();
     };
     
    bird.prototype.downBird = function(){
        // Gestion de la gravité
        downId = setInterval(function(){
            bird.posY += 1.75;
            bird.rotation += 1;
            if (bird.rotation >= 90){
                bird.rotation = 90;
            }
            document.getElementById('bird').style.top = bird.posY +'px'; 
            $("#bird").css({'-webkit-transform' : 'rotate('+ bird.rotation +'deg)',
                 '-moz-transform' : 'rotate('+ bird.rotation +'deg)',
                 '-ms-transform' : 'rotate('+ bird.rotation +'deg)',
                 'transform' : 'rotate('+ bird.rotation +'deg)'});

            bird.checkCollisions();
            bird.checkPoints();
		},game.speed);
     };

     bird.prototype.checkCollisions = function(){
        // Vérifie les collisions
        if(bird.posY >= game.limitBottom) {
            clearInterval(downId);
            clearInterval(speedId);
            clearInterval(newPipeId);
            
            document.getElementById('bird').classList.remove('animated-wings');
            document.getElementById('loose').style.display = 'block';
            game.started = 'loose';

            if(getCookie('bestscore') < bird.score){
                createCookie('bestscore',bird.score,365);
            }

            document.getElementById('bestscore').innerHTML = getCookie('bestscore');
            document.getElementById('bestscore').style.display = 'block';
        }

        for(var i =0; i < pipes.length; i ++){
            if((bird.posX + bird.width) > pipes[i].left && bird.posX < (pipes[i].left + bird.width)){
                if((bird.posY + bird.height) > (540 - pipes[i].height)
                ||
                (bird.posY < (540 - pipes[i].space - pipes[i].height))){
                    clearInterval(downId);
                    clearInterval(speedId);
                    clearInterval(newPipeId);

                    
                    $('#bird').animate({top: game.limitBottom + 'px'},600);
                    //document.getElementById('bird').style.top = game.limitBottom + 'px';
                    document.getElementById('bird').classList.remove('animated-wings');
                    document.getElementById('loose').style.display = 'block';
                    game.started = 'loose';

                    if(getCookie('bestscore') < bird.score){
                        createCookie('bestscore',bird.score,365);
                    }

                    document.getElementById('bestscore').innerHTML = getCookie('bestscore');
                    document.getElementById('bestscore').style.display = 'block';
                }
            }
        }
     };

     bird.prototype.checkPoints = function(){
        // Vérifie les points, met à jour le score et change le fond 
        for(var i =0; i < pipes.length; i ++){
            if(bird.posX == pipes[i].left + pipes[i].width){
                bird.score++;

                document.getElementById('score').innerHTML = bird.score;
                
                var bg = bird.score;
                switch (true) {
                    case (bg > 4 && bg < 10):
                        document.getElementById('game').style.backgroundImage = "url(img/background2.png)";
                        break;
                    case (bg > 9 && bg < 15):
                        document.getElementById('game').style.backgroundImage = "url(img/background3.png)";
                        break;
                    case (bg > 14):
                        document.getElementById('game').style.backgroundImage = "url(img/background4.png)";
                        break;
                    default:
                        document.getElementById('game').style.backgroundImage = "url(img/background.png)";
                        break;
                }
            }
        }
     };
    
    var game = function(speed, pipeSpace){
		this.points = 0;
        this.speed = speed;
        this.started = 'no';
        this.backgroundImg = 'img/background.png';
        this.backgroundPosX = 0;
        this.limitBottom = 508;
        this.limitTop = 0;
        this.pipeSpace = pipeSpace;
	};
    
    game.prototype.initGame = function(){
		document.getElementById('game').style.backgroundImage = "url(" + game.backgroundImg + ")";
        bird = new bird(); // Instancier un nouvel oiseau 
	};
    
    game.prototype.startGame = function(evt){
        var keydown = evt.keyCode; 
        // Si le jeu n'était pas commencé et qu'on appuye sur la touche espace, on lance le jeu
        if(game.started == 'no' && keydown == 32) {
            game.playGame();
            game.started = 'yes';
            bird.downBird();
            
        // Sinon, si le jeu est commencé, on fait sauter l'oiseau
        }else if(game.started == 'yes' && keydown == 32){
            bird.upBird();
        }
    };
    
    game.prototype.playGame = function(){
        // On ajoute une class qui anime les ailes de l'oiseau
        document.getElementById('bird').classList.add('animated-wings');
        // On supprime le texte d'aide de début de partie
        document.getElementById('pressSpace').style.display = 'none';        
        
        // On lance un timer qui en fonction de la vitesse choisie, anime le sol et les tuyaux si il y en a
		speedId = setInterval(function(){
            game.backgroundPosX -= 2;
			document.getElementById('ground').style.backgroundPositionX = game.backgroundPosX + 'px';

            if(pipes.length > 0){
                game.movePipes();
            }
		},this.speed);
        
        // On lance un timer qui ajoute un objet tuyau au tableau des tuyaux toutes les 1750ms
        newPipeId = setInterval(function(){
            length = pipes.length;
            pipes[length] = new pipe();

            game.createPipe();
        },1750);
	};

    game.prototype.createPipe = function(){
        // Défini les propriétés des tuyaux haut et bas et les ajoutes au DOM dans la balise #game
        
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
        // Gestion du déplacement des tuyaux
        for(var i = 0; i < pipes.length; i++){
            pipes[i].left -= 2;

            var pipeDivTop = document.getElementsByClassName('pipe-top');
            var pipeDivBottom = document.getElementsByClassName('pipe-bottom');

            pipeDivTop[i].style.left = pipes[i].left + 'px';
            pipeDivBottom[i].style.left = pipes[i].left + 'px';
        }
    };

	/**
	*	On lance la partie
	**/
    
    var game = new game(10, 150); // On créé une partie avec une vitesse de 10 et Un espace tuyaux de 150
    game.initGame();
    document.addEventListener('keydown', game.startGame, false);

    var createCookie = function(name, value, days) {
        var expires;
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toGMTString();
        }
        else {
            expires = "";
        }
        document.cookie = name + "=" + value + expires + "; path=/";
    }

    function getCookie(c_name) {
        if (document.cookie.length > 0) {
            var c_start = document.cookie.indexOf(c_name + "=");
            if (c_start != -1) {
                c_start = c_start + c_name.length + 1;
                var c_end = document.cookie.indexOf(";", c_start);
                if (c_end == -1) {
                    c_end = document.cookie.length;
                }
                return unescape(document.cookie.substring(c_start, c_end));
            }
        }
        return "";
    }    
}