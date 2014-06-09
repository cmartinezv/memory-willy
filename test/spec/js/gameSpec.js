define(["game"],function(Game) {
	describe("Game 4x4", function() {
		function initGame() {
			Game.startGame({ 
				rows : 4 , 
				cols : 4, 
				matches: 2, 
				bombs: 1, 
				points: { 
					start: 50,
					match: 50, 
					error: -10, 
					bonus: 25
				}
			});
		};
		

		describe("Initialization", function() {
			beforeEach(function() {
				initGame();
			});

			it("4 rows and 4 columns = 16 cards", function() {
				expect(Game.cards).toBe(16);
			});

			it("bombs init", function() {
				expect(Game.bombs).toBe(Game.options.bombs);
			});

			it("starting points", function() {
				expect(Game.points).toBe(Game.options.points.start);
			});

			it("matches to be 2", function() {
				expect(Game.options.matches).toBe(2);
			});

			it("points init OK", function() {
				expect(Game.options.points).toEqual({
					bonus : 25,
					error : -10,
					match : 50,
					start: 50
				});
			});

			it("flag Game finished to be false", function() {
				expect(Game.bGameFinished).toBe(false);
			});
		});

		describe("Game end", function() {
			beforeEach(function() {
				initGame();
			});

			it("flag Game finished to be true", function() {
				expect(Game.bGameFinished).toBe(false);
				Game.endGame({ win: true });
				expect(Game.bGameFinished).toBe(true);
			});

			it("end game points equal 0", function() {
				expect(Game.bGameFinished).toBe(false);
				expect(Game.points).toBe(Game.options.points.start);
				Game.updatePoints(-Game.options.points.start);
				expect(Game.points).toBe(0);
				expect(Game.bGameFinished).toBe(true);
			});
		});

		describe("Game engine", function() {
			beforeEach(function() {
				initGame();
			});

			it("update moves", function() {
				expect(Game.moves).toBe(0);
				Game.updateMoves();
				expect(Game.moves).toBe(1);
			});

			it("update points", function() {
				expect(Game.points).toBe(Game.options.points.start);
				Game.updatePoints(20);
				expect(Game.points).toBe(Game.options.points.start+20);
			});

			it("update solved cards", function() {
				expect(Game.solved).toBe(0);
				Game.updateSolvedCards();
				expect(Game.solved).toBe(Game.options.matches);
			});

			it("apply bomb", function() {
				expect(Game.bombs).toBe(Game.options.bombs);
				Game.applyBomb();
				expect(Game.bombs).toBe(Game.options.bombs-1);
			});
		});
	});
});