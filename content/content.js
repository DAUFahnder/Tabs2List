'use strict';

/* Options for date */
const options = { 
	year: 'numeric', 
	month: '2-digit', 
	day: 'numeric', 
	hour: '2-digit', 
	minute: '2-digit'
};

/* Locale for date */
const locale = window.navigator.languages[0];

/* Helper function to replace HTML chars in tab titles */
function html_encode(string) {
	return string.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;").replace(/,/g, "&#44;");
}

/* Vars */
var tmpCSV, tmpHTML;

/* Create HTML / CSV Content */
function getList() {
	var Tab2list = document.getElementById( 'tabs-2-list' );
	Tab2list.textContent = '';
	tmpCSV = "";
	tmpHTML = '<ul>';
	var allTabs = browser.tabs.query( { currentWindow: true } );
	allTabs.then( ( tabs ) => {
		for(let tab of tabs) {
			let tabURL = tab.url;
			let tabTitle = html_encode(tab.title);
			if( tabURL.indexOf('moz-extension://') == -1 ) {
				tmpHTML += '<li><a target="_blank" href="' + tabURL + '">' + tabTitle + '</a></li>';
				tmpCSV += tabTitle + "," + tabURL + "\n";
			}
		}
	}).then( () => {
		tmpHTML += '</ul>';
		Tab2list.innerHTML = tmpHTML;
		
		tmpHTML = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>' + browser.i18n.getMessage('extension_name') + ' - Export</title></head><body><style>body,ul{margin:0}body{font-family:"Segoe UI","San Francisco",Ubuntu,"Fira Sans",Roboto,Arial,Helvetica,sans-serif;background-color:#fff;padding:10px}ul{list-style-type:none;padding:0}a{color:#0c0c0d;text-decoration:none}a:hover{color:#0060df}</style>' + tmpHTML + '</body></html>';
	});
}

/* Export Function */
document.querySelectorAll( '.export-list' ).forEach(
	function(currentValue, currentIndex) { 
		currentValue.addEventListener( 'click' , (e) => {
			let exportType = e.target.getAttribute( 'data' );
			let exportDate = new Date().toLocaleDateString( locale , options );
			exportDate = exportDate.replace(/\W+/g, "-");
			if( exportType == 'html' ) {
				var fileData = tmpHTML;
				var fileName = 'TabList-' + exportDate + '.html';
			} else {
				var fileData = tmpCSV;
				var fileName = 'TabList-' + exportDate + '.csv';
			}
			
			browser.downloads.download({
				saveAs : true,
				url : URL.createObjectURL( new Blob( [ fileData ] ) ),
				filename : fileName
			});
		});
	}
);

window.addEventListener( 'DOMContentLoaded' , getList );
