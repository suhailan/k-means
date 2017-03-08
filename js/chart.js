/*************************************************************
 * This script is developed by Arturs Sosins aka ar2rsawseen, http://webcodingeasy.com
 * Feel free to distribute and modify code, but keep reference to its creator
 *
 * Easy chart package allows you to easily draw chart from provided data.
 * It supports line, scatter, columns, bars and pie chart types
 * IT is also possible to set events for interaction with chart data
 *
 * For more information, examples and online documentation visit: 
 * http://webcodingeasy.com/JS-classes/Generate-charts-using-HTML5-canvas
**************************************************************/
var chart = function(id, config) {
	this.elem = document.getElementById(id);
	var ob = this;
	var ch;
	var canvas = document.createElement("canvas");
	var ctx;
	var x_ratio;
	var y_ratio;
	var ob = this;
	var data = [];
	var on = [];
	var radius;
	var padding;
	var font;
	var full = (Math.PI/180)*360;
	this.conf = {
		x_start: 0,
		x_end: 100,
		x_step: 10,
		x_grid: "#e9e9e9",
		y_start: 0,
		y_end: 100,
		y_grid: "#e9e9e9",
		y_step: 10,
		width: 800,
		height: 600,
		type: "line",
		on_error: null,
		backgroundColor: "#fff",
		color: "#000",
		onclick : null,
		onmouseover : null,
		onmouseout : null,
		markers: true,
		values: true
	};
	this.construct = function(){
		if(canvas.getContext)
		{
			for(var opt in config){
				this.conf[opt]= config[opt];
			}
			//calculate unit ratio to pixel
			x_ratio = ob.conf.width/((ob.conf.x_end-ob.conf.x_start) + 4);
			y_ratio = ob.conf.height/((ob.conf.y_end-ob.conf.y_start) + 4);
			//dot radius
			radius = 3;//Math.round(Math.max(x_ratio, y_ratio));
			ctx = canvas.getContext('2d');
			//font = (radius*2) + "px Arial";
			font = "10px Arial";
			ctx.font = font;
			//padding
			padding = radius*2;
			if(ob.conf.values)
			{
				var one = ctx.measureText("0").width;
				padding = radius*2;
				if(Math.round(padding/4)*3 < ctx.measureText(ob.conf.x_end).width)
				{
					padding = ctx.measureText(ob.conf.x_end).width + Math.round(padding/4); 
				}
			}
			//recalculate without padding
			x_ratio = (ob.conf.width-(padding*2))/(ob.conf.x_end-ob.conf.x_start);
			y_ratio = (ob.conf.height-(padding*2))/(ob.conf.y_end-ob.conf.y_start);
			//append canvas
			this.elem.appendChild(canvas);
			canvas.setAttribute("width", parseInt(this.conf.width) + "px");
			canvas.setAttribute("height", parseInt(this.conf.height) + "px");
			//emulate click event
			add_event(canvas, "click", function(e){
				e = get_coord(e, canvas);
				var target = ch.in_range(e.elemX, e.elemY);
				if(target)
				{
					ch.click(target);
				}
			});
			//emulate mouseover event
			var hover_event = function(e){
				e = get_coord(e,canvas);
				var target = ch.in_range(e.elemX, e.elemY);
				if(target)
				{
					if(ch.mouseover)
					{
						ch.mouseover(target);
					}
				}
			};
			//add mousemove
			add_event(canvas, "mouseover", function(e){
				add_event(canvas, "mousemove", hover_event);
			});
			//remove mousemove
			add_event(canvas, "mouseout", function(){
				rem_event(canvas, "mousemove", hover_event);
				all_out();
			});
			
			//which type of chart to draw
			switch(this.conf.type){
				case "scatter":
					ch = new scatter();
					break;
				case "columns":
					ch = new columns();
					break;
				case "bars":
					ch = new bars();
					break;
				case "pie":
					ch = new pie();
					break;
				default:
					ch = new lines();
			}
		}
		//browser doesn't support canvas
		else if(on_error)
		{
			on_error();
		}
	};
	//add data
	this.add = function(x,y,color,label){
		ch.add(x,y,color,label);
	};
	//draw chart
	this.draw = function(){
		//fill background
		ctx.fillStyle = this.conf.backgroundColor;
		ctx.fillRect(0,0,parseInt(this.conf.width),parseInt(this.conf.height));
		ch.draw();
	};
	/************************
	 * LINE TYPE CHART
	 ***********************/
	var lines = function(){
		this.add = function(x,y,color,label){
			var obj = new Object();
			obj.x = x;
			obj.y = y;
			if(color)
			{
				obj.color = color;
			}
			obj.label = label;
			data.push(obj);
		};
		this.draw = function(){
			prepare_axis();
			ctx.beginPath();
			var length = data.length;
			for(var i = 0; i < length; i++)
			{
				if(i > 0)
				{
					ctx.lineTo(data[i].x*x_ratio + padding, (ob.conf.height - data[i].y*y_ratio)-padding);
				}
				else
				{
					ctx.moveTo(data[i].x*x_ratio + padding, (ob.conf.height - data[i].y*y_ratio)-padding);
				}
				data[i].nx = data[i].x*x_ratio + padding;
				data[i].ny = (ob.conf.height - data[i].y*y_ratio)-padding;
			}
			ctx.stroke();
			if(ob.conf.markers)
			{
				ctx.fillStyle = ob.conf.color;
				for(var i = 0; i < length; i++)
				{
					if(data[i].color)
					{
						ctx.fillStyle = data[i].color;
					}
					ctx.beginPath();
					ctx.arc(data[i].x*x_ratio + padding, (ob.conf.height - data[i].y*y_ratio)-padding, radius,0,full,true);
					ctx.fill();
					if(data[i].color)
					{
						ctx.fillStyle = ob.conf.color;
					}
				}
				ctx.fillStyle = ob.conf.backgroundColor;
			}
		};
		this.in_range = function(x,y){
			return dots_in_range(x,y);
		};
		this.mouseover = function(target){
			if(ob.conf.markers)
			{
				dot_hover(target, 1.5);
			}
			else
			{
				dot_hover(target, 1);
			}
			if(ob.conf.onmouseover)
			{
				ob.conf.onmouseover(target.x, target.y, target.label);
			}
		};
		this.mouseout = function(target){
			if(ob.conf.onmouseout)
			{
				ob.conf.onmouseout(target.x, target.y, target.label);
			}
		};
		this.click = function(target){
			if(ob.conf.onclick)
			{
				ob.conf.onclick(target.x, target.y, target.label);
			}
		};
	};
	/************************
	 * SCATTER TYPE CHART
	 ***********************/
	var scatter = function(){
		this.add = function(x,y,color,label){
			var obj = new Object();
			obj.x = x;
			obj.y = y;
			if(color)
			{
				obj.color = color;
			}
			obj.label = label;
			data.push(obj);
		};
		this.draw = function(){
			prepare_axis();
			ctx.fillStyle = ob.conf.color;
			var length = data.length;
			for(var i = 0; i < length; i++)
			{
				if(data[i].color)
				{
					ctx.fillStyle = data[i].color;
				}
				ctx.beginPath();
				ctx.arc(data[i].x*x_ratio + padding, (ob.conf.height - data[i].y*y_ratio)-padding, radius,0,full,true);
				ctx.fill();
				data[i].nx = data[i].x*x_ratio + padding;
				data[i].ny = (ob.conf.height - data[i].y*y_ratio)-padding;
				if(data[i].color)
				{
					ctx.fillStyle = ob.conf.color;
				}
			}
			ctx.fillStyle = ob.conf.backgroundColor;
		};
		this.in_range = function(x,y){
			return dots_in_range(x,y);
		};
		this.mouseover = function(target){
			dot_hover(target, 1.5);
			if(ob.conf.onmouseover)
			{
				ob.conf.onmouseover(target.x, target.y, target.label);
			}
		};
		this.mouseout = function(target){
			if(ob.conf.onmouseout)
			{
				ob.conf.onmouseout(target.x, target.y, target.label);
			}
		};
		this.click = function(target){
			if(ob.conf.onclick)
			{
				ob.conf.onclick(target.x, target.y, target.label);
			}
		};
	};
	/************************
	 * COLUMNS TYPE CHART
	 ***********************/
	var columns = function(){
		var width;
		this.add = function(value,color,label){
			var obj = new Object();
			obj.y = value;
			if(color)
			{
				obj.color = color;
			}
			obj.label = label;
			data.push(obj);
		};
		this.draw = function(){
			width = Math.round(((ob.conf.x_end - ob.conf.x_start)/((data.length*2)+1))*x_ratio);
			prepare_axis();
			var length = data.length;
			var start = width;
			ctx.fillStyle = ob.conf.color;
			for(var i = 0; i < length; i++)
			{
				if(data[i].color)
				{
					ctx.fillStyle = data[i].color;
				}
				ctx.fillRect(start + padding,(ob.conf.height - data[i].y*y_ratio)-padding,width,data[i].y*y_ratio);
				data[i].x = start;
				data[i].nx = data[i].x + padding;
				data[i].ny = (ob.conf.height - data[i].y*y_ratio)-padding;
				start += (width*2);
				if(data[i].color)
				{
					ctx.fillStyle = ob.conf.color;
				}
			}
		};
		this.in_range = function(x,y){
			var length = on.length;
			var height = y*y_ratio;
			//detect mouse out
			if(length > 0)
			{
				for(var i = 0; i < length; i++)
				{
					if(on[i].nx > x || on[i].nx+width < x || on[i].ny > y || on[i].ny+height < y)
					{
						mouseout(on[i]);
						on.splice(i, 1);
						length -= 1;
					}
				}
			}
			length = data.length;
			var ret;
			for(var i = 0; i < length; i++)
			{
				if(data[i].nx <= x && data[i].nx+width >= x && data[i].ny <= y && data[i].ny+height >= y)
				{
					ret = data[i];
					if(!in_array(ret, on))
					{
						on.push(ret);
					}
					break;
				}
			}
			return ret;
		};
		this.mouseover = function(target){
			ctx.strokeRect(target.x + padding,(ob.conf.height - target.y*y_ratio)-padding,width,target.y*y_ratio);
			if(ob.conf.onmouseover)
			{
				ob.conf.onmouseover(target.y, target.label);
			}
		};
		this.mouseout = function(target){
			if(ob.conf.onmouseout)
			{
				ob.conf.onmouseout(target.y, target.label);
			}
		};
		this.click = function(target){
			if(ob.conf.onclick)
			{
				ob.conf.onclick(target.y, target.label);
			}
		};
	};
	/************************
	 * BARS TYPE CHART
	 ***********************/
	var bars = function(){
		var width;
		this.add = function(value,color,label){
			var obj = new Object();
			obj.x = value;
			if(color)
			{
				obj.color = color;
			}
			obj.label = label;
			data.push(obj);
		};
		this.draw = function(){
			width = Math.round(((ob.conf.y_end - ob.conf.y_start)/((data.length*2)+1))*y_ratio);
			prepare_axis();
			var length = data.length;
			var start = width;
			ctx.fillStyle = ob.conf.color;
			for(var i = 0; i < length; i++)
			{
				if(data[i].color)
				{
					ctx.fillStyle = data[i].color;
				}
				ctx.fillRect(padding, start+padding,data[i].x*x_ratio, width);
				data[i].y = start;
				data[i].ny = data[i].y + padding;
				start += (width*2);
				if(data[i].color)
				{
					ctx.fillStyle = ob.conf.color;
				}
			}
		};
		this.in_range = function(x,y){
			var length = on.length;
			var height = x*x_ratio;
			//detect mouse out
			if(length > 0)
			{
				for(var i = 0; i < length; i++)
				{
					if(padding > x || padding+(on[i].x*x_ratio) < x || on[i].ny > y || on[i].ny+width < y)
					{
						mouseout(on[i]);
						on.splice(i, 1);
						length -= 1;
					}
				}
			}
			length = data.length;
			var ret;
			for(var i = 0; i < length; i++)
			{
				if(padding <= x && padding+(data[i].x*x_ratio) >= x && data[i].ny <= y && data[i].ny+width >= y)
				{
					ret = data[i];
					if(!in_array(ret, on))
					{
						on.push(ret);
					}
					break;
				}
			}
			return ret;
		};
		this.mouseover = function(target){
			ctx.strokeRect(padding, target.y+padding,target.x*x_ratio, width);
			if(ob.conf.onmouseover)
			{
				ob.conf.onmouseover(target.x, target.label);
			}
		};
		this.mouseout = function(target){
			if(ob.conf.onmouseout)
			{
				ob.conf.onmouseout(target.x, target.label);
			}
		};
		this.click = function(target){
			if(ob.conf.onclick)
			{
				ob.conf.onclick(target.x, target.label);
			}
		};
	};
	/************************
	 * PIE TYPE CHART
	 ***********************/
	var pie = function(){
		var center_x;
		var center_y;
		var rad;
		var degree;
		var sum = 0;
		var deg_ratio;
		this.add = function(value,color,label){
			var obj = new Object();
			obj.x = value;
			sum += value;
			if(color)
			{
				obj.color = color;
			}
			obj.label = label;
			data.push(obj);
		};
		this.draw = function(){
			var length = data.length;
			center_x = Math.round(ob.conf.width/2);
			center_y = Math.round(ob.conf.height/2);
			rad = Math.min(center_x,center_y) - padding;
			deg_ratio = 360/sum;
			var start = 0;
			ctx.fillStyle = ob.conf.color;
			for(var i = 0; i < length; i++)
			{
				if(data[i].color)
				{
					ctx.fillStyle = data[i].color;

				}
				var startAngle = (Math.PI/180)*start;
				var end = (data[i].x*deg_ratio);
				var endAngle = (Math.PI/180)*(start+end);
				ctx.beginPath();
				ctx.moveTo(center_x,center_y);
				ctx.arc(center_x,center_y,rad,startAngle,endAngle, false);
				ctx.lineTo(center_x,center_y);
				ctx.fill();
				data[i].y = start;
				data[i].startAngle = startAngle;
				data[i].endAngle = endAngle;
				start += end;
				if(data[i].color)
				{
					ctx.fillStyle = ob.conf.color;
				}
			}
		};
		this.in_range = function(x,y){
			var angle = (Math.atan2(y-center_y,x-center_x)+2*Math.PI)%(2*Math.PI);
			var dist = false;
			if(Math.pow(x-center_x,2) + Math.pow(y-center_y,2) <= Math.pow(rad,2))
			{
				dist = true
			}
			var length = on.length;
			//detect mouse out
			if(length > 0)
			{
				for(var i = 0; i < length; i++)
				{
					if(angle > on[i].startAngle && angle <= on[i].endAngle)
					{
						mouseout(on[i]);
						on.splice(i, 1);
						length -= 1;
					}
				}
			}
			length = data.length;
			var ret;
			for(var i = 0; i < length; i++)
			{
				if(dist && angle > data[i].startAngle && angle <= data[i].endAngle)
				{
					ret = data[i];
					if(!in_array(ret, on))
					{
						on.push(ret);
					}
					break;
				}
			}
			return ret;
		};
		this.mouseover = function(target){
			var start = target.y;
			var startAngle = (Math.PI/180)*start;
			var end = (target.x*deg_ratio);
			var endAngle = (Math.PI/180)*(start+end);
			ctx.beginPath();
			ctx.moveTo(center_x,center_y);
			ctx.arc(center_x,center_y,rad,startAngle,endAngle, false);
			ctx.lineTo(center_x,center_y);
			ctx.stroke();
			if(ob.conf.onmouseover)
			{
				ob.conf.onmouseover(target.x, target.label);
			}
		};
		this.mouseout = function(target){
			if(ob.conf.onmouseout)
			{
				ob.conf.onmouseout(target.x, target.label);
			}
		};
		this.click = function(target){
			if(ob.conf.onclick)
			{
				ob.conf.onclick(target.x, target.label);
			}
		};
	};
	/************************
	 * GENERAL FUNCTIONS
	 ***********************/
	 //draw axis and grid
	var prepare_axis = function(){
		//draw y grid
		if(ob.conf.y_grid != "")
		{
			ctx.strokeStyle = ob.conf.y_grid;
			var start = ob.conf.y_start;
			while(start < ob.conf.y_end)
			{
				moveTo(padding,(parseInt(ob.conf.height)-padding)-(start*y_ratio));
				lineTo(parseInt(ob.conf.width)-padding,(parseInt(ob.conf.height)-padding)-(start*y_ratio));
				start += ob.conf.y_step;
			}
			moveTo(padding,(parseInt(ob.conf.height)-padding)-(ob.conf.y_end*y_ratio));
			lineTo(parseInt(ob.conf.width)-padding,(parseInt(ob.conf.height)-padding)-(ob.conf.y_end*y_ratio));
			ctx.stroke();
		}
		//draw x grid
		if(ob.conf.x_grid != "")
		{
			ctx.strokeStyle = ob.conf.x_grid;
			start = ob.conf.x_start;
			while(start < ob.conf.x_end)
			{
				moveTo((start*x_ratio) + padding, parseInt(ob.conf.height)-padding);
				lineTo((start*x_ratio) + padding, padding);
				start += ob.conf.x_step;
			}
			moveTo((ob.conf.x_end*x_ratio) + padding, parseInt(ob.conf.height)-padding);
			lineTo((ob.conf.x_end*x_ratio) + padding, padding);
			ctx.stroke();
		}
		if(ob.conf.values && (ob.conf.type == "lines" || ob.conf.type == "scatter"))
		{
			ctx.font = font;
			ctx.textAlign = "right";
			ctx.fillStyle = ob.conf.color;
			ctx.textBaseline = "middle";
			var start = ob.conf.y_start;
			while(start <= ob.conf.y_end)
			{
				ctx.fillText(start, Math.round(padding/4)*3, (parseInt(ob.conf.height)-padding)-(start*y_ratio));
				start += ob.conf.y_step;
			}
			ctx.textAlign = "center";
			ctx.textBaseline = "top";
			start = ob.conf.x_start;
			while(start <= ob.conf.x_end)
			{
				ctx.fillText(start, (start*x_ratio) + padding, parseInt(ob.conf.height)-(Math.round(padding/4)*3));
				start += ob.conf.x_step;
			}
			ctx.fillStyle = ob.conf.backgroundColor;
		}
		//back to default color
		ctx.strokeStyle = ob.conf.color;
		//draw axis
		ctx.beginPath();
		ctx.moveTo(padding,padding);
		ctx.lineTo(padding,parseInt(ob.conf.height)-padding);
		ctx.lineTo(parseInt(ob.conf.width)-padding,parseInt(ob.conf.height)-padding);
		ctx.stroke();
	};
	//add event
	var add_event = function(element, type, listener){
		if(element.addEventListener)
		{
			element.addEventListener(type, listener, false);
		}
		else
		{
			element.attachEvent('on' +  type, listener);
		}
	};
	//remove event
	var rem_event = function(element, type, listener){
		if(element.removeEventListener)
			element.removeEventListener(type, listener, false);
		else
			element.detachEvent('on' +  type, listener);
	};
	//get mouse coordinates in element
	var get_coord = function(e, elem){
		//checking if pageY and pageX is already available
		if (typeof e.pageY == 'undefined' &&  
			typeof e.clientX == 'number' && 
			document.documentElement)
		{
			//if not, then add scrolling positions
			e.pageX = e.clientX + document.body.scrollLeft
				+ document.documentElement.scrollLeft;
			e.pageY = e.clientY + document.body.scrollTop
				+ document.documentElement.scrollTop;
		};
		//temporary variables
		var x = y = 0;
		//check context of current element's offset position
		if (elem.offsetParent)
		{
			x = elem.offsetLeft;
			y = elem.offsetTop;
			//loop through all position contexts 
			//and sum up their positions
			while (elem = elem.offsetParent)
			{
				x += elem.offsetLeft;
				y += elem.offsetTop;
			};
		};
		//subtract contexts from from actual position 
		//to calculate relative position
		e.elemX = e.pageX - x;
		e.elemY = e.pageY - y;
		
		//return e which now contains pageX and pageY attributes
		//and provided elements relative position elemX and elemY
		return e;
	};
	//is value in array
	var in_array = function(elem, arr){
		var l = arr.length;
		var ret = false;
		for(var i = 0; i < l; i++)
		{
			if(ret == arr[i])
			{
				ret = true;
				break;
			}
		}
		return ret;
	};
	//emulate mouseout event
	var mouseout = function(dot){
		ob.draw();
		ch.mouseout(dot);
	};
	//force mouse out on all active elements
	var all_out = function(){
		var length = on.length;
		if(length > 0)
		{
			for(var i = 0; i < length; i++)
			{
				mouseout(on[i]);
				on.splice(i, 1);
				length -= 1;
			}
		}
	};
	//check if mouse is in dots range
	var dots_in_range = function(x,y){
		var length = on.length;
		//detect mouse out
		if(length > 0)
		{
			for(var i = 0; i < length; i++)
			{
				if(on[i].nx-radius > x || on[i].nx+radius < x | on[i].ny-radius > y || on[i].ny+radius < y)
				{
					mouseout(on[i]);
					on.splice(i, 1);
					length -= 1;
				}
			}
		}
		length = data.length;
		var ret;
		for(var i = 0; i < length; i++)
		{
			if(data[i].nx-radius <= x && data[i].nx+radius >= x && data[i].ny-radius <= y && data[i].ny+radius >= y)
			{
				ret = data[i];
				if(!in_array(ret, on))
				{
					on.push(ret);
				}
				break;
			}
		}
		return ret;
	};
	//perform dot hover
	var dot_hover = function(dot, expand){
		ctx.fillStyle = ob.conf.color;
		ctx.beginPath();
		if(dot.color)
		{
			ctx.fillStyle = dot.color;
		}
		ctx.arc(dot.x*x_ratio + padding, (ob.conf.height - dot.y*y_ratio)-padding, Math.round(radius*expand),0,full,true);
		ctx.fill();
		ctx.fillStyle = ob.conf.backgroundColor;
	};
	//wrap moveTo for rounding
	var moveTo = function(x,y){
		//ctx.moveTo(x*x_ratio, y*y_ratio);
		ctx.moveTo(Math.round(x), Math.round(y));
	};
	//wrap lineTo for rounding
	var lineTo = function(x,y){
		//ctx.lineTo(x*x_ratio, y*y_ratio);
		ctx.lineTo(Math.round(x), Math.round(y));
	};
	
	this.construct();
}