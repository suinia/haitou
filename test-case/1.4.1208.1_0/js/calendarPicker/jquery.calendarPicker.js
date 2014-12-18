/**
 * calendar picker v2.0
 * author: mizi
 */

jQuery.fn.calendarPicker = function(options) {
  // --------------------------  start default option values --------------------------
  var conf = {
	date : new Date(),
	years : 1,
	months : 3,
	days: 4,
	hours : 5,
	minutes : 5,
	showDayArrow: false,
	useWheel: true,
	callbackDelay: 100,
	tool: true,
	hideToday: false,
	format: "yyyy-MM-dd HH:mm",
	monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一", "十二"],
	dayNames: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
  };

  options = jQuery.extend( true, {}, conf, options );
  
  // --------------------------  end default option values --------------------------

  var calendar = { currentDate: options.date };
  calendar.options = options;

  //build the calendar on the first element in the set of matched elements.
  var theDiv = this.eq(0);//jQuery(this);
  theDiv.addClass("calBox");

  //empty the div
  theDiv.empty();

  var divYears = jQuery("<div>").addClass("calYear");
  var divMonths = jQuery("<div>").addClass("calMonth");
  var divDays = jQuery("<div>").addClass("calDay");
  var divHours = jQuery("<div>").addClass("calHour");
  var divMinutes = jQuery("<div>").addClass("calMinute");
  var divTools = jQuery("<div>").addClass("calTool");
 
  if( options.years ) theDiv.append(divYears);
  if( options.months ) theDiv.append(divMonths);
  if( options.days ) theDiv.append(divDays);
  if( options.hours ) theDiv.append(divHours);
  if( options.minutes ) theDiv.append(divMinutes);
  if( options.tool ) theDiv.append( divTools );
  
  theDiv.append("<div class='mark'>使用鼠标滚轮，可以快速选择日期</div>");

  var leftpad = function( tk, i, s ){
		s = s?s:'0', _tk  = String( tk );
		while (_tk.length < i) {
			 _tk = s + _tk; 
		} 
		return _tk;
  };
  
	var format = function( date, format ){
		var opts = {
			"yyyy" : date.getFullYear(),
			"MM" : leftpad( date.getMonth()+1, 2 ), 
			"dd" : leftpad( date.getDate(), 2 ), 
			"HH" : leftpad( date.getHours(), 2 ), 
			"mm" : leftpad( date.getMinutes(), 2 ), 
			"ss" : leftpad( date.getSeconds(), 2 )
		};
		
		jQuery.each( opts, function( k, v ){
			format = format.replace( k, v );
		});
		
		return format;
	};

  calendar.changeDate = function(date) {
    calendar.currentDate = date;

    var fillYears = function(date) {
      var year = date.getFullYear();
      var t = new Date();
      divYears.empty();
      var nc = options.years*2+1;
      var w = parseInt((theDiv.width()-4-(nc)*4)/nc)+"px";
      for (var i = year - options.years; i <= year + options.years; i++) {
        var d = new Date(date);
        d.setFullYear(i);
        var span = jQuery("<span>").addClass("calElement").attr("millis", d.getTime()).html(i).css("width",w);
        if (d.getYear() == t.getYear())
          span.addClass("today");
        if (d.getYear() == calendar.currentDate.getYear())
          span.addClass("selected");
        divYears.append(span);
      }
    };

    var fillMonths = function(date) {
      var month = date.getMonth();
      var t = new Date();
      divMonths.empty();
      var oldday = date.getDay();
      var nc = options.months*2+1;
      var w = parseInt((theDiv.width()-4-(nc)*4)/nc)+"px";
      for (var i = -options.months; i <= options.months; i++) {
        var d = new Date(date);
        var oldday = d.getDate();
        d.setMonth(month + i);

        if (d.getDate() != oldday) {
          d.setMonth(d.getMonth() - 1);
          d.setDate(28);
        }
        var span = jQuery("<span>").addClass("calElement").attr("millis", d.getTime()).html(options.monthNames[d.getMonth()]).css("width",w);
        if (d.getYear() == t.getYear() && d.getMonth() == t.getMonth())
          span.addClass("today");
        if (d.getYear() == calendar.currentDate.getYear() && d.getMonth() == calendar.currentDate.getMonth())
          span.addClass("selected");
		  divMonths.append(span);

      }
    };

    var fillDays = function(date) {
      var day = date.getDate();
      var t = new Date();
      divDays.empty();
      var nc = options.days*2+1;
      var w = parseInt((theDiv.width()-4-(options.showDayArrows?12:0)-(nc)*4)/(nc-(options.showDayArrows?2:0)))+"px";
      for (var i = -options.days; i <= options.days; i++) {
        var d = new Date(date);
        d.setDate(day + i)
        var span = jQuery("<span>").addClass("calElement").attr("millis", d.getTime())
        if (i == -options.days && options.showDayArrows) {
          span.addClass("prev");
        } else if (i == options.days && options.showDayArrows) {
          span.addClass("next");
        } else {
          span.html("<span class=dayNumber>" + d.getDate() + "</span><br>" + options.dayNames[d.getDay()]).css("width",w);
          if (d.getYear() == t.getYear() && d.getMonth() == t.getMonth() && d.getDate() == t.getDate())
            span.addClass("today");
          if (d.getYear() == calendar.currentDate.getYear() && d.getMonth() == calendar.currentDate.getMonth() && d.getDate() == calendar.currentDate.getDate())
            span.addClass("selected");
        }
        divDays.append(span);
      }
    };

	var fillHours = function( date ){
	  var hours = date.getHours();
      var t = new Date();
      divHours.empty();
      var oldday = date.getDay();
      var nc = options.hours*2+1;
      var w = parseInt((theDiv.width()-4-(nc)*4)/nc)+"px";
      for (var i = -options.hours; i <= options.hours; i++) {
        var d = new Date(date);
        var oldday = d.getDate();
        d.setHours(hours + i);
     
        var span = jQuery("<span>").addClass("calElement").attr("millis", d.getTime()).html( d.getHours() + "时" ).css("width",w);
        if ( d.getHours() == t.getHours() && d.getYear() == t.getYear() && d.getMonth() == t.getMonth() && d.getDate() == t.getDate() )
          span.addClass("today");
        if ( d.getHours() == calendar.currentDate.getHours() )
          span.addClass("selected");
		  divHours.append(span);
      }
	};

	var fillMinutes = function( date ){
	  var minutes = date.getMinutes();
      var t = new Date();
      divMinutes.empty();
      var oldday = date.getDay();
      var nc = options.minutes*2+1;
      var w = parseInt((theDiv.width()-4-(nc)*4)/nc)+"px";
      for (var i = -options.minutes; i <= options.minutes; i++) {
        var d = new Date(date);
        var oldday = d.getDate();
        d.setMinutes( minutes + i);
     
        var span = jQuery("<span>").addClass("calElement").attr("millis", d.getTime()).html( d.getMinutes() + "分" ).css("width",w);
        if ( d.getMinutes() == t.getMinutes() && d.getHours() == t.getHours() && d.getYear() == t.getYear() && d.getMonth() == t.getMonth() && d.getDate() == t.getDate() )
          span.addClass("today");
        if ( d.getMinutes() == calendar.currentDate.getMinutes() )
          span.addClass("selected");
		  divMinutes.append(span);
      }
	};

    var deferredCallBack = function() {
      if (typeof(options.callback) == "function") {
        if (calendar.timer)
          clearTimeout(calendar.timer);

        calendar.timer = setTimeout(function() {
        	var val = format( date, options.format );
        	options.callback(calendar, val );
        }, options.callbackDelay);
      }
    };

	var tools = function( date ){
		var val = format( date, options.format );
		var $tb = jQuery('<table>');
		$tb.append("<tbody><tr><td class='calBtnToday'></td><td class='currentDate'>"+val+"</td><td class='calBtn'></td></tr></tbody>");
		var btn = jQuery('<input type="button" class="btn" value="确定" />');
		options.btnEvent && btn.on( "click", function(){ options.btnEvent( date, val ); } );
		$tb.find('.calBtn').append( btn );
		!options.hideToday && (function(){
			var today = jQuery('<input type="button" class="btn" value="今天" />');
			$tb.find('.calBtnToday').append( today );
			today.on( "click", function(){
				calendar.changeDate( new Date() );
			} );
		})();
		divTools.html('').append( $tb );
	};

	if( options.years ) fillYears(date);
	if( options.months ) fillMonths(date);
	if( options.days ) fillDays(date);
	if( options.hours ) fillHours(date);
	if( options.minutes ) fillMinutes( date );
	if( options.tool ) tools( date );
  };

  theDiv.click(function(ev) {
    var el = jQuery(ev.target).closest(".calElement");
    if (el.hasClass("calElement")) {
    	var date = new Date( parseInt( el.attr("millis") ) );
    	calendar.changeDate( date );
    	options.callback && (function(){
        	var val = format( date, options.format );
        	options.callback( date, val );
    	})();
    }
  });


  //if mousewheel
  if (jQuery.event.special.mousewheel && options.useWheel) {
    divYears.mousewheel(function(event, delta) {
      var d = new Date(calendar.currentDate.getTime());
      d.setFullYear(d.getFullYear() + delta);
      calendar.changeDate(d);
      return false;
    });
    divMonths.mousewheel(function(event, delta) {
      var d = new Date(calendar.currentDate.getTime());
      d.setMonth(d.getMonth() + delta);
      calendar.changeDate(d);
      return false;
    });
    divDays.mousewheel(function(event, delta) {
      var d = new Date(calendar.currentDate.getTime());
      d.setDate(d.getDate() + delta);
      calendar.changeDate(d);
      return false;
    });
	divHours.mousewheel(function(event, delta) {
      var d = new Date(calendar.currentDate.getTime());
      d.setHours( d.getHours() + delta );
      calendar.changeDate(d);
      return false;
    });
	divMinutes.mousewheel(function(event, delta) {
      var d = new Date(calendar.currentDate.getTime());
      d.setMinutes( d.getMinutes() + delta );
      calendar.changeDate(d);
      return false;
    });
  }

  calendar.changeDate( options.date );

  return calendar;
};