/**
 * 具体业务处理
 */

(function( window, $, underfined ){

var nf = {};

nf.lastDayNewPos = function(){
	nf.store( function( rt ){
		console.debug( rt );
		var pos = rt.position;
		c.run( pos.length, function(){

			//标识时间点
			var current = rt.timestamp - C.TIMESTAMP;
			var pdate = current = c.format( new Date( current ), "MM月dd日" );
			$('.lastNewPos .positiondate').html( pdate );
			$('.lastNewPos em').html( pos.length );
	

		});
		
	});
};

nf.store = function( fn, errfn ){
	var store = c.storage.json( C.HO_LASTDAY_NEWPOS_STORE );
	fn.call( window, store );
};


nf.init = function(){
	nf.lastDayNewPos();
};

nf.init();

window.nf = nf;

})( window, jQuery );