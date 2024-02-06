/*!
 * modal.js - Custom Modal Plugin
 * Version: 1.0.0
 * Author: John Patterson
 * Email: john@jpatterson.io
 * Website: https://jpatterson.io
 * License: MIT
 * Description: This modal.js plugin for jQuery has all the features I couldn't find in other plugins: freeze background, light dismiss by clicking outside of modal or pressing escape, trigger custom events, and pass in custom functions and other options. 
 * 
 * Initialize modal with implicit open and with or without options in one call, for example: 
 * //within script     
 * $('#open_dialog').modal()
 * //within html
 *      <button id="open_dialog" rel="#dialog">Open Dialog</button>
 *      <div id="dialog" style="display:none;">
 *          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
 *      </div>
 *  Use the element's ID as selector, using classes could have unpredictable results, especially if more than one element per class exists. Also, I had to wrap the contents in some sort of tag in order for them to be shifted into the "modalBody" class correctly.
 */ 

;(function($) {
	var Modal = function(element, options) {
		this.$element = $(element);
		this.options = $.extend({}, Modal.DEFAULTS, options);
		this.$container = null;
		this.$id = element.id;
		this.$modalHead = $(`<div class="modalHead" for="${this.$id}">`);
		this.$modalBody = $(`<div class="modalBody" for="${this.$id}">`);
		this.init();
	};

	Modal.DEFAULTS = {
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
	};

	Modal.prototype = {
		constructor: Modal,

		init: function() {
			var _this = this;
			if(typeof this.options.onInit === 'function'){
				this.options.onInit.call(this.$element)
			}
			// Create the container
			if(!$('.modalContainer').length){
				this.$container = $('<div class="modalContainer">').appendTo(document.body)
				if(this.options.customClasses.modalContainer){
					this.$container.addClass(this.options.customClasses.modalContainer)
				}
				this.$container.addClass("modalContainer")
			} else {
				this.$container = $('.modalContainer')
			}
			this.$container.hide()
			// Add title bar
			if(!$(`.modalHead[for="${this.$id}"]`).length){
				var closeButton = $('<button class="close" data-dismiss="modal">')
				this.$modalHead.text(this.options.title)
					.addClass(this.options.customClasses.modalHead)
				closeButton.appendTo(this.$modalHead)
				if(this.options.showMaximize){
					var sizeButton = $('<button class="icon-window-maximize resize-modal">')
					sizeButton.appendTo(this.$modalHead)
				}
				this.$element.prepend(this.$modalHead)
				closeButton.addClass(this.options.closeIcon);
			}
			// Add element html to body
			if(!$(`.modalBody[for="${this.$id}"]`).length){
				this.$element.css({
					height: this.options.height,
					width: this.options.width
				})
				this.$modalBody.addClass(this.options.customClasses.modalBody)
				this.$modalBody.append(this.$element.contents().not('.modalHead'))
				this.$element.append(this.$modalBody)
			}

			// Event to close the modal
			this.$element.on('click', '[data-dismiss="modal"]', function(e) {
				e.preventDefault();
				_this.close();
			});
			$(document).on('keydown',function(e){
				if(e.key == 'Escape'){
					_this.close()
				}
			})
			this.$element.on('click','.resize-modal',function(e){
				e.preventDefault();
				
				if(sizeButton.hasClass('icon-window-maximize')){
					sizeButton.toggleClass(['icon-window-maximize','icon-window-restore'])
					_this.$element.css({
						height: "97vh",
						width: "97vw",
						maxHeight: "unset"
					})
				} else if(sizeButton.hasClass('icon-window-restore')){
					sizeButton.toggleClass(['icon-window-maximize','icon-window-restore'])
					_this.$element.css({
						height: _this.options.height,
						width: _this.options.width,
						maxHeight: "initial"
					})
				}
			})
		},

		show: function(newOptions) {
			if(newOptions){
				$.extend(this.options,newOptions)
			}
			if (this.$element.is(':visible')){
				return;
			}
						
			if(typeof this.options.beforeShow === 'function'){
				this.options.beforeShow.call(this.$element)
			}

			this.$element.addClass("modalContent");

			this.$element.on('click', function(e) {
				e.stopPropagation();
			});

			if(document.body.scrollHeight > window.visualViewport.height){
				document.body.style.paddingRight = '16px'
				document.body.style.overflowY = 'hidden'
			}


			this.$element.appendTo(this.$container)
			this.$container.on('click',function(e){
				e.stopPropagation()
				if(!$.contains(this.$element,e.target)){
					this.close()
				} 
			}.bind(this))
			this.$element.show()
			this.$container.show()
			this.$element.trigger('show.modal');
			if(typeof this.options.onShow === 'function'){
				this.options.onShow.call(this.$element)
			}
		},

		close: function() {
			
			if (!this.$element.is(':visible')) return;
			if(typeof this.options.beforeClose === 'function'){
				this.options.beforeClose.call(this.$element)
			}
			this.$element.hide();

			// Reset body styles
			this.$container.css({
				display: 'none',
			});
			$('body').css({
				overflow: 'initial',
				paddingRight: 'initial'
			})

			// Remove the container
			this.$container.hide();
			if(typeof this.options.onClose === 'function'){
				this.options.onClose.call(this.$element)
			}

			this.$element.trigger('close.modal');
			
			if (this.options.destroyOnHide) {
				if(typeof this.options.onDestroy === 'function'){
					this.options.onDestroy.call(this.$element)
				}
				this.destroy();
			}
		},

		destroy: function() {
			if(typeof this.options.onDestroy === 'function'){
				this.options.onDestroy.call(this.$element)
			}
			this.$element.trigger('destroy.modal');
			this.$element.off('.modalContainer').removeData('modal');
			this.$element.empty();
			// this.$element = null;
		}
	};
	$.fn.modal = function(option) {
		return this.each(function() {
			var $this = $(this);
			
			var targetSelector = $this.attr('rel');
			if (targetSelector) {
				var $target = $(targetSelector);
				if (!$target.data('modal')) {
					$target.data('modal', new Modal($target[0], option));

				}
		
				$this.on('click', function(e) {
					e.preventDefault();
					if (typeof option === 'object') {
						$target.modal('show', option);  // Passing the options here
					} else {
						$target.modal('show');
					}
				});
		
				return;
			}
		
			var data = $this.data('modal');
			if (typeof option === 'object') {
				if (!data) {
					$this.data('modal', (data = new Modal(this, option)));
					data.show();
				} else {
					data.show(option);  // Passing the options here
				}
			} else if (typeof option === 'string' && data) {
				data[option]();
			}
		});
	};
})(jQuery);

