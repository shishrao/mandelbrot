(function($) {

  var mandelbrot = null;

  function sniff() {
    if (mandelbrot.calculating) {
      $('#shadow').fadeIn(1000);
      showProgress();
    }
    else {
      setTimeout(function() {
        sniff();
      }, 100);
    }
  }

  function showProgress() {
    if (mandelbrot.calculating) {
      $('#progress').css('width', mandelbrot.percentage = '%');
      setTimeout(function() {
        showProgress();
      }, 100);
    }
    else {
      $('#shadow').fadeOut(100);
      sniff();
    }
  }

  $(function() {
    
    var width = $(window).width();
    var height = $(window).height();

    var xmax = 1;
    var xmin = -2;
    var ymax = 1;
    var ymin = -1;

    if (width > height) {
      var two = (ymax - ymin) / height * width / 2;
      xmax = two - (two / 5);
      xmin = -1 * (two + (two / 5));
    }
    else {
      ymax = (xmax - xmin) / width * height / 2;
      ymin = -1 * ymax;
    }

    var iterations = 100;

    // mandelbrot = new Mandelbrot();
    mandelbrot = new Mandelbrot(width, height, xmin, xmax, ymin, ymax, iterations);
    mandelbrot.calculate();

    // sniff();
    $('[data-toggle=popover]').popover();
  })

  $('#mandelimage').on('mousedown', function(e) {
    var x = e.clientX - this.offsetLeft + $(window).scrollLeft();
    var y = e.clientY - this.offsetTop + $(window).scrollTop();
    mandelbrot.zoom(x, y, 1);
  })

  $('#mandelimage').on('mouseover', function(e) {
    var x = e.clientX - this.offsetLeft + $(window).scrollLeft();
    var y = e.clientY - this.offsetTop + $(window).scrollTop();

    //$("#marker").css('top', y);
    //$("#marker").css('left', x);

    var mx = mandelbrot.xmin + (x / mandelbrot.width) * (mandelbrot.xmax - mandelbrot.xmin);
    var my = mandelbrot.ymin + (y / mandelbrot.height) * (mandelbrot.ymax - mandelbrot.ymin);

    var message = "x: " + x + " | y: " + y + " | mx: " + mx + " | my: " + my;
    //$("#console").text(message);
  })
  

  // $("#marker").on('mouseover', function(e) {
  //   e.preventDefault();
  // });
  // $("#marker").on('mousedown', function(e) {
  //   e.preventDefault();
  // });

  // $(window).on('mousemove', function(e) {
  //   var x = e.clientX - this.offsetLeft + $(window).scrollLeft();
  //   var y = e.clientY - this.offsetTop + $(window).scrollTop();

    
  // });

})(window.jQuery);