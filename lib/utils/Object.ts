
export default class ObjectUtils {

	static getKeyByValue(object, value ) {
		for( var prop in object ) {
			if( object.hasOwnProperty( prop ) ) {
				if( object[ prop ] === value )
					return prop;
			}
		}
	}

}