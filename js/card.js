define(["jquery", 'hammer', 'layout' ],function($, Hammer, Layout) {
	var that = {};

	/*Private functions*/

	/* Check if all data have the same value */
	function checkIdentities(data) {
		var equal = true;

		for (var i = 0; i < data.length - 1; i++) {
			if($(data[i]).data("solution") !== $(data[i+1]).data("solution")){
				equal = false;
				break;				
			}   
		};

		return equal;
	};


	/*Public functions*/

	// Create a card with random num and remove it from numbers array
	that.createCard = function () {
		var Game = require("game"),	
			numbers = Game.numbers;

		var rand_index = Math.floor(Math.random()*numbers.length);
		var $el = $('<div class="card back"><p>0</p></div>');
		$el.data("solution", numbers[rand_index]);
		if(numbers[rand_index] === 0){ //Bonus
			$el.data("bonus", true);
		}
		$el.css({
			"height": Game.rowH,
			"width" : Game.rowW			
		});

		numbers.splice(rand_index,1);

		return $el;
	}; 

	that.hideCards = function($cards){
		setTimeout(function(){
			$cards.addClass("remove-animated");	
		},500);

		setTimeout(hidingCard,1000);

		function hidingCard(){
			$cards.addClass('back')
				 .removeClass("selected animated front remove-animated")
				 .find("p").text("0")
				 		   .removeClass("bonus ir");
		}
	}

	that.showCards = function($cards){
		var $p, $el;
		$cards.removeClass('back')
			.addClass("animated front")
		   	.each(function(idx, el){
		   		$el = $(el);
		   		$p = $el.find("p");
		   		$p.text($el.data("solution"));

		   		if($el.data("bonus")){
					$p.addClass("bonus ir");
				}
		   	});
	}


	//Listeners
	Layout.$cardsWrapper.on("click",".card:not(.animated)", function(ev) {
		var Game = require("game");

		ev.stopPropagation();

		$(this).addClass('selected');

		var count = $(".card.selected"),
			selected = count.length,
			bonus = $(this).data("bonus");

		if(selected <= Game.options.matches){
			that.showCards($(this));

			if(selected === Game.options.matches){
				Game.updateMoves();
				if(checkIdentities(count)){
					count.removeClass("selected");
					Game.updateSolvedCards();
					Game.updatePoints(bonus ? Game.options.points.match+Game.options.points.bonus : Game.options.points.match);
				} else {
					Game.updatePoints(Game.options.points.error);
					if(!Game.bGameFinished) that.hideCards(count);
				} 
			}
		} else {
			count.removeClass("selected");
		}
	});

	Hammer(Layout.$cardsWrapper.get(0)).on("hold", function(e) {
		var Game = require("game");

		if( e.target && $(e.target).hasClass('card back')) {
			if(Game.options.bombs > 0){
				Game.applyBomb(e.target);
			}
    	}
	});

	return that;
});
