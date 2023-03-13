(function() {
   var lastTime = 0;
    var browsers = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < browsers.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[browsers[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[browsers[x]+'CancelAnimationFrame'] 
                                   || window[browsers[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			console.log(timeToCall);
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id); };
}());

(function () {
	$.fn.animaCanvas = function(options) {
		var defaults = {
			h: null,
			w: null,
			img: null,
			loop: false,
			totalLoop: null,
			totalFrames: null,
			framesBreak: null,
			fps: 12,
		};
		defaults = $.extend( {}, defaults, options );

		if (defaults.framesBreak == null) defaults.framesBreak = defaults.totalFrames;

		var $this = $(this),
			$name = $(this).attr('id');
				
		var callAnima;
		var canvasAnima,
			canvasImage,
			canvas;
			
		// Get Canvas
		canvas = document.getElementById($name);
		canvas.height = defaults.h;
		canvas.width = defaults.w;
		
		// Create Sprite Sheet		
		canvasImage = new Image();
		canvasAnima = spriteSheet({
			context: canvas.getContext("2d"),
			image: canvasImage,
			width: defaults.w * defaults.totalFrames,
			height: defaults.h * Math.ceil(defaults.totalFrames / defaults.framesBreak),
			numberFrames: defaults.totalFrames,
			framesPerFrame: (defaults.fps / 12) * 2
		});
		
		// VERIFICA O TIPO DE LISTENER
		function addListener(el, ev, fn) {
			// Usa addEventListener
			if (el.addEventListener) {
				el.addEventListener(ev, fn, false);
			// Senão usa attachEvent
			} else if (el.attachEvent) {
			  	el.attachEvent('on' + ev, (function (elem) {
					return function() { fn.call(elem, window.event); };
			  	}(el)));
				
				el = null; // Break Closure
			}
		}
		
		// Load Sprite Sheet
		addListener(canvasImage, 'load', animaLoop);
		canvasImage.src = defaults.img;
	
		function animaLoop() {
		  	callAnima = requestAnimationFrame(animaLoop);
			
			canvasAnima.update();
			canvasAnima.render();
		}
		
		function spriteSheet(options) {
			var that = {},
				breakLine = 0,
				frameBreak = 0,
				frameCount = 0,
				frameIndex = 0,
				numBreak = defaults.framesBreak,
				framesPerFrame = options.framesPerFrame || 1,
				numberFrames = options.numberFrames || 1;
			
			that.context = options.context;
			that.width = options.width;
			that.height = options.height;
			that.image = options.image;
			
			var wImg = that.width / numberFrames,
				hImg = that.height / Math.ceil(defaults.totalFrames / defaults.framesBreak);
			
			that.update = function () {
				frameCount += 1;
	
				if (frameCount > framesPerFrame) {
					frameCount = 0;
										
					if (frameIndex == numberFrames - 1) {
						if (!defaults.loop){
							$this.trigger("fimAnima");
							cancelAnimationFrame(callAnima);
						} else {
							frameIndex = 0;
							frameBreak = 0;
							breakLine = 0;
							numBreak = defaults.framesBreak;
						}
					} else {
						frameIndex++;
						frameBreak++;
						
						if (frameIndex == numBreak) {
							frameBreak = 0;
							numBreak += defaults.framesBreak;
							breakLine++; }
					}
				}
			};
			
			that.render = function () {
			  	// Clear the Canvas
			  	that.context.clearRect(0, 0, that.width, that.height);
			  
				that.context.drawImage(
					that.image,
					frameBreak * wImg,
					breakLine * hImg,
					wImg,
					that.height,
					0,
					0,
					wImg,
					that.height);
				};
			
				return that;
			};
		}
}());

