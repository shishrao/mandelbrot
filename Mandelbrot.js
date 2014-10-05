
 
function Mandelbrot(width, height, xmin, xmax, ymin, ymax, iterations)
{
  this.width = width || 900;
  this.height = height || 600;
  this.xmin = xmin || -2;
  this.xmax = xmax || 1;
  this.ymin = ymin || -1;
  this.ymax = ymax || 1;
  this.iterations = iterations || 1000;
  //this.cd = document.getElementById('calcdata');

  console.log(
    this.width,
    this.height,
    this.xmin,
    this.xmax,
    this.ymin,
    this.ymax,
    this.iterations);

  this.imin = this.iterations;
  this.imax = 0;
  this.data = new Array();

  this.ctx = $('#mandelimage')[0].getContext("2d");
  this.ctx.width = this.width;
  this.ctx.height = this.height;
  this.img = this.ctx.getImageData(0, 0, this.width, this.height);
  this.pix = this.img.data;

  this.percentage = 0;
  this.calculating = false;
  this.redraw = false;
  this.draw();
}

Mandelbrot.prototype.draw = function() {
  
  if (this.redraw) {
    console.log('redrawing...');

    for (var ix = 0; ix < this.width; ++ix) {
      for (var iy = 0; iy < this.height; ++iy) {

        var ppos = 4 * (this.width * iy + ix);
        
        if (this.data[ix][iy] == this.iterations)
        {
          this.pix[ppos] = 0;
          this.pix[ppos+1] = 0;
          this.pix[ppos+2] = 0;
        }
        else
        {
          var c = 3*Math.log(this.data[ix][iy])/Math.log(this.imax);
          //var c = this.data[ix][iy] / this.imax;
          if (c < 1)
          {
            this.pix[ppos] = 0;
            this.pix[ppos+1] = 0;
            this.pix[ppos+2] = 255 * c;
          }
          else if (c < 2)
          {
            this.pix[ppos] = 0;
            this.pix[ppos+1] = 255 * (c - 1);
            this.pix[ppos+2] = 255 * (1 - (c - 1));
          }
          else
          {
            this.pix[ppos] = 255 * (c - 2);
            this.pix[ppos+1] = 255 * (1 - (c - 2));
            this.pix[ppos+2] = 0;
          }
        }
        this.pix[ppos+3] = 255;
      }
    }

    this.ctx.putImageData(this.img,0,0);
    this.redraw = false;
  }

  // Keep checking if the canvas needs to be redrawn
  var self = this;
  setTimeout(function() {
    self.draw();
  }, 100);
}

Mandelbrot.prototype.iterate =  function (cx, cy, maxiter)
{
  var i;
  var x = 0.0;
  var y = 0.0;
  for (i = 0; i < maxiter && x*x + y*y <= 4; ++i)
  {
    var tmp = 2*x*y;
    x = x*x - y*y + cx;
    y = tmp + cy;
  }
  return i;
}

Mandelbrot.prototype.calculate =  function ()
{
  this.calculating = true;

  for (var ix = 0; ix < this.width; ++ix) {
    for (var iy = 0; iy < this.height; ++iy) {

      var x = this.xmin + (this.xmax-this.xmin)*ix/(this.width-1);
      var y = this.ymin + (this.ymax-this.ymin)*iy/(this.height-1);
      var i = this.iterate(x, y, this.iterations);

      if (i > this.imax) { this.imax = i; }
      if (i < this.imin) { this.imin = i; }

      if (!this.data[ix]) {
        this.data[ix] = new Array();
      }
      this.data[ix][iy] = i;
    }

    this.percentage = ix / this.width;
  }

  console.log('Iterations: ', this.iterations, this.imin, this.imax);

  this.calculating = false;
  this.redraw = true;
}

Mandelbrot.prototype.zoom = function(x, y, zoom) {
  var zoom = (zoom || 1) * 10;

  console.log(x, y, zoom);

  var xmid = this.xmin +  (x / this.width) * (this.xmax - this.xmin);
  var ymid = this.ymin + (y / this.height) * (this.ymax - this.ymin);

  console.log(xmid, ymid);

  var xf = Math.abs(this.xmax - this.xmin) / zoom;
  this.xmin = xmid - xf;
  this.xmax = xmid + xf;

  var yf = Math.abs(this.ymax - this.ymin) / zoom;
  this.ymin = ymid - yf;
  this.ymax = ymid + yf;

  console.log(this.xmin, this.xmax, this.ymin, this.ymax);

  this.iterations *= 2;

  this.calculate();
}
