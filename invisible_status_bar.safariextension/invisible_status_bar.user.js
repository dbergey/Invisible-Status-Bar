// ==UserScript==
// @name          Invisible Status Bar
// @description	  When you don't want Safari's status bar to show / But you still want to know where your clicks are gonna go
// @namespace     http://www.danielbergey.com/

// by Daniel Bergey (http://www.danielbergey.com/)
// ==/UserScript==

(function() {
	
	var styleEl = document.createElement('style');
	styleEl.setAttribute('type', "text/css");
	styleEl.innerText = '#invisibleStatusBar { \
		display: block; \
		visibility: hidden; \
		opacity: 0; \
		background: #ccc; \
		-webkit-border-top-right-radius: 0.5em; \
		-webkit-box-shadow: 0 0 3px rgba(0, 0, 0, 0.75); \
		color: black; \
		position: fixed; \
		z-index: 999999999; \
		padding: 0.5em; \
		bottom: -1px; \
		left: -1px; \
		font: 10px "lucida grande", arial; \
		max-width: 90%; \
		white-space: nowrap; \
		overflow: hidden; \
		text-overflow: ellipsis; \
		-webkit-transition: opacity 250ms; \
	} \
	#invisibleStatusBar.invisibleStatusBarRight { \
		left: auto; \
		right: -1px; \
		-webkit-border-top-right-radius: 0; \
		-webkit-border-top-left-radius: 0.5em; \
	} \
	#invisibleStatusBarPrefix { \
		color: rgba(0, 0, 0, 0.6) \
	}';
	document.getElementsByTagName('head')[0].appendChild(styleEl);
	
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
	
		invisibleStatusBar.innerHTML = '<span id="invisibleStatusBarPrefix">'+ prefix +'</span>' + this_href;
		
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
