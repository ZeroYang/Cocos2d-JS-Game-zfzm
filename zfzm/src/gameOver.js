
var lv_txt = ["龙叔的脑残粉", "龙叔的忠实粉", "龙叔的路人粉", "慧眼识祖名", "火眼金睛", "洞察一切", "两眼冒光", "24k氪金眼", "已被亮瞎！"];

var gameOverLayer = cc.Layer.extend({

	scoreLabel:null,


	ctor:function (level) {

		this._super();


		// 背景
		var bg = cc.LayerColor.create(cc.color(167,67,67,255));
		this.addChild(bg,-1);


		var size = cc.director.getWinSize();

		//得分等级
		this.scoreLabel = cc.LabelTTF.create(lv_txt[0], "Arial", 38);
		// position the label on the center of the screen
		this.scoreLabel.x = size.width / 2;
		//this.gameTitle.y = size.height - 40;
		this.scoreLabel.y = 0;
		// add the label as a child to this layer
		this.addChild(this.scoreLabel, 1);
		this.scoreLabel.setColor(cc.color(0,0,0,255));


		// add a "again" icon to try again game
		var againItem = cc.MenuItemImage.create(
				res.againbtn_png,
				res.againbtn_png,
				function () {
					cc.log("againItem is clicked!");
					//cc.director.runScene(cc.TransitionPageTurn.create(1.0, new PlayScene(), true));
					cc.director.runScene(new PlayScene(), true);
				},this);
		againItem.attr({
			x: size.width/2 - 80,
			y: 100,
			scale: 0.3,
			anchorX: 0.5,
			anchorY: 0.5
		});
		// add a "more" icon to more game
		var moreItem = cc.MenuItemImage.create(
				res.morebtn_png,
				res.morebtn_png,
				function () {
					cc.log("moreItem is clicked!");
					//TODO 更多游戏
				},this);
		moreItem.attr({
			x: size.width/2 + 80,
			y: 100,
			scale: 0.3,
			anchorX: 0.5,
			anchorY: 0.5
		});

		var menu = cc.Menu.create(againItem,moreItem);
		menu.x = 0;
		menu.y = 0;
		this.addChild(menu, 1);


		this.scoreLabel.runAction(cc.Spawn.create(cc.MoveBy.create(2.5, cc.p(0, size.height - 100)),cc.TintTo.create(0,0,0,255)));

		this.setLevelText(level);
		
		return true;
	},
	
	setLevelText : function(lv) {
		var a = 20 > lv ? 0 : Math.ceil((lv - 20) / 10),
		txt = lv_txt[a];
		
		if (a > lv_txt.length) {
			a = lv_txt.length - 1;
			txt = lv_txt[a];
		}

		this.scoreLabel.setString(txt+"lv"+lv);
	},


});