cc.game.onStart = function(){
    cc.view.adjustViewPort(true);
    cc.view.setDesignResolutionSize(320, 480, cc.ResolutionPolicy.SHOW_ALL);
    cc.view.resizeWithBrowserSize(true);
    //load resources
    cc._loaderImage = null;
    cc.LoaderScene.preload(g_resources, function () {
    	cc.director.runScene(new firstScene());
    }, this);
};
cc.game.run();