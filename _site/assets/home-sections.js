(function(){"use strict";
if(document.querySelector(".case-frame video")){
  (function(){
    var vids = document.querySelectorAll(".case-frame video");
    if (!vids.length) return;
    vids.forEach(function(v){ v.muted = true; v.controls = false; v.removeAttribute("controls"); });
    if (!("IntersectionObserver" in window)){ vids.forEach(function(v){ v.play().catch(function(){}); }); return; }
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if (en.isIntersecting) en.target.play().catch(function(){});
        else en.target.pause();
      });
    }, {threshold:0, rootMargin:"200px 0px 200px 0px"});
    vids.forEach(function(v){ io.observe(v); });
  })();
}
if(document.querySelector(".ba-slider")){
  document.querySelectorAll(".ba-slider").forEach(function(s){
    var range = s.querySelector(".ba-range"), dragging = false, touched = false;
    function set(p){ p = Math.max(0, Math.min(100, p)); s.style.setProperty("--pos", p + "%"); range.value = Math.round(p); }
    function fromX(x){ var r = s.getBoundingClientRect(); set((x - r.left) / r.width * 100); }
    s.addEventListener("pointerdown", function(e){ if (e.pointerType !== "mouse") return; dragging = true; touched = true; s.setPointerCapture(e.pointerId); fromX(e.clientX); });
    s.addEventListener("pointermove", function(e){ if (dragging) fromX(e.clientX); });
    ["pointerup", "pointercancel", "pointerleave"].forEach(function(t){ s.addEventListener(t, function(){ dragging = false; }); });
    var tx = 0, ty = 0, horiz = null;
    s.addEventListener("touchstart", function(e){ tx = e.touches[0].clientX; ty = e.touches[0].clientY; horiz = null; touched = true; }, {passive:true});
    s.addEventListener("touchmove", function(e){
      var t = e.touches[0];
      if (horiz === null) horiz = Math.abs(t.clientX - tx) > Math.abs(t.clientY - ty);
      if (horiz){ e.preventDefault(); fromX(t.clientX); }
    }, {passive:false});
    range.addEventListener("input", function(){ touched = true; set(+range.value); });
    
    if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches){
      var io = new IntersectionObserver(function(en){
        if (!en[0].isIntersecting) return;
        io.disconnect();
        var steps = [50, 30, 70, 50], i = 0;
        (function next(){ if (touched || i >= steps.length) return; animate(steps[i++], next); })();
      }, {threshold:.6});
      io.observe(s);
    }
    function animate(to, done){
      var from = parseFloat(s.style.getPropertyValue("--pos")) || 50, t0 = null;
      function step(t){
        if (touched) return;
        if (t0 === null) t0 = t;
        var k = Math.min(1, (t - t0) / 650), e = k < .5 ? 2*k*k : 1 - Math.pow(-2*k + 2, 2) / 2;
        set(from + (to - from) * e);
        if (k < 1) requestAnimationFrame(step); else setTimeout(done, 120);
      }
      requestAnimationFrame(step);
    }
  });
}
var WA = "447734356942";
if(document.querySelector("#quoteForm")){
  document.getElementById("quoteForm").addEventListener("submit", function(e){
    e.preventDefault();
    var f = e.target;
    var v = function(k){ return (f.elements[k] && f.elements[k].value || "").trim(); };
    if (!v("name") || !v("phone")){
      var bad = !v("name") ? f.elements.name : f.elements.phone;
      bad.focus();
      bad.style.borderColor = "#E4574C";
      setTimeout(function(){ bad.style.borderColor = ""; }, 2200);
      return;
    }
    var lines = ["Hi Lewis, I found you on your website and would like a quote.", "", "Name: " + v("name"), "Phone: " + v("phone")];
    if (v("service")) lines.push("Service: " + v("service"));
    if (v("detail")) lines.push("Details: " + v("detail"));
    var url = "https://wa.me/" + WA + "?text=" + encodeURIComponent(lines.join("\n"));
    var win = window.open(url, "_blank");
    if (!win) window.location.href = url;
  });
}
if(document.getElementById("owGrid")){(function(){
  var items=Array.prototype.slice.call(document.querySelectorAll("#owGrid .ow-item"));
  var lb=document.getElementById("lightbox"),lbImg=document.getElementById("lbImg"),lbCap=document.getElementById("lbCap"),ci=0;
  function show(){var im=items[ci].querySelector("img"),cap=items[ci].querySelector(".gal-cap");lbImg.src=im.src;lbImg.alt=im.alt;lbCap.innerHTML=(cap?cap.textContent:"")+"<small>"+(ci+1)+" of "+items.length+"</small>";}
  function open(n){ci=n;show();lb.classList.add("open");document.body.style.overflow="hidden";}
  function close(){lb.classList.remove("open");document.body.style.overflow="";}
  function go(d){ci=(ci+d+items.length)%items.length;show();}
  items.forEach(function(it,n){it.addEventListener("click",function(){open(n);});});
  document.getElementById("lbClose").addEventListener("click",close);
  document.getElementById("lbPrev").addEventListener("click",function(e){e.stopPropagation();go(-1);});
  document.getElementById("lbNext").addEventListener("click",function(e){e.stopPropagation();go(1);});
  lb.addEventListener("click",function(e){if(e.target===lb)close();});
  document.addEventListener("keydown",function(e){if(!lb.classList.contains("open"))return;if(e.key==="Escape")close();if(e.key==="ArrowLeft")go(-1);if(e.key==="ArrowRight")go(1);});
})();}
})();
