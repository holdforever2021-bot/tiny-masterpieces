/* ---------------------------------------------------------------
   EDIT THIS FILE to change prices, products or the coming-soon list.
   Nothing else needs touching. Save, refresh, done.
   --------------------------------------------------------------- */

var MAIL = 'support@tinycreations.studio';

/* ---------------------------------------------------------------
   BRAND. The business is "Tiny Masterpieces". The DOMAIN is
   tinycreations.studio — they are deliberately different. Change the
   display name here; never change MAIL or the domain to match.
   --------------------------------------------------------------- */
var BRAND = 'Tiny Masterpieces';

/* ---------------------------------------------------------------
   THE SHOP. These cards are rendered from this list, so a price
   exists in exactly one place. Add a product by adding an entry.
   `bundle` is optional tier pricing: [qty, price-for-that-many],
   applied largest-first.
   --------------------------------------------------------------- */
var STOCK = [
  { id:'bracelet', name:'Bracelets', img:'assets/img/bracelets-real.jpg', swatch:'s1',
    note:'Stretch fit. Charms and name beads available.',
    options:[{label:'Classic',price:4},{label:'With charm',price:6},{label:'Chunky',price:7}],
    bundle:[[3,10],[2,7],[1,4]] },

  { id:'bookmark', name:'Bookmarks', img:'assets/img/bookmarks.png', swatch:'s2',
    note:'Acrylic ones come with a hand-tied tassel.',
    options:[{label:'Paper',price:1},{label:'With sleeve',price:3},{label:'Acrylic + tassel',price:5}] },

  { id:'card', name:'Greeting cards', img:'assets/img/cards-real.jpg', swatch:'s3',
    note:'Hand-drawn front, blank inside, envelope included.',
    options:[{label:'Single',price:5}] },

  { id:'other', name:'Everything else', img:'', swatch:'s4',
    note:"New little things appear all the time. Ask what's on the table.",
    options:[{label:'Keychain',price:5},{label:'Magnet',price:5},{label:'Bag clip',price:5}] }
];

/* How the order reaches her. No payment is taken on the site — this
   just decides what the customer picks at checkout. */
var FULFILMENT = ['Pick up in Woodbridge', 'Local delivery', 'Ship to me'];
/* Online card checkout is not built yet — deliberately shown as "coming soon"
   rather than hidden, so the gap reads as a roadmap instead of an omission. */
var PAY_METHODS = ['Venmo', 'Zelle', 'Cash on pickup'];
var PAY_SOON    = 'Card payment online';


var ITEMS = {
  bracelet: {label:'Bracelet', variants:{'Classic':4,'With charm':6,'Chunky':7}, tiers:[[3,10],[2,7],[1,4]]},
  bookmark: {label:'Bookmark', variants:{'Paper':1,'With sleeve':3,'Acrylic + tassel':5}},
  card:     {label:'Greeting card', variants:{'Single':5}},
  other:    {label:'Little extra', variants:{'Keychain':5,'Magnet':5,'Bag clip':5}}
};
/* Add-ons and discounts. These were hardcoded in app.js, which broke the
   one-price-in-one-place rule — change it there and the copy on the page
   silently disagreed. The page now reads its label from LETTER too. */
var LETTER = 2;          // per letter bead, added per item
var BULK_QTY = 10;       // quantity at which the bulk discount applies
var BULK_OFF = 0.10;     // 10% off

var COLOURS = {
  'Sparkle':'#f5a8d0','Explorer':'#4e8fd0',
  'Rainbow':'linear-gradient(90deg,#ff9a8b,#ffd36e,#8fd694,#6bc6e8,#b39ae8)',
  'Pastel':'#cbb6ea','Earthy':'#c9a87c','Match my photo':'#d7d2de'
};
var SOON = [
  {t:'Party favor packs', b:'b-soon', s:'Pricing soon',
   d:'Bracelet, bookmark, charm and a tag, bagged per guest and matched to your party colours.'},
  {t:'Name &amp; initial bracelets', b:'b-test', s:'Testing',
   d:'Letter beads spelling a name, a word or a set of initials. Sizing for kids and grown-ups.'},
  {t:'Make-your-own kits', b:'b-idea', s:'Idea stage',
   d:'A box of beads, cord and instructions so you can string your own at home. Good gift, good rainy day.'},
  {t:'Classroom &amp; teacher sets', b:'b-soon', s:'Coming soon',
   d:'A bookmark for every kid in the class, or a thank-you set for end of term.'},
  {t:'Seasonal drops', b:'b-idea', s:'Idea stage',
   d:'Small runs for Valentine\u2019s, Mother\u2019s Day and Halloween. Made once, then gone.'},
  {t:'Wedding &amp; shower favors', b:'b-soon', s:'By request',
   d:'Grown-up versions in your palette \u2014 pearl, sage, dusty rose \u2014 with a tag per guest.'}
];
