var IMAGE_WIDTH = 100,
	SPACE_WIDTH = 5;

var PlayLayer = cc.Layer.extend({
	bg:null,
	levelLabel:null,
	level:1,
	timeoutLabel:null,
	timeout:60,
	map:null,
	cards:null,
	row:2,
	col:2,


	ctor:function () {
		//////////////////////////////
		// 1. super init first
		this._super();

		// ask director the window size
		var size = cc.director.getWinSize();

		// add "backgorung1_png" splash screen"
		// 背景
		this.bg = cc.LayerColor.create(cc.color(240,96,96,255));
		this.addChild(this.bg,-1);

		//level
		this.levelLabel = cc.LabelTTF.create("过关："+this.level, "Arial", 30);
		this.levelLabel.x = size.width / 2;
		this.levelLabel.y = size.height - 40;
		this.addChild(this.levelLabel, 5);
		
		// timeout 60
		this.timeoutLabel = cc.LabelTTF.create("" + this.timeout, "Arial", 30);
		this.timeoutLabel.x = size.width / 2;
		this.timeoutLabel.y = 40;
		this.addChild(this.timeoutLabel, 5);
		
		//timer倒计时60
		this.schedule(this.timer,1,this.timeout,1);
		//schedule / scheduleOnce / scheduleUpdate

		
		//游戏棋盘
		this.map = new cardSprite();
		this.map.attr({
			x : size.width/2,
			y : size.height/2,
			anchorX: 0.5,
			anchorY: 0.5
		});
		this.map.setContentSize(cc.size(size.width - 20,size.width - 20));
		//this.map.init();
		this.addChild(this.map,1);
		
		
		this.initMatrix(this.row, this.col);
		
		//touchEvent
		var touchListener = this.createEventListener();
		cc.eventManager.addListener(touchListener,this.map);
		
		return true;
	},

	timer : function() {
		
		if (this.timeout == 0) {
			//alert('游戏结束');
			
			var gameOver = new gameOverLayer(this.level);
			
			this.getParent().addChild(gameOver);
			
			return;
		}

		this.timeout -=1;
		this.timeoutLabel.setString("" + this.timeout);

	},
	
	updateLevel : function() {
		this.level += 1;
		this.levelLabel.setString("过关：" + this.level);
		
		this.updateMap();
	},
	
	
	initMatrix : function(row, col) {

		this.cards = [];
		var size = this.map.getContentSize();

		var cardwidth = 0;

		//SPACE_WIDTH * (row + 1) + cardwidth * row = size.width;
		cardwidth = size.width - SPACE_WIDTH * (row + 1);
		cardwidth = cardwidth/row;
		var count = row * col;
		cc.log("cardwidth="+cardwidth);
		for (var i = 0; i < row; i++) {
			this.cards.push([]);
			for (var j = 0; j < col; j++) {
				var card = new cardSprite(res.Fanfalse_png);
				card.attr({
					x : SPACE_WIDTH  + (cardwidth/2+SPACE_WIDTH) * i  +  cardwidth/2*(i+1),
					y : SPACE_WIDTH + (cardwidth/2+SPACE_WIDTH) * j +  cardwidth/2*(j+1),
					anchorX: 0.5,
					anchorY: 0.5
				});
				cc.log("i="+i+"j="+j);
				cc.log("card.x="+card.x);
				cc.log("card.y="+card.y);
				
				card.setScale(cardwidth/IMAGE_WIDTH);
				this.map.addChild(card,10);
				this.cards[i][j] = card;
			}
		}

		this.setRandomFantrue();
	},
	
	
	createEventListener : function() {
		var touchListener = cc.EventListener.create({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			// When "swallow touches" is true, then returning 'true' from the onTouchBegan method will "swallow" the touch event, preventing other listeners from using it.
			swallowTouches: true,
			//onTouchBegan event callback function                      
			onTouchBegan: function (touch, event) { 
  
				//var touch = touches[0];
				var pos = touch.getLocation();
				
				cc.log("pos.x="+pos.x+",pos.y="+pos.y);
				
				var target = event.getCurrentTarget();  

				//将touch点坐标转到map,判断点中的是map上的哪个card,并判断是否找对
				var locationInNode = target.convertToNodeSpace(pos);
				cc.log("locationInNode.x="+locationInNode.x+",locationInNode.y="+locationInNode.y);
				
				pos = locationInNode;
				
				cc.log("touchEvent!")
				var player = target.getParent();
				for (var r = 0; r < player.row; r++) {
					for (var c = 0; c < player.col; c++) {

						var card = player.cards[r][c];
						cc.log("r="+r+"c="+c);

						var rect = card.getBoundingBox();
						cc.log("rect.x="+rect.x+"rect.y="+rect.y);

						if ( cc.rectContainsPoint(rect,pos)) {

							if(card.isTrue) {

								
								//TODO 更新map，card的布局
								player.resetCard(card);
								
								player.updateLevel();
							}
							
							break;
						}
					}
				}
				
				return false;
			}
		});
		
		return touchListener;
	},
	
	updateMap : function() {
		if (this.level === 15) {
			//3*3
			this.row = 3;
			this.col = 3;
			this.expandCards(this.row, this.col);
		} else if(this.level === 40) {
			//4*4
			this.row = 4;
			this.col = 4;
			this.expandCards(this.row, this.col);
		} else if(this.level === 60) {
			//5*5
			this.row = 5;
			this.col = 5;
			this.expandCards(this.row, this.col);
		} else if(this.level === 70) {
			//5*5
			this.row = 6;
			this.col = 6;
			this.expandCards(this.row, this.col);
		} 
		this.setRandomFantrue();
		this.updateBgcolor();
	},
	
	//扩展更多card
	expandCards : function(row,col) {
		var size = this.map.getContentSize();
		var cardwidth = 0;

		//SPACE_WIDTH * (row + 1) + cardwidth * row = size.width;
		cardwidth = size.width - SPACE_WIDTH * (row + 1);
		cardwidth = cardwidth/row;
		var count = row * col;
		cc.log("cardwidth="+cardwidth);
		
		
		//update layout 更新坐标 & add new card
		for (var r = 0; r < this.row; r++) {
			if (undefined === this.cards[r]) {
				this.cards.push([]);
			}
			for (var c = 0; c < this.col; c++) {

				var card = this.cards[r][c];
				if (undefined === card) {
					card = new cardSprite(res.Fanfalse_png);
					card.attr({
						x : SPACE_WIDTH  + (cardwidth/2+SPACE_WIDTH) * r  +  cardwidth/2*(r+1),
						y : SPACE_WIDTH + (cardwidth/2+SPACE_WIDTH) * c +  cardwidth/2*(c+1),
						anchorX: 0.5,
						anchorY: 0.5
					});
					card.setScale(cardwidth/IMAGE_WIDTH);
					this.map.addChild(card,10);
					this.cards[r][c] = card;
				}else {
					card.x = SPACE_WIDTH  + (cardwidth/2+SPACE_WIDTH) * r  +  cardwidth/2*(r+1);
					card.y = SPACE_WIDTH + (cardwidth/2+SPACE_WIDTH) * c +  cardwidth/2*(c+1);
					card.setScale(cardwidth/IMAGE_WIDTH);
				}
			}
		}
	},
	
	resetCard : function(card) {
		cc.log("-----------------resetcard");
		var temp = cc.SpriteFrame.create(res.Fanfalse_png,cc.rect(0,0,IMAGE_WIDTH,IMAGE_WIDTH));
		card.setSpriteFrame(temp);
		card.isTrue = false;
	},
	
	
	setRandomFantrue : function() {
		var r = Math.ceil( Math.random() * this.row - 1 );
		var c = Math.ceil( Math.random() * this.col - 1 );

		cc.log("-----------------setRandomFantrue"+"r="+r+"c="+c);
		var temp = cc.SpriteFrame.create(res.Fantrue_png,cc.rect(0,0,IMAGE_WIDTH,IMAGE_WIDTH));
		//var card = this.cards[randomIndex];
		var card = this.cards[r][c];
		card.setSpriteFrame(temp);
		card.isTrue = true;
	},
	
	updateBgcolor : function() {

		var randomR = Math.ceil( Math.random() * 255);
		var randomG = Math.ceil( Math.random() * 255);
		var randomB = Math.ceil( Math.random() * 255);
		
		for (var r = 0; r < this.row; r++) {
			for (var c = 0; c < this.col; c++) {
				var card = this.cards[r][c];
				
				//updateBgcolor
				card.bgColor.setColor(cc.color(randomR,randomG,randomB,255));
			}
		}
	},
	
//	onExit : function() {
//		//TODO release
//
//	},
});

var PlayScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var layer = new PlayLayer();
		this.addChild(layer);
	}
});