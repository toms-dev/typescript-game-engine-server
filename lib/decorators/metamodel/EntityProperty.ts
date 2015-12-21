import Entity from "../../Entity";

class EntityProperty {

	public name: string;
	public entityConstructor: (new () => Entity);

	public clientSide: boolean;
	public serverSide: boolean;

	constructor(entityConstructor: any, name: string, clientSide:boolean, serverSide:boolean) {
		this.entityConstructor = entityConstructor;
		this.name = name;
		this.clientSide = clientSide;
		this.serverSide = serverSide;
	}
}

class SharedProperty extends EntityProperty {
	constructor(entityConstructor:any, name:string) {
		super(entityConstructor, name, true, true);
	}
}

class ClientOnlyProperty extends EntityProperty {
	constructor(entityConstructor:any, name:string) {
		super(entityConstructor, name, true, false);
	}
}

class ServerOnlyProperty extends EntityProperty {
	constructor(entityConstructor:any, name:string) {
		super(entityConstructor, name, false, true);
	}
}

export {
	EntityProperty as BaseClass,
	SharedProperty as Shared,
	ClientOnlyProperty as ClientOnly,
	ServerOnlyProperty as ServerOnly
}