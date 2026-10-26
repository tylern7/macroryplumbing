/* MacRory Plumbing: nav, smooth scroll, hero bubbles, form */
(function(){
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var yr=document.getElementById('yr'); if(yr) yr.textContent=new Date().getFullYear();
  var b=document.querySelector('.burger'), m=document.getElementById('menu');
  function set(o){ m.classList.toggle('open',o); b.setAttribute('aria-expanded',o); b.setAttribute('aria-label',o?'Close menu':'Open menu'); }
  b.addEventListener('click',function(){ set(!m.classList.contains('open')); });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape') set(false); });
  document.querySelectorAll('a[href^="#"]').forEach(function(a){ a.addEventListener('click',function(e){
    var t=a.getAttribute('href').length>1&&document.querySelector(a.getAttribute('href')); if(!t) return;
    e.preventDefault(); set(false); t.scrollIntoView({behavior:reduce?'auto':'smooth'}); history.replaceState(null,'',a.getAttribute('href')); }); });

  if('IntersectionObserver' in window){
    var links=[].slice.call(m.querySelectorAll('a'));
    var so=new IntersectionObserver(function(es){ es.forEach(function(en){ if(en.isIntersecting) links.forEach(function(l){ l.classList.toggle('active',l.getAttribute('href')==='#'+en.target.id); }); }); },{rootMargin:'-45% 0px -50% 0px'});
    document.querySelectorAll('main section[id]').forEach(function(s){ so.observe(s); });
    if(!reduce){ var ro=new IntersectionObserver(function(es){ es.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('in'); ro.unobserve(en.target);} }); },{threshold:.1});
      document.querySelectorAll('.svc,.about__grid>*,.rev,.form,.cinfo').forEach(function(el){ el.classList.add('rv'); ro.observe(el); }); }
  }

  // Light bubbles in the dark hero only; paused off-screen
  var c=document.getElementById('bubbles');
  if(c&&!reduce){
    var x=c.getContext('2d'),W,H,d=Math.min(devicePixelRatio||1,2),bs=[],vis=true;
    function sz(){ W=c.clientWidth;H=c.clientHeight;c.width=W*d;c.height=H*d;x.setTransform(d,0,0,d,0,0); }
    function mk(i){ var r=Math.random()*5+1.5; return {x:Math.random()*W,y:i?Math.random()*H:H+10,r:r,s:.3+Math.random()*.5+r*.06,p:Math.random()*6,a:.15+Math.random()*.3}; }
    sz(); for(var i=0;i<Math.min(55,W/22);i++) bs.push(mk(1)); addEventListener('resize',sz);
    new IntersectionObserver(function(e){ vis=e[0].isIntersecting; if(vis) requestAnimationFrame(t); }).observe(c);
    function t(){ if(!vis) return; x.clearRect(0,0,W,H);
      bs.forEach(function(o,i){ o.y-=o.s;o.p+=.02; var px=o.x+Math.sin(o.p)*5; if(o.y<-10) bs[i]=mk(0);
        x.beginPath();x.arc(px,o.y,o.r,0,7);x.strokeStyle='rgba(200,232,255,'+o.a*1.6+')';x.lineWidth=1;x.stroke();
        x.fillStyle='rgba(186,222,247,'+o.a*.35+')';x.fill();
        x.beginPath();x.arc(px-o.r*.35,o.y-o.r*.35,o.r*.25,0,7);x.fillStyle='rgba(255,255,255,'+o.a*2+')';x.fill(); });
      requestAnimationFrame(t); }
  }

  // Form: POST to action via fetch (Formspree). Placeholder → mailto fallback.
  var f=document.getElementById('quote');
  if(f){ var st=f.querySelector('.status');
    f.addEventListener('submit',function(e){ e.preventDefault(); var D=new FormData(f);
      if(D.get('_gotcha')) return;
      if(!(D.get('Name')||D.get('Contact')||D.get('Message'))){ st.textContent='Please add your name, a way to reach you, and a short message.'; return; }
      if(f.action.indexOf('YOUR_FORM_ID')>-1){
        var body='Name: '+D.get('Name')+'\nEmail or Phone: '+D.get('Contact')+'\nAddress: '+D.get('Address')+'\n\n'+D.get('Message');
        location.href='mailto:'+f.dataset.mailto+'?subject='+encodeURIComponent('Quote request'+(D.get('Name')?' – '+D.get('Name'):''))+'&body='+encodeURIComponent(body);
        st.textContent='Opening your email app…'; return; }
      st.textContent='Sending…';
      fetch(f.action,{method:'POST',body:D,headers:{Accept:'application/json'}}).then(function(r){ if(!r.ok) throw 0; f.reset(); st.textContent='Thanks! We’ll be in touch shortly.'; })
        .catch(function(){ st.textContent='Sorry, that didn’t send. Please call (905) 464-3435.'; }); }); }
})();
