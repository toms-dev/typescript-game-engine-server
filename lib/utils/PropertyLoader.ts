import * as EntityProperty from "../decorators/metamodel/Property";

export default function loadPropertiesValues(object: any, state: any): void {
	// Add data from public properties
	var properties = Reflect.getMetadata("properties", object.constructor);
	var i: number;
	for (i = 0; i < properties.length; i++) {
		var entityProp: EntityProperty.BaseClass = properties[i];
		// Check that the property is enabled client-side.
		if (entityProp.clientSide) {
			// Dynamically retrieve the property value
			state[entityProp.name] = object[entityProp.name];
		}
	}
}
