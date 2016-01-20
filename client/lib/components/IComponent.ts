
interface IComponent {

	loadState(entityData: any): void;

	tick(delta: number, now: number): void;

}


export default IComponent;

