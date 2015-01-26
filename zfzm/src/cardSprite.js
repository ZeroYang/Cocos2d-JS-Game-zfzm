var cardSprite = cc.Sprite.extend({
	bgColor:null,//背景层
	isTrue:false,
	
	onEnter:function () {
		this._super();
		this.addBgLayer();
	},
	
	addBgLayer:function () {
		var size = this.getContentSize();
		this.bgColor = cc.LayerColor.create(cc.color(255,255,255,255),size.width,size.height);
		this.bgColor.attr({
			x : 0,
			y : 0,
			anchorX: 0.5,
			anchorY: 0.5
		});
		this.addChild(this.bgColor,-1);
	}
});
