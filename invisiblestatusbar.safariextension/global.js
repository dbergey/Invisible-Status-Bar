var ISBGlobal = (function() {
	return {
		persistentSettingsKeys: {
			secure: [],
			unsecure: ['theme']
		},
		
		init: function() {
			// bind message listener
			safari.application.addEventListener('message', function(msg) {
				ISBGlobal[msg.name](msg.message);
			}, false);
			
			// bind settings change listeners
			safari.extension.settings.addEventListener("change", this.saveSettingsToLocalStorage, false);
			safari.extension.secureSettings.addEventListener("change", this.saveSettingsToLocalStorage, false);
			
			// make sure we have settings
			this.retrieveSettingsFromLocalStorage();
		},
		
		retrieveSettingsFromLocalStorage: function() {
			var keys = ISBGlobal.persistentSettingsKeys;
			for (x in keys.secure)
				if (!safari.extension.secureSettings[keys.secure[x]])
					safari.extension.secureSettings.setItem(keys.secure[x], localStorage.getItem(keys.secure[x]));
			for (x in keys.unsecure)
				if (!safari.extension.settings.getItem(keys.unsecure[x]))
					safari.extension.settings.setItem(keys.unsecure[x], localStorage.getItem(keys.unsecure[x]));
		},
		saveSettingsToLocalStorage: function(e) {
			var keys = ISBGlobal.persistentSettingsKeys;
			for (x in keys.secure)
				localStorage.setItem(keys.secure[x], safari.extension.secureSettings.getItem(keys.secure[x]));
			for (x in keys.unsecure)
				localStorage.setItem(keys.unsecure[x], safari.extension.settings.getItem(keys.unsecure[x]));
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
