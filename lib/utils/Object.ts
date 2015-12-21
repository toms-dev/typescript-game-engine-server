
export default class ObjectUtils {

	static getKeyByValue(object: any, value: any ): any {
		for( var prop in object ) {
			if( object.hasOwnProperty( prop ) ) {
				if( object[ prop ] === value )
					return prop;
			}
		}
		return null;
	}

}