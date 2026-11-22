(function(){
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var bar=document.getElementById('bar');
  window.addEventListener('scroll',function(){
    var h=document.documentElement.scrollHeight-window.innerHeight;
    bar.style.width=(h>0?Math.min(window.scrollY/h*100,100):0)+'%';
  },{passive:true});

  /* particle network that reacts to the cursor */
  var c=document.getElementById('net'),x=c.getContext('2d'),W,H,P=[],m={x:-999,y:-999};
  function size(){
    var d=Math.min(window.devicePixelRatio||1,2);W=innerWidth;H=innerHeight;
    c.width=W*d;c.height=H*d;c.style.width=W+'px';c.style.height=H+'px';x.setTransform(d,0,0,d,0,0);
    var n=Math.round(Math.min(W*H/15000,90));P=[];
    for(var i=0;i<n;i++)P.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35,r:Math.random()*2+1,c:Math.random()<.5?'168,85,247':'251,146,60'});
  }
  function frame(){
    x.clearRect(0,0,W,H);
    for(var i=0;i<P.length;i++){
      var p=P[i];
      if(!reduce){
        p.x+=p.vx;p.y+=p.vy;
        if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;
        var dx=p.x-m.x,dy=p.y-m.y,d=Math.sqrt(dx*dx+dy*dy);
        if(d>0&&d<110){p.x+=dx/d*1.8;p.y+=dy/d*1.8}
        if(d<170){x.strokeStyle='rgba(244,114,182,'+(0.35*(1-d/170))+')';x.beginPath();x.moveTo(p.x,p.y);x.lineTo(m.x,m.y);x.stroke()}
      }
      x.fillStyle='rgba('+p.c+',.85)';x.beginPath();x.arc(p.x,p.y,p.r,0,6.283);x.fill();
      for(var j=i+1;j<P.length;j++){
        var q=P[j],ex=p.x-q.x,ey=p.y-q.y,e=Math.sqrt(ex*ex+ey*ey);
        if(e<125){x.strokeStyle='rgba(200,110,230,'+(0.18*(1-e/125))+')';x.beginPath();x.moveTo(p.x,p.y);x.lineTo(q.x,q.y);x.stroke()}
      }
    }
    if(!reduce)requestAnimationFrame(frame);
  }
  size();frame();
  window.addEventListener('resize',function(){size();if(reduce)frame()});
  window.addEventListener('mousemove',function(e){m.x=e.clientX;m.y=e.clientY});
  document.addEventListener('mouseleave',function(){m.x=-999;m.y=-999});

  /* typing effect */
  var roles=['Data Engineer','Cloud Analytics Enthusiast','Full-Stack Developer','Competitive Programmer'],r=0,k=0,del=false,el=document.getElementById('role');
  function type(){
    var w=roles[r];
    el.textContent=w.slice(0,k);
    if(!del&&k===w.length){del=true;setTimeout(type,1500);return}
    if(del&&k===0){del=false;r=(r+1)%roles.length}
    k+=del?-1:1;
    setTimeout(type,del?40:80);
  }
  if(!reduce){k=0;type()}

  if(reduce)return;
  document.querySelectorAll('[data-count]').forEach(function(n){
    var t=parseFloat(n.getAttribute('data-count')),d=parseInt(n.getAttribute('data-dec')||'0',10),s=n.getAttribute('data-suf')||'',st=null;
    function f(ts){st=st||ts;var p=Math.min((ts-st)/1500,1);n.textContent=(t*(1-Math.pow(1-p,3))).toFixed(d)+s;if(p<1)requestAnimationFrame(f)}
    n.textContent=(0).toFixed(d)+s;requestAnimationFrame(f);
  });
  if(!('IntersectionObserver' in window))return;
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.1});
  document.querySelectorAll('section,.card,.item,.sg').forEach(function(el2){
    var i=Array.prototype.indexOf.call(el2.parentNode.children,el2);
    el2.style.transitionDelay=Math.min(i*0.1,0.4)+'s';
    el2.classList.add('reveal');io.observe(el2);
  });
})();