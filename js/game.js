define(["jquery","jquery-tmpl","card", "layout", "i18n!nls/app"],function($, tmpl, Card, Layout, i18n) {
	var that = {
		start:  function() {},
		bGameFinished : false,
		numbers : [],
		cards : 0,
		bombs: 0,
		points : 0,
		moves : 0,
		solved : 0,
		options : {}
	};

	// Public functions

	/* Trigger a bombs that shows all the current row */
	that.applyBomb = function(card) {
		var index = $(card).index(),
			x = index % that.options.rows,
			row = [];

		Layout.removeBomb(--that.bombs);

		function getRow(fn){
			for(var i=0; i <= x; i++){
				fn.call(this, Layout.$cardsWrapper.children().eq(index-i));
			}
			for(var j=1; j <= (that.options.rows - i); j++){
				fn.call(this, Layout.$cardsWrapper.children().eq(index+j));
			}
		}

		getRow(Card.showCards);

		setTimeout(function(){
			getRow(Card.hideCards);
		},1000);
	}

	/* Start a game */
	that.startGame = function( opt ) {
		var default_options = {
			cols : 4,
			bombs : 0,
			rows : 4,
			matches : 2,
			points : {
				start : 100,
				match : 50,
				error : -10
			}
		};

		opt = $.extend({} ,default_options , opt);  // extend default options
		that.options = opt; //publish options
		
		that.cards = opt.rows*opt.cols, //total cards
		that.rowH = 100/opt.rows+"%",
		that.rowW = 100/opt.cols+"%";
		that.points = opt.points.start;
		that.bombs = opt.bombs;
		that.bGameFinished = false;

		Layout.$cardsWrapper.outerHeight(Layout.$gameWrapper.outerHeight());

		//Create array of numbers
		that.numbers = [];
		for (var i = 0; i < that.cards / opt.matches; i++){
			for (var j = 0; j < opt.matches; j++) {
				that.numbers.push(i);
			};
		}  

		for (var i = 0; i < that.cards; i++) {
			Layout.$cardsWrapper.append(Card.createCard());
		};

		//Set font-size relative to main width
		Layout.responsiveFontSize();

		Layout.loadGameLayout();
	}

	/* Show the message when the game ends*/
	that.endGame = function(obj) {
		that.bGameFinished = true;

		Layout.showEndGameLayout(obj.win);
	};

	/* Update points counter */
	that.updatePoints = function(n) {
		that.points += n;
		if(that.points <= 0){
			that.endGame({ win: false });
		}
		Layout.updatePoints(that.points);
	};

	/* Update moves counter */
	that.updateMoves = function() {
		Layout.updateMoves(++that.moves);
	};

	/* Update internal solved cards count */
	that.updateSolvedCards = function () {
		that.solved += that.options.matches;
		if(that.solved === that.cards) that.endGame({ win: true });
	}

	return that;
});