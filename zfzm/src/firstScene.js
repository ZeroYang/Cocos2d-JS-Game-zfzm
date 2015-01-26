
var firstLayer = cc.Layer.extend({

	gameTitle:null,
	sprite:null,

	ctor:function () {

		this._super();

		
		// 背景
		var bg = cc.LayerColor.create(cc.color(240,96,96,255));
		this.addChild(bg,-1);
		

		var size = cc.director.getWinSize();

		//标题
		this.gameTitle = cc.LabelTTF.create("全民寻找房祖名", "Arial", 38);
		// position the label on the center of the screen
		this.gameTitle.x = size.width / 2;
		//this.gameTitle.y = size.height - 40;
		this.gameTitle.y = 0;
		// add the label as a child to this layer
		this.addChild(this.gameTitle, 5);
		
		//说明
		var introLable = cc.LabelTTF.create("虽然柯少向龙叔保证不会带坏房祖名,\n但龙叔强烈要求你找回祖名。", "Arial", 18);
		introLable.attr({
			x:size.width/2,
			y:size.height - 100,
		});
		introLable.setColor(cc.color(255,225,0));
		this.addChild(introLable, 5);

		
		// add a "start" icon to start game
		var startItem = cc.MenuItemImage.create(
				res.startbtn_png,
				res.startbtn_png,
				function () {
					cc.log("startItem is clicked!");
					//cc.director.runScene(cc.TransitionPageTurn.create(1.0, new PlayScene(), true));
					cc.director.runScene( new PlayScene(), true);

				},this);
		startItem.attr({
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
				},this);
		moreItem.attr({
			x: size.width/2 + 80,
			y: 100,
			scale: 0.3,
			anchorX: 0.5,
			anchorY: 0.5
		});

		var menu = cc.Menu.create(startItem,moreItem);
		menu.x = 0;
		menu.y = 0;
		this.addChild(menu, 1);
		

		this.gameTitle.runAction(cc.Spawn.create(cc.MoveBy.create(2.5, cc.p(0, size.height - 40)),cc.TintTo.create(2.5,255,225,0)));

		return true;
	}
});

var firstScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var layer = new firstLayer();
		this.addChild(layer);
	}
});

