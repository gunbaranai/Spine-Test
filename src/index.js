const app = new PIXI.Application();
document.body.appendChild(app.view);

app.stop();

// loader option to specify textures
let atlasLoaderOptions = { metadata: {
	images: {
		"page_0": PIXI.BaseTexture.fromImage(spriteTextureLink),
		"page_1": PIXI.BaseTexture.fromImage(spriteWeaponLink)
	}
}};

// load spine data
PIXI.loader
    .add('atlas', spriteAtlasLink, atlasLoaderOptions)
    .load(onAssetsLoaded);

let sprite = null;

function onAssetsLoaded(loader, res) {

	// parse raw skeleton data from json
	$.ajax({
		url: spriteJsonLink,
		async: false,
		dataType: 'json',
		success: function(data){
			let rawSkeletonData = data;
		}
	});
	let rawAtlasData = res.atlas;

	var spineAtlas = new PIXI.spine.core.TextureAtlas(rawAtlasData, function(line, callback) {
	    // pass the image here.
	    callback(PIXI.BaseTexture.fromImage(line));
	}); // specify path, image.png will be added automatically

	var spineAtlasLoader = new PIXI.spine.core.AtlasAttachmentLoader(spineAtlas)
	var spineJsonParser = new PIXI.spine.core.SkeletonJson(spineAtlasLoader);

	var spineData = spineJsonParser.readSkeletonData(rawSkeletonData);
	
	// now we can create spine instance
	sprite = new PIXI.spine.Spine(spineData);

    // instantiate the spine animation
    sprite.skeleton.setToSetupPose();
    sprite.update(0);
    sprite.autoUpdate = false;

    // create a container for the spine animation and add the animation to it
    const spriteCage = new PIXI.Container();
    spriteCage.addChild(sprite);

    // measure the spine animation and position it inside its container to align it to the origin
    const localRect = sprite.getLocalBounds();
    sprite.position.set(-localRect.x, -localRect.y);

    // now we can scale, position and rotate the container as any other display object
    const scale = Math.min(
        (app.screen.width * 0.7) / spriteCage.width,
        (app.screen.height * 0.7) / spriteCage.height,
    );
    spriteCage.scale.set(scale, scale);
    spriteCage.position.set(
        (app.screen.width - spriteCage.width) * 0.5,
        (app.screen.height - spriteCage.height) * 0.5,
    );

    // add the container to the stage
    app.stage.addChild(spriteCage);

    // once position and scaled, set the animation to play
    sprite.state.setAnimation(0, 'idle', true);

    app.start();
}

app.ticker.add(() => {
    // update the spine animation, only needed if sprite.autoupdate is set to false
    sprite.update(0.01666666666667); // HARDCODED FRAMERATE!
});
