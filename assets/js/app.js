/* Tiny Creations — page behaviour. Prices and copy live in data/site-config.js */

var state = {item:'bracelet', variant:'Classic', colour:'Sparkle'};
var basket = [];
var interests = [];

function $(id){ return document.getElementById(id); }
function money(v){ return '$' + (Math.round(v*100)/100).toFixed(2).replace(/\.00$/,''); }

function chip(text, on, fn, swatch){
  var b=document.createElement('button');
  b.className='opt'; b.type='button'; b.setAttribute('aria-pressed', on?'true':'false');
  if(swatch){ var s=document.createElement('span'); s.className='dot'; s.style.background=swatch; b.appendChild(s); }
  b.appendChild(document.createTextNode(text));
  b.onclick=fn; return b;
}

function renderOptions(){
  var oi=$('opt-item'); oi.innerHTML='';
  Object.keys(ITEMS).forEach(function(k){
    oi.appendChild(chip(ITEMS[k].label, state.item===k, function(){
      state.item=k; state.variant=Object.keys(ITEMS[k].variants)[0]; renderOptions(); price();
    }));
  });
  var ov=$('opt-variant'); ov.innerHTML='';
  Object.keys(ITEMS[state.item].variants).forEach(function(v){
    ov.appendChild(chip(v, state.variant===v, function(){ state.variant=v; renderOptions(); price(); }));
  });
  var oc=$('opt-colour'); oc.innerHTML='';
  Object.keys(COLOURS).forEach(function(c){
    oc.appendChild(chip(c, state.colour===c, function(){ state.colour=c; renderOptions(); price(); }, COLOURS[c]));
  });
}

function quote(){
  var it=ITEMS[state.item];
  var n=Math.max(1, parseInt($('qty').value,10)||1);
  var total;
  if(it.tiers && state.variant==='Classic'){
    var left=n, t=0;
    it.tiers.forEach(function(p){ while(left>=p[0]){ t+=p[1]; left-=p[0]; } });
    total=t;
  } else { total=it.variants[state.variant]*n; }
  if($('nameBeads').value.trim()) total += LETTER*n;
  if(n>=BULK_QTY) total = total*(1-BULK_OFF);
  return {n:n, total:total};
}

function describe(n){
  var nm=$('nameBeads').value.trim().toUpperCase();
  return n+' \u00d7 '+ITEMS[state.item].label+' \u2014 '+state.variant+', '+state.colour+
         (nm ? ' \u201c'+nm+'\u201d' : '');
}

function price(){
  var q=quote();
  $('lineDesc').textContent=describe(q.n);
  $('linePrice').textContent=money(q.total);
  var off = Math.round(BULK_OFF*100);
    $('bulkNote').textContent = q.n>=BULK_QTY
      ? BULK_QTY + ' or more \u2014 ' + off + '% bulk discount applied.'
      : 'Order ' + BULK_QTY + ' or more for ' + off + '% off.';
}

function renderBasket(){
  var ul=$('basket'); ul.innerHTML='';
  basket.forEach(function(b,i){
    var li=document.createElement('li');
    var s=document.createElement('span'); s.textContent=b.desc;
    var r=document.createElement('span');
    var st=document.createElement('strong'); st.textContent=money(b.total)+' ';
    var x=document.createElement('button'); x.textContent='\u00d7'; x.title='Remove';
    x.onclick=function(){ basket.splice(i,1); save(); renderBasket(); };
    r.appendChild(st); r.appendChild(x);
    li.appendChild(s); li.appendChild(r); ul.appendChild(li);
  });
  $('total').textContent=money(basket.reduce(function(a,b){ return a+b.total; },0));
}

function save(){
  try{ localStorage.setItem('tc_basket', JSON.stringify(basket));
       localStorage.setItem('tc_interest', JSON.stringify(interests)); }catch(e){}
}
function load(){
  try{
    var b=localStorage.getItem('tc_basket'); if(b){ basket=JSON.parse(b)||[]; }
    var i=localStorage.getItem('tc_interest'); if(i){ interests=JSON.parse(i)||[]; }
  }catch(e){ basket=[]; interests=[]; }
}

