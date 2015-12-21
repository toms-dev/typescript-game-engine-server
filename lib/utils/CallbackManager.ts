
class Callback<CALLBACK extends Function> {
	public callback: CALLBACK;
	public key: any;

	constructor(key: any, callback:CALLBACK) {
		this.callback = callback;
		this.key = key;
	}
}

export default class CallbackManager<CALLBACK extends Function> {

	private callbacks: Callback<CALLBACK>[];
	/**
	 * This method is used to propagated the type of the callback to the signature
	 */
	public call: CALLBACK;
	private hydrationGetter: () => any[];

	constructor() {
		this.callbacks = [];
		// recreate the missing method
		this.call = <any> ((...args: any[]) => {
			this.doCall(args);
		});
	}

	get(key: any): CALLBACK {
		var tuple = this.getTuple(key);
		return tuple ? tuple.callback : null;
	}

	private getTuple(key: any): Callback<CALLBACK> {
		for (var i = 0; i < this.callbacks.length; ++i) {
			var c = this.callbacks[i];
			if (c.key == key) return c;
		}
		return null;
	}

	getCallbacks(): CALLBACK[] {
		return this.callbacks.map((c: Callback<CALLBACK>) => {
			return c.callback;
		});
	}

	contains(key: any): boolean {
		return this.get(key) != null;
	}

	add(key: any, callback: CALLBACK) {
		if (this.contains(key)) {
			throw new Error("Callback with key "+key+" already exists.");
		}

		var tuple = new Callback(key, callback);
		this.callbacks.push(tuple);

		// Hydrate the listener with the current values
		if (this.hydrationGetter) {
			// Generate the params array
			var params = this.hydrationGetter();
			// Call the callback with this
			tuple.callback.apply(null, params);
		}
	}

	remove(key: any): void {
		var tuple = this.getTuple(key);
		var index = this.callbacks.indexOf(tuple);
		if (index == -1) return;
		this.callbacks.splice(index, 1);
	}

	private doCall(args: any[]) {
		for (var i = 0; i < this.callbacks.length; ++i) {
			var c = this.callbacks[i];
			c.callback.apply(this, args);
		}
	}

	/**
	 * Defines a callback that will be used to trigger the callback when a new listener is added
	 * @param getter
	 */
	setHydration(getter: () => any[]): void {
		this.hydrationGetter = getter;
	}
}
