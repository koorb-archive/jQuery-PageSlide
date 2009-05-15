/*
	Class: pageSlide
*/
var pageSlide = new Class({
    
    Implements: [Events, Options],
    
    options: {
        wrapperClass: 'wrapper',
        pageClass: 'page',
        currentHandleClass: 'current',
        index: 0,
        id: null,
		duration: 1500,
	   	transition: Fx.Transitions.Quad.easeInOut
    },
    
    /*
        Function: initialize
    */
    initialize: function(mask, handles, options) {
        this.setOptions(options);
        this.mask = $(mask);
        this.handles = handles;
        this.wrapper = this.mask.getElement('.' + this.options.wrapperClass);
        this.pages = this.wrapper.getElements('.' + this.options.pageClass);

        this.handles.each(this.initializeHandle.bind(this));

        this.setCurrentHandle();
        this.resizeMask(false);

		this.scroll = new Fx.Scroll(this.mask, {
		   wait: false,
		   duration: this.options.duration,
		   transition: this.options.transition
		 }).addEvent('start', this.resizeMask.bind(this));
		
		var p = this.getCurrentPage().getPosition(this.wrapper);
		this.scroll.set(p.x, p.y);
    },

    getCurrentPage: function() {
		return this.pages[this.options.index];
	},
	
	setCurrentPage: function(id) {
		this.options.index = id;
		this.setCurrentHandle();
	},
	
    /*
        Function: initializeHandle
    */
    initializeHandle: function(handle, index) {
        handle.addEvent('click', function(ev) {
			ev.preventDefault();
			ev.target.blur();
			this.walk(handle.get('href'), index);
		}.bind(this));
    },
    
	/*
		Function: getCurrentHandle
	*/
	getCurrentHandle: function() {
		return this.handles[this.options.index];
	},

    /*
        Function: setCurrentHandle
    */
    setCurrentHandle: function() {
        if( ! $chk(this.handles)) return false;
        this.handles.filter('.' + this.options.currentHandleClass).removeClass(this.options.currentHandleClass);
        this.getCurrentHandle().addClass(this.options.currentHandleClass);
    },
    
    /*
        Function: resizeMask
    */
    resizeMask: function(tween) {
        
        var new_height = this.getCurrentPage().getStyle('height');
        
        if($pick(tween, true)) {
            this.mask.tween('height', new_height);
        } else {
            this.mask.setStyle('height', new_height);
        }
    },
    
    /*
        Function: walk
    */
    walk: function(id, index) {
		this.setCurrentPage(index);
		if( ! $chk(this.getCurrentPage())) return false;
		var p = this.getCurrentPage().getPosition(this.wrapper);
		this.scroll.start(p.x, p.y);
    }
});