function renderSoon(){
  var g=$('soonGrid'); g.innerHTML='';
  SOON.forEach(function(s){
    var a=document.createElement('article'); a.className='card';
    var on = interests.indexOf(s.t.replace(/&amp;/g,'&'))>=0;
    a.innerHTML='<span class="badge '+s.b+'">'+s.s+'</span><h3>'+s.t+'</h3>'+
                '<p class="note" style="margin-top:6px">'+s.d+'</p>';
    var btn=document.createElement('button');
    btn.className='btn '+(on?'primary':'ghost')+' small';
    btn.style.marginTop='14px';
    btn.textContent = on ? 'On your list \u2713' : 'Keep me posted';
    btn.onclick=function(){ toggleInterest(s.t.replace(/&amp;/g,'&')); };
    a.appendChild(btn); g.appendChild(a);
  });
  renderInterests();
}

function toggleInterest(name){
  var i=interests.indexOf(name);
  if(i>=0){ interests.splice(i,1); } else { interests.push(name); }
  save(); renderSoon();
}

function renderInterests(){
  var ul=$('interestChips'); ul.innerHTML='';
  interests.forEach(function(n){
    var li=document.createElement('li'); li.textContent=n; ul.appendChild(li);
  });
  var note=ul.previousElementSibling;
  note.textContent = interests.length
    ? 'We\u2019ll email you first when these are ready:'
    : 'Nothing picked yet \u2014 tap the ideas above.';
}

function mailto(subject, body){
  window.location.href='mailto:'+MAIL+'?subject='+encodeURIComponent(subject)+
    '&body='+encodeURIComponent(body);
}

$('minus').onclick=function(){ $('qty').value=Math.max(1,(parseInt($('qty').value,10)||1)-1); price(); };
$('plus').onclick =function(){ $('qty').value=Math.min(200,(parseInt($('qty').value,10)||1)+1); price(); };
$('qty').addEventListener('input', price);
$('nameBeads').addEventListener('input', price);

$('addBtn').onclick=function(){
  var q=quote(); basket.push({desc:describe(q.n), total:q.total}); save(); renderBasket();
};
$('sendOrder').onclick=function(){ $('order').scrollIntoView({behavior:'smooth'}); };

$('mailBtn').onclick=function(){
  var lines = basket.length
    ? basket.map(function(b){ return '\u2022 '+b.desc+' \u2014 '+money(b.total); }).join('\n')
    : '(nothing added yet)';
  var sum=basket.reduce(function(a,b){ return a+b.total; },0);
  mailto('Website order',
    'Hi Tiny Creations,\n\nI\u2019d like to order:\n'+lines+
    '\n\nEstimated total: '+money(sum)+
    '\n\nName: '+$('fName').value+
    '\nContact: '+$('fContact').value+
    '\nNeeded by: '+$('fDate').value+
    '\nDelivery: '+$('fDelivery').value+
    '\nNotes: '+$('fNotes').value+'\n');
};

$('quoteBtn').onclick=function(){
  mailto('Party quote request',
    'Hi Tiny Creations,\n\nI\u2019m planning a party and would like a quote.\n\n'+
    'Guests: '+$('pGuests').value+
    '\nParty date: '+$('pDate').value+
    '\nPack idea: '+$('pPack').value+
    '\nTheme / colours: '+$('pTheme').value+
    '\nRough budget per guest: '+$('pBudget').value+'\n');
};

$('waitBtn').onclick=function(){
  if(!interests.length){ alert('Tap "Keep me posted" on anything you\u2019d want first.'); return; }
  $('waitOk').style.display='block';
  mailto('Keep me posted',
    'Hi Tiny Creations,\n\nPlease let me know when these are ready:\n'+
    interests.map(function(n){ return '\u2022 '+n; }).join('\n')+
    '\n\nEmail: '+$('waitEmail').value+'\n');
};

/* Label reads from config, so the price cannot drift from the maths. */
(function(){
  var el=$('letterNote');
  if(el) el.textContent='(+$'+LETTER+' each, up to 10 letters)';
})();

load(); renderOptions(); price(); renderBasket(); renderSoon();
