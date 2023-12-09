document.addEventListener('DOMContentLoaded', function() {

    let eventsHandler;
    let pannedX = 0;
    let pannedY = 0;
    
    eventsHandler = {
      haltEventListeners: ['touchstart', 'touchend', 'touchmove', 'touchleave', 'touchcancel'],
      init: function(options) {
        const instance = options.instance;
        let initialScale = 1;
        
        // Init Hammer
        // Listen only for pointer and touch events
        this.hammer = new Hammer.Manager(options.svgElement, {
          inputClass: Hammer.SUPPORT_POINTER_EVENTS ? Hammer.PointerEventInput : Hammer.TouchInput
        });
        
        // Enable pinch
        this.hammer.add(new Hammer.Pinch({ enable: true }));
        
        // Handle double tap
        this.hammer.add(new Hammer.Tap({ event: 'doubletap', taps: 2 }));
        this.hammer.on('doubletap', function(ev){
          instance.zoomIn()
        });
        
        // Handle pan start
        this.hammer.add(new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 0 }));

        this.hammer.on('panstart', function(ev) {

          // Reset panned variables
          pannedX = 0;
          pannedY = 0;
        });
  
        // Handle pan move
        this.hammer.on('panmove', function(ev) {

          // Pan only the difference
          instance.panBy({ x: ev.deltaX - pannedX, y: ev.deltaY - pannedY });
          pannedX = ev.deltaX;
          pannedY = ev.deltaY;
        });
        
        // Handle pinch
        this.hammer.on('pinchstart pinchmove', function(ev){

          // On pinch start remember initial zoom
          if (ev.type === 'pinchstart') {
            initialScale = instance.getZoom()
            instance.zoomAtPoint(initialScale * ev.scale, {x: ev.center.x, y: ev.center.y})
          }
          
          instance.zoomAtPoint(initialScale * ev.scale, {x: ev.center.x, y: ev.center.y})
        });
        
        // Prevent moving the page on some devices when panning over SVG
        options.svgElement.addEventListener('touchmove', function(e){ e.preventDefault(); });
      },
      
      destroy: function(){
        this.hammer.destroy();
      }
    };
    
    // Initialize the svg-pan-zoom library
    let panZoom = svgPanZoom(svgElement, {
      viewportSelector: '#svgContainer',
      zoomEnabled: true,
      controlIconsEnabled: false,
      fit: true,
      center: true,
      minZoom: 1,
      maxZoom: 2000,
      contain: true,
      customEventsHandler: eventsHandler
    });

    function resetSvgPosition() {
        setTimeout(function() {
          panZoom.resetZoom();
          panZoom.resetPan();
        }, 500);
      }

    document.getElementById("home").addEventListener("click", function() {
        resetSvgPosition();
    });

    document.getElementById("replay").addEventListener("click", function() {
        resetSvgPosition();
    });

    document.getElementById("back-to-menu-button-1").addEventListener("click", function() {
        resetSvgPosition();
    });

    document.getElementById("back-to-menu-button-2").addEventListener("click", function() {
        resetSvgPosition();
    });

    document.getElementById('back-to-menu-button-3').addEventListener("click", function() {
    resetSvgPosition();
    });

    //ajouter les autres boutons par la suite...
    
    document.getElementById("loading").style.display = "none";
  });