// ==UserScript==
// @name          Invisible Status Bar
// @description	  When you don't want Safari's status bar to show / But you still want to know where your clicks are gonna go
// @namespace     http://www.danielbergey.com/

// by Daniel Bergey (http://www.danielbergey.com/)
// ==/UserScript==

(function() {

	console.log(safari.extension);
	var theme = 'classic';
	safari.extension.addContentStyleSheetFromURL(safari.extension.baseURI +'themes/'+ theme +'.css');
	
	var invisibleStatusBar = document.createElement('div');
	invisibleStatusBar.id = 'invisibleStatusBar';
	document.getElementsByTagName('body')[0].appendChild(invisibleStatusBar);
	
	var visibilityChangeTimeout;
	
	function applyRolloverEvents(event) {
		 // ignore our own insertion events
		if ( event && event.relatedNode.id == 'invisibleStatusBar' || document.getElementById('Firebug') ) return;
		// use a timeout to throttle event adding
		clearTimeout(window.invisibleStatusBarTimeout);
		window.invisibleStatusBarTimeout = setTimeout(function() {
			// console.log('Applying invisible status bar events.');
			var aTags = document.getElementsByTagName('a');
			for (a in aTags) {
				if ( aTags[a].addEventListener ) {
					aTags[a].addEventListener('mouseover', showStatus, false);
					aTags[a].addEventListener('mouseout', hideStatus, false);
				}
			}
		}, 500);
	};
	
	function hideStatus() {
		invisibleStatusBar.style.opacity = '0';
		visibilityChangeTimeout = setTimeout(function() {
			clearTimeout(visibilityChangeTimeout);
			invisibleStatusBar.style.visibility = 'hidden';
		}, 250);
	};
	
	function showStatus(event) {
		// figure out what to do 
		if ( this.getAttribute('href').match(/^([a-zA-Z]+:)/) )
			var prefix = '';
		else if ( this.getAttribute('href').match(/^\//) )
			var prefix = location.protocol +'//'+ location.host;
		else if ( this.getAttribute('href').match(/^#/) )
			var prefix = location.href;
		else
			var prefix = location.href.replace(/\/[^\/]*(\?.*)?$/, '/');
		
		// deal with ../ in <a href>
		var this_href = this.getAttribute('href');
		while ( this_href.match(/\.\.\//) ) {
			this_href = this_href.replace(/\.\.\//, '');
			prefix = prefix.replace(/[^\/]*\/$/, '');
		}
	
		invisibleStatusBar.innerHTML = '<span id="invisibleStatusBarPrefix">'+ prefix +'</span>' + decodeURI(this_href);
		
		// if cursor would be in the way on left
		var w = window.getComputedStyle(document.getElementById('invisibleStatusBar')).width.replace(/px|%/, '')*1;
		var h = window.getComputedStyle(document.getElementById('invisibleStatusBar')).height.replace(/px|%/, '')*1;
		var winH = document.documentElement.clientHeight;
		invisibleStatusBar.className = ( event.clientX < (w+15) && event.clientY > (winH - (h+15)) ) ? 'invisibleStatusBarRight' : 'invisibleStatusBarLeft';
		
		clearTimeout(visibilityChangeTimeout);
		invisibleStatusBar.style.visibility = 'visible';
		invisibleStatusBar.style.opacity = '0.95';
	};
	
	// if we are not in an iframe
	if (window.location.href == window.parent.location.href) {
		document.addEventListener('DOMNodeInserted', applyRolloverEvents);
		applyRolloverEvents();
	}
	
})();
