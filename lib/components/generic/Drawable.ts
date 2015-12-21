import IComponent from "./../IComponent";

export default class Drawable implements IComponent {

	private spriteName:string;

	public constructor(spriteName:string) {
		this.spriteName = spriteName;
	}

	tick(delta:number):void {
	}

	getState(): any {
		return {
			spriteName: this.spriteName
		}
	}

}
