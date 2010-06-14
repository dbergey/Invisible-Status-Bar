var InvisibleStatusBarInjection = (function() {
	
	// private
	var opacityChangeTimeout;
	
	return {
		init: function() {
			// use 'statusbar' tag to avoid CSS conflicts/overwriting.
			$('<statusbar id="invisibleStatusBar"></statusbar>').appendTo('body');
			$('a[href]').live('mouseover mouseout', function(e) {
				safari.self.tab.dispatchMessage(e.type == 'mouseover' ? 'linkOver' : 'linkOff', {
					href: this.getAttribute('href'),
					target: this.getAttribute('target'),
					clientX: e.clientX,
					clientY: e.clientY,
					altKey: e.altKey,
					ctrlKey: e.ctrlKey,
					metaKey: e.metaKey
				});
			});
			
			safari.self.addEventListener("message", $.proxy(function(msg) {
				this[msg.name](msg.message);
			}, this), false);
		},
		hideStatus: function() {
			
			// so we don't show inside frames
			if (window !== window.top) return;
			
			invisibleStatusBar.style.opacity = '0';
			opacityChangeTimeout = setTimeout(function() {
				clearTimeout(opacityChangeTimeout);
				invisibleStatusBar.style.visibility = 'hidden';
			}, 250);
		},
		showStatus: function(msg) {
			
			// so we don't show inside frames
			if (window !== window.top) return;
			
			// figure out what to do 
			if ( msg.href.match(/^([a-zA-Z]+:)/) )
				var prefix = '';
			else if ( msg.href.match(/^\//) )
				var prefix = location.protocol +'//'+ location.host;
			else if ( msg.href.match(/^#/) )
				var prefix = location.href;
			else
				var prefix = location.href.replace(/\/[^\/]*(\?.*)?$/, '/');
				
			// deal with ../ in <a href>
			var this_href = msg.href;
			while ( this_href.match(/\.\.\//) ) {
				this_href = this_href.replace(/\.\.\//, '');
				prefix = prefix.replace(/[^\/]*\/$/, '');
			}
			
			invisibleStatusBar.innerHTML = '<span id="invisibleStatusBarPrefix">'+ prefix +'</span>' + decodeURI(this_href);
			
			// if cursor would be in the way on left
			var w = window.getComputedStyle(document.getElementById('invisibleStatusBar')).width.replace(/px|%/, '')*1;
			var h = window.getComputedStyle(document.getElementById('invisibleStatusBar')).height.replace(/px|%/, '')*1;
			var winH = document.documentElement.clientHeight;
			invisibleStatusBar.className = ( msg.clientX < (w+15) && msg.clientY > (winH - (h+15)) ) ? 'invisibleStatusBarRight' : 'invisibleStatusBarLeft';
			
			clearTimeout(opacityChangeTimeout);
			invisibleStatusBar.style.visibility = 'visible';
			invisibleStatusBar.style.opacity = '1';
		}
		
		
	};
})();
InvisibleStatusBarInjection.init();