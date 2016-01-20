export default class Vector3 {

	public x:number;
	public y:number;
	public z:number;


	constructor(v:Vector3 = null) {
		if (v == null) {
			this.x = 0;
			this.y = 0;
			this.z = 0;
		} else {
			this.copyFrom(v);
		}
	}

	static create(x:number, y:number, z:number) {
		var v = new Vector3();
		v.x = x;
		v.y = y;
		v.z = z;
		return v;
	}

	copyFrom(v:Vector3):void {
		this.x = v.x;
		this.y = v.y;
		this.z = v.z;
	}

	setComponents(x:number, y:number, z:number) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	equals(v:Vector3, delta: number = 0):boolean {
		return this.x - delta <= v.x && v.x <= this.x + delta
			&& this.y - delta <= v.y && v.y <= this.y + delta
			&& this.z - delta <= v.z && v.z <= this.z + delta
			;
	}

	to(target:Vector3):Vector3 {
		var v = new Vector3(target);
		v.x -= this.x;
		v.y -= this.y;
		v.z -= this.z;
		return v;
	}

	diff(v: Vector3):Vector3 {
		return v.to(this);
	}

	add(v:Vector3):Vector3 {
		var res = new Vector3(this);
		res.x += v.x;
		res.y += v.y;
		res.z += v.z;
		return res;
	}

	multiplyScalar(s:number):Vector3 {
		var v = new Vector3(this);
		v.x *= s;
		v.y *= s;
		v.z *= s;
		return v;
	}

	toJSON(): any {
		return {
			x: this.x,
			y: this.y,
			z: this.z
		}
	}

	norm(): number {
		return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
	}

	normalize():Vector3 {
		var norm = this.norm();

		if (norm == 0) {
			// return a null vector
			return new Vector3();
		}

		var scaling = 1/norm;
		return this.multiplyScalar(scaling);
	}

	static fromArray(a: number[]):Vector3 {
		var v = new Vector3();
		if (a[0] != undefined) v.x = a[0];
		if (a[1] != undefined) v.y = a[1];
		if (a[2] != undefined) v.z = a[2];
		return v;
	}

	static fromJSON(position: any):Vector3 {
		return Vector3.create(position.x, position.y, position.z);
	}

}

export interface RawCoords {
	x: number;
	y: number;
	z: number;
}
