

import Entity from "../Entity";
import * as EntityProperty from "./metamodel/EntityProperty";

export function EntityClassDecorator(constructor: any): void {
	console.log("Declaring Entity!", constructor.name);
	console.log("Properties:", Reflect.getMetadata("properties", constructor));
}

function EntityPropertyDecorator(prototype: any, key: string): void {
	var constructor = prototype.constructor;

	// We have to check that the property is not actually a function.
	if (prototype.hasOwnProperty(key)) {
		throw new Error("MetaModelError: Using EntityPropertyDecorator on a method." +
			"('"+key+"' in class '"+constructor.name+"')");
	}

	// Create the property
	var p = new EntityProperty.Shared(constructor, key);

	// Get or initialize the entity properties
	if (! Reflect.hasMetadata("properties", constructor)) {
		Reflect.defineMetadata("properties", [], constructor);
	}
	var properties = Reflect.getMetadata("properties", constructor);

	// Add the property to the meta model
	properties.push(p);

	console.log("Declaring Entity Property!", prototype.constructor.name, key);
}

export {
	EntityClassDecorator as Class,
	EntityPropertyDecorator as Property
}