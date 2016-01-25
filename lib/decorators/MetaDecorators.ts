import Entity from "../Entity";
import Map from "../Map";
import * as Property from "./metamodel/Property";
import IComponent from "../components/IComponent";
import DecorationContext from "./DecorationContext";

export function EntityDecorator(constructor: new (...args: any[]) => Entity): void {
	var anyConstructor = <any> constructor;
	console.log("Declaring Entity!", anyConstructor.name);
	if (! Reflect.hasMetadata("properties", constructor)) {
		Reflect.defineMetadata("properties", [], constructor);
	}
	console.log("Properties:", Reflect.getMetadata("properties", constructor));

	DecorationContext.instance.entitiesClasses.push(constructor);
}

export function ComponentDecorator(constructor: new (...args: any[]) => IComponent): void {
	var anyConstructor = <any> constructor;
	console.log("Declaring Component!", anyConstructor.name);
	if (! Reflect.hasMetadata("properties", constructor)) {
		Reflect.defineMetadata("properties", [], constructor);
	}
	console.log("Properties:", Reflect.getMetadata("properties", constructor));

	console.log("TODO: is it useful to declare components?");
	DecorationContext.instance.componentsClasses.push(constructor);
}

export function MapDecorator(constructor: new () => Map): void {
	var anyConstructor = <any> constructor;
	console.log("Declaring map!", anyConstructor.name);
	if (! Reflect.hasMetadata("properties", constructor)) {
		Reflect.defineMetadata("properties", [], constructor);
	}
	console.log("Properties:", Reflect.getMetadata("properties", constructor));

	DecorationContext.instance.mapsClasses.push(constructor);
}

function PropertyDecorator(prototype: any, key: string): void {
	var constructor = prototype.constructor;

	// We have to check that the property is not actually a function.
	if (prototype.hasOwnProperty(key)) {
		throw new Error("MetaModelError: Using EntityPropertyDecorator on a method." +
			"('"+key+"' in class '"+constructor.name+"')");
	}

	// Create the property
	var p = new Property.Shared(constructor, key);

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
	EntityDecorator as Entity,
	ComponentDecorator as Component,
	MapDecorator as Map,
	PropertyDecorator as Property
}