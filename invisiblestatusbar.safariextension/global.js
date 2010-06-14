var ISBGlobal = (function() {
	return {
		init: function() {
			// bind message listener
			safari.application.addEventListener('message', function(msg) {
				ISBGlobal[msg.name](msg.message);
			}, false);
		},
		linkOff: function(data) {
			safari.application.activeBrowserWindow.activeTab.page.dispatchMessage('hideStatus', data);
		},
		linkOver: function(data) {
			// make sure we use the right theme
			data.theme = safari.extension.settings.getItem('theme');
			safari.application.activeBrowserWindow.activeTab.page.dispatchMessage('showStatus', data);
		}
	};
})();
ISBGlobal.init();
