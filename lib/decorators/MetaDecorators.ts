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


function addProperty(constructor: any, key: string, propertyClass: new (constructor: any, key: string) => Property.BaseClass): void {
	// Get or initialize the entity properties
	if (! Reflect.hasMetadata("properties", constructor)) {
		Reflect.defineMetadata("properties", [], constructor);
	}
	var properties = Reflect.getMetadata("properties", constructor);

	var p = new propertyClass(constructor, key);

	// Add the property to the meta model
	properties.push(p);
}

// Note: the optional descriptor allows to easily catch getters

function PropertyDecorator(prototype: any, key: string, descriptor: (TypedPropertyDescriptor<Entity> | TypedPropertyDescriptor<Entity[]>) = null): void {
	var constructor = prototype.constructor;

	// We have to check that the property is not actually a function (but can be a getter!).
	if (prototype.hasOwnProperty(key) && !prototype.__lookupGetter__(key)) {
		throw new Error("MetaModelError: Using EntityPropertyDecorator on a method." +
			"('"+key+"' in class '"+constructor.name+"')");
	}
	// Create the entity
	var isEntity = descriptor != null;
	if (isEntity) {
		// Entity property
		addProperty(constructor, key, Property.PropertyEntity)
	}
	else {
		// Raw property
		addProperty(constructor, key, Property.Shared);
	}



	console.log("Declaring Entity Property!", prototype.constructor.name, key);
}

function PropertyEntityDecorator(prototype: any, key: string,
									descriptor?: (TypedPropertyDescriptor<Entity> | TypedPropertyDescriptor<Entity[]>)): void {
	var constructor = prototype.constructor;
	var isEntity = false;
	if (! descriptor) {
		var className = constructor.name;
		console.warn("Warning: using PropertyReference decorator on raw property '"+key+"' instead of a getter" +
			" in '"+className+"'. Can't check that the property is actually an Entity.");
	}
	else {
		isEntity = true;
	}

	// Create the property
	addProperty(constructor, key, Property.PropertyEntity);

	console.log("Declaring Entity PropertyReference!", (<any>prototype.constructor).name, key);
}

function PropertyReferenceDecorator(prototype: any, key: string,
									descriptor?: (TypedPropertyDescriptor<Entity> | TypedPropertyDescriptor<Entity[]>)): void {
	var constructor = prototype.constructor;
	if (! descriptor) {
		var className = constructor.name;
		console.warn("Warning: using PropertyReference decorator on raw property '"+key+"' instead of a getter" +
			" in '"+className+"'. Can't check that the property is actually an Entity.");
	}

	// Create the property
	addProperty(constructor, key, Property.Reference);

	console.log("Declaring Entity PropertyReference!", (<any>prototype.constructor).name, key);
}

export {
	EntityDecorator as Entity,
	ComponentDecorator as Component,
	MapDecorator as Map,
	PropertyDecorator as Property,
	PropertyReferenceDecorator as PropertyReference,
	PropertyEntityDecorator as PropertyEntity
}