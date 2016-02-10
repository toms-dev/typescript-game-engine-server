import {BaseClass as Property} from "../decorators/metamodel/Property";

export function loadPropertiesValues(object: any, state: any): void {
	// Add data from public properties
	var properties: Property[] = Reflect.getMetadata("properties", object.constructor);
	if (!properties) {
		throw new Error("Meta-properties incorrectly defined for class " + object.constructor.name + ". " +
			"Please ensure it's defined as an Entity or Component.");
	}

	var rawValues: any = {};
	var subEntities: any = {};
	for (var i = 0; i < properties.length; i++) {
		var entityProp = properties[i];

		// Check that the property is enabled client-side.
		if (entityProp.clientSide) {
			// Dynamically retrieve the property value
			var value = entityProp.getStateValue(object);
			if (entityProp.isSubEntity()) {
				subEntities[entityProp.name] = value;
			}
			else {
				rawValues[entityProp.name] = value;
			}
		}
	}

	// Store the raw values in a dedicated property for easier parsing.
	state["properties"] = rawValues;
	// Store the sub-entities in a dedicated property for easier parsing.
	state["entities"] = subEntities;
}