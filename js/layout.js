define(["jquery",'i18n!nls/app'],function($, i18n) {
	var that = {
		$cardsWrapper : $("#cards-wrapper"),
		$gameWrapper : $("#game-wrapper")
	};

	/*Private functions*/
	function startGame(type) {
		var Game = require("game");
		switch(type){
			case "beginner" : 
			Game.startGame({ rows : 4 , cols : 4, matches: 2, bombs: 0, points: { start: 50, match: 50, error: -10, bonus: 25}});
			break;

			case "intermediate" : 
			Game.startGame({ rows : 6 , cols : 6, matches: 2, bombs: 0, points: { start: 100, match: 50, error: -10, bonus: 50}});
			break;

			case "expert" : 
			Game.startGame({ rows : 6 , cols : 6, matches: 3, bombs: 1, points: { start: 150, match: 70, error: -20, bonus: 100}});
			break;

			case "extreme" : 
			Game.startGame({ rows : 6 , cols : 6, matches: 4, bombs: 2, points: { start: 150, match: 100, error: -20, bonus: 100}});
			break;  

			default:
			console.log("No game type selected");
		}
	};

	/*Public functions*/
	that.loadGameLayout = function(){
		var Game = require("game");

		require(["text!../templates/bombs-panel.tpl", 
			"text!../templates/points-panel.tpl",
			"text!../templates/info-btn-panel.tpl",
			"text!../templates/moves-panel.tpl",
			"text!../templates/reset-btn-panel.tpl"]
			,function(bombs_html, points_html, info_btn_html, moves_html, reset_btn_html) {
				$(that.$gameWrapper).append(info_btn_html)
				.append(reset_btn_html);

				$.tmpl(points_html,{ i18n: i18n}).appendTo(that.$gameWrapper);
				$.tmpl(moves_html,{ i18n: i18n}).appendTo(that.$gameWrapper);

				that.updatePoints(Game.points); // set start points

				if(Game.options.bombs > 0){
					$.tmpl(bombs_html,{ bombs : new Array(Game.options.bombs)}).appendTo(that.$gameWrapper);
				}

				$(".panel").show();

				$("#info-btn-panel").on("click", function(ev) {
					var $info_btn = $(this);

					$(".panel-game").hide();

					require(["text!../templates/modal-message.tpl", "text!../templates/info-message.tpl"],function(modal_html, info_html){
						$.tmpl(modal_html,{ 
							id : "help-modal-panel",
							closebutton: true, 
							message: $.tmpl(info_html,{ i18n : i18n }).html(),
							button : null
						}).appendTo(that.$gameWrapper);

						var $close_btn = $("#help-modal-panel .modal-close-btn");

						$close_btn.show();
						$close_btn.on("click",function(){
							$("#help-modal-panel").remove();
							$close_btn.hide();
							$(".panel-game").show();
						});
					});
				});	

				$("#reset-btn-panel").on("click", function(ev) {
					$(this).hide();

					require(["text!../templates/prompt-message.tpl"],function(html){
						$.tmpl(html,{ id: "prompt-message-reset", message: i18n.game.restart, i18n: i18n}).appendTo(that.$gameWrapper);

						$(".panel").hide();

						$("#prompt-message-reset .btn-yes").on("click",function(){
							document.location.reload();
						});

						$("#prompt-message-reset .btn-no").on("click",function(){
							$("#prompt-message-reset").remove();
							$(".panel").show();
						});
					});
				});	
			}
			);
}


that.showEndGameLayout = function(win) {
	var Card = require("card");

	require(["text!../templates/modal-message.tpl"],function(html){
		var button = {
			id : "btn-restart",
			text : i18n.buttons.restart
		};

		if(win){
			$.tmpl(html,{ 
				id: "win-message",
				message: i18n.game.win,
				button : button
			}).appendTo(that.$gameWrapper);
		} else {
			$.tmpl(html,{ 
				id: "loose-message", 
				message: i18n.game.lose,
				button: button
			}).appendTo(that.$gameWrapper);

			Card.showCards(that.$cardsWrapper.find(".card"));
		}

		$("#reset-btn-panel, #info-btn-panel").hide();

		$("#btn-restart").click(function() {
			document.location.reload();
		});
	});
};

that.initStartLayout = function() {
	var Game = require("game");

	require(["text!../templates/game-options.tpl"],function(html){
		$.tmpl(html,{ i18n: i18n }).appendTo(that.$gameWrapper);

		$("#game-options-wrapper").on("click", ".game-option", function() {
			var type = $(this).data("type");

			startGame(type);

			$("#start-panel").hide();
		});

		$("#langs-wrapper .btn-lang[data-lang="+lang+"]").addClass("active");

		$("#langs-wrapper").on("click", ".btn-lang:not(.active)" ,function() {
			$("#langs-wrapper .btn-lang").removeClass("active");
			$(this).addClass("active");

			localStorage.setItem("lang", $(this).data("lang"));
			document.location.reload();
		});
	});
};

that.removeBomb = function(bombs){
	if(bombs === 0) $("#bombs-panel").remove();
	else $("#bombs-panel .bomb").eq(0).remove();
}

that.updatePoints = function(points){
	$("#points-panel > span").html(points);
}

that.updateMoves = function(moves){
	$("#moves-panel > span").html(moves);
};

that.responsiveFontSize = function() {
	var Game = require("game"),
	cardW = that.$cardsWrapper.width() * (1/Game.options.cols);

	that.$cardsWrapper.find("p").css("font-size", cardW * 0.7);
};


/*Listeners*/
$(window).resize(function() {
	that.responsiveFontSize();
});

return that;
});
