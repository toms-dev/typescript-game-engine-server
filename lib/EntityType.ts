
abstract class EntityType {

	private metaType: string;

	constructor(metaType: string) {
		this.metaType = metaType;
	}

	protected abstract getInternalData(): any;

	public getData(): any {
		return {
			metaType: this.metaType,
			typeData: this.getInternalData()
		}
	}

}

export default EntityType;