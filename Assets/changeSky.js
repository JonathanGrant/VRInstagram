#pragma strict

var button : UI.Button;
function Start () {
	button.onClick.AddListener(changeSkyBox);
}
function Update () {
	
}

var newSky : Material;

function changeSkyBox() {
	RenderSettings.skybox = newSky;
}