  modal.js - Custom Modal Plugin  
Version: 1.0.0  
Author: John Patterson  
Email: john@jpatterson.io  
Website: https://jpatterson.io  
License: MIT  
Description: This modal.js plugin for jQuery has all the features I couldn't find in other plugins: freeze background, light dismiss by clicking outside of modal or pressing escape, trigger custom events, and pass in custom functions and other options.  
  
Initialize modal with implicit open and with or without options in one call, for example:  
//within script  
  `$('#open_dialog').modal()`  
  
//within html  
```
       <button id="open_dialog" rel="#dialog">Open Dialog</button>
       <div id="dialog" style="display:none;">
           <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
       </div>
```  
Use the element's ID as selector, using classes could have unpredictable results, especially if more than one element per class exists. Also, I had to wrap the contents in some sort of tag in order for them to be shifted into the "modalBody" class correctly.  

These options are set as default -- to change any of them, pass in an options object:  
```
customOptions= {
  autoOpen: true,  
  destroyOnHide: false,
  title: '\xa0',
  customClasses: {
  	modalHead: null,
  	modalBody: null,
  	close: null,
  	modalContainer: null,
  	modalContent: null,
    },
  closeIcon: 'icon-cancel',
  onInit: null,
  beforeShow: null,
  onShow: null,
  beforeClose: null,
  onClose: null,
  onDestroy: null,
  height: `${window.visualViewport.height/2}px`,
  width: `${window.visualViewport.width/2}px`,
  showMaximize: true,
  });

$('#open-modal').modal(options=customOptions)
```  
I used fontello to provide icons for `icon-cancel`, `icon-window-maximize`, and `icon-window-restore`. They're not included here, but you can replace the classes with whichever works best for you, including ❌➖⬆️, whatever.
