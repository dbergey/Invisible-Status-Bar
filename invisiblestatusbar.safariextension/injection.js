var ISBInjection = (function() {
	
	// private
	var visibilityChangeTimeout;
	var isb; // element
	
	return {
		init: function() {
			// TODO: figure out how to do "live" events w/out using jQuery :D
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
			
			// bind message listener
			safari.self.addEventListener("message", function(msg) {
				ISBInjection[msg.name](msg.message);
			}, false);
			
			isb = document.createElement('isb');
			
			// so we don't insert inside iframes or on pages without a body (i.e. frameset, ew)
			if (window !== window.top || !document.getElementsByTagName('body').length ) return;
			
			// use '<isb>' tag to avoid CSS conflicts/overwriting.
			document.getElementsByTagName('body')[0].appendChild(isb);
		},
		hideStatus: function() {
			
			// so we don't show/hide inside iframes or on pages without a body (i.e. frameset, ew)
			if (window !== window.top || !document.getElementsByTagName('body').length ) return;
			
			isb.style.opacity = '0';
			visibilityChangeTimeout = setTimeout(function() {
				clearTimeout(visibilityChangeTimeout);
				isb.style.visibility = 'hidden';
				isb.style.position = 'absolute';
			}, 250);
		},
		showStatus: function(msg) {
			
			// so we don't show/hide inside iframes or on pages without a body (i.e. frameset, ew)
			if (window !== window.top || !document.getElementsByTagName('body').length ) return;
			
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
			
			isb.innerHTML = '<isb_span>'+ prefix +'</isb_span>' + decodeURI(this_href);
			
			// if cursor would be in the way on left
			var w = window.getComputedStyle(document.getElementsByTagName('isb')[0]).width.replace(/px|%/, '')*1;
			var h = window.getComputedStyle(document.getElementsByTagName('isb')[0]).height.replace(/px|%/, '')*1;
			var winH = document.documentElement.clientHeight;
			
			isb.setAttribute('side', ( msg.clientX < (w+15) && msg.clientY > (winH - (h+15)) ) ? 'right' : 'left');
			isb.setAttribute('theme', msg.theme);
			
			clearTimeout(visibilityChangeTimeout);
			isb.style.visibility = 'visible';
			isb.style.position = 'fixed';
			isb.style.opacity = '1';
		}
		
		
	};
})();
ISBInjection.init();