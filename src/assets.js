// declare variables
let spriteJsonLink = "";
let spriteAtlasLink = "";
let spriteTextureLink = "";
let spriteWeaponLink = "";

// API link to work with
let masterLink = 'https://eth.chibifighters.io/chibis.php?pixi=200';

// put data from API to variables
$.ajax({
	url: masterLink,
	async: false,
	dataType: 'json',
	success: function(data){
		spriteJsonLink = data.root + data.json;
		spriteAtlasLink = data.root + data.atlas;
		spriteTextureLink = data.root + data.texture;
		spriteWeaponLink = data.root + data.texture_weapon;
	}
});