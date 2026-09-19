/* ------------------------------------------------------------------
   catalogue.js — every individual design that is for sale.

   PRICES COME FROM THE PRICE CARDS AND NOWHERE ELSE:
     Bracelets   1 for $4 · 2 for $7 · 3 for $10
     Bookmarks   Paper $1 · With sleeve $3 · Acrylic + tassel $5
     Cards       $5 each

   No price is invented here. A SET is priced as the exact sum of its
   parts — arithmetic, not a new pricing decision. Anything without an
   agreed price belongs in SOON with no number attached.
   ------------------------------------------------------------------ */

var PRICE = { acrylic: 5, sleeve: 3, paper: 1, card: 5 };

/* Themes drive the shop's grouping. Order here is display order. */
var THEMES = [
  { id: 'reading', name: 'For the book lover',
    blurb: 'The ones that actually say something about reading. Acrylic, with a hand-tied tassel.' },
  { id: 'pretty', name: 'Flowers & pretty things',
    blurb: 'Softer designs — blooms, ballet, coffee. Same acrylic, no slogan.' },
  { id: 'diwali', name: 'Diwali',
    blurb: 'Hand-drawn diyas on glitter card. Hard to find done properly, which is why they exist.' },
  { id: 'birthday', name: 'Birthdays',
    blurb: 'Cards for the day itself.' },
  { id: 'friends', name: 'Friends & love',
    blurb: 'For saying something without buying a supermarket card.' },
  { id: 'sweet', name: 'Sweet things',
    blurb: 'Ice cream on glitter. No occasion required.' }
];

/* type: 'bookmark' | 'card' | 'tag'
   Each entry is a real design, photographed. img is under assets/img/shop/. */
var DESIGNS = [
  {id:'bm-one-more-chapter', t:'bookmark', theme:'reading', price:PRICE.acrylic, name:'Just One More Chapter', note:'Reader silhouette on yellow · navy or rose tassel'},
  {id:'bm-girl-loves-reading', t:'bookmark', theme:'reading', price:PRICE.acrylic, name:'Just A Girl Who Loves Reading', note:'Deep navy, bold and simple'},
  {id:'bm-social-life', t:'bookmark', theme:'reading', price:PRICE.acrylic, name:'Books Are My Social Life', note:'Purple tassel'},
  {id:'bm-go-away-reading', t:'bookmark', theme:'reading', price:PRICE.acrylic, name:'Go Away, I’m Reading', note:'Pink brushstroke, magenta tassel'},
  {id:'bm-so-many-books', t:'bookmark', theme:'reading', price:PRICE.acrylic, name:'So Many Books, So Little Time', note:'Book stack, silver tassel'},
  {id:'bm-sleep-good', t:'bookmark', theme:'reading', price:PRICE.acrylic, name:'Sleep Is Good, Books Are Better', note:'Gold tassel'},
  {id:'bm-not-alone', t:'bookmark', theme:'reading', price:PRICE.acrylic, name:'We Read To Know We’re Not Alone', note:'Line flowers, silver tassel'},
  {id:'bm-best-reader', t:'bookmark', theme:'reading', price:PRICE.acrylic, name:'Best Reader Ever', note:'Books and hearts · brown or berry tassel'},
  {id:'bm-reading-dreaming', t:'bookmark', theme:'reading', price:PRICE.acrylic, name:'Reading Is Dreaming With Your Eyes Open', note:'Green tassel'},
  {id:'bm-coffee-quotes', t:'bookmark', theme:'reading', price:PRICE.acrylic, name:'Coffee & Quotes', note:'Text collage, brown tassel'},
  {id:'bm-books-coffee', t:'bookmark', theme:'pretty', price:PRICE.acrylic, name:'Books & Coffee', note:'Pastel flowers, sky tassel'},
  {id:'bm-flowers-book', t:'bookmark', theme:'pretty', price:PRICE.acrylic, name:'Flowers & A Good Book', note:'Pink tassel'},
  {id:'bm-bloom-read', t:'bookmark', theme:'pretty', price:PRICE.acrylic, name:'Bloom & Read', note:'Open book and poppies'},
  {id:'bm-chapter-flowers', t:'bookmark', theme:'pretty', price:PRICE.acrylic, name:'Wildflowers', note:'Hand-drawn stems, blue tassel'},
  {id:'bm-book-stack', t:'bookmark', theme:'pretty', price:PRICE.acrylic, name:'Book Stack', note:'Doodled spines, burgundy tassel'},
  {id:'bm-book-stack-colour', t:'bookmark', theme:'pretty', price:PRICE.acrylic, name:'Book Stack — Colour', note:'Rainbow spines, magenta tassel'},
  {id:'bm-ballet', t:'bookmark', theme:'pretty', price:PRICE.acrylic, name:'Ballet Shoes', note:'Soft pink, white tassel'},
  {id:'bm-pawsed-here', t:'bookmark', theme:'pretty', price:PRICE.acrylic, name:'You Pawsed Here', note:'Black cat on lilac, blue tassel'},
  {id:'bm-ghosts-reading', t:'bookmark', theme:'pretty', price:PRICE.acrylic, name:'Ghosts Reading', note:'Three little readers · black or gold tassel'},
  {id:'cd-diwali-gold', t:'card', theme:'diwali', price:PRICE.card, name:'Happy Diwali — Gold', note:'Gold glitter, hand-coloured diya'},
  {id:'cd-diwali-red', t:'card', theme:'diwali', price:PRICE.card, name:'Happy Diwali — Red', note:'Red glitter, hand-coloured diya'},
  {id:'cd-birthday-cake', t:'card', theme:'birthday', price:PRICE.card, name:'Happy Birthday — Cake', note:'Layer cake and stars'},
  {id:'cd-let-fun-begin', t:'card', theme:'birthday', price:PRICE.card, name:'Let The Fun Begin', note:'Block letters, gold edge'},
  {id:'cd-friends-life-fun', t:'card', theme:'friends', price:PRICE.card, name:'Friends Make Life Fun', note:'Hand-lettered'},
  {id:'cd-hearts', t:'card', theme:'friends', price:PRICE.card, name:'Falling Hearts', note:'Layered paper hearts'},
  {id:'cd-the-best', t:'card', theme:'friends', price:PRICE.card, name:'The Best', note:'Patterned hearts'},
  {id:'cd-red-flowers', t:'card', theme:'friends', price:PRICE.card, name:'Red Flowers', note:'Clean and simple'},
  {id:'cd-icecream-pink', t:'card', theme:'sweet', price:PRICE.card, name:'Ice Cream — Pink Glitter', note:''},
  {id:'cd-icecream-teal', t:'card', theme:'sweet', price:PRICE.card, name:'Ice Cream — Teal Glitter', note:''}
];

/* Curated sets. Price is the exact sum of the parts listed — no bundle
   discount is invented here. The bracelet tiers are the only volume
   pricing that exists, and they live in site-config.js. */
var SETS = [
  { id:'set-reader', name:'The Reader', price: PRICE.acrylic + PRICE.card,
    img:'assets/img/shop/bm-one-more-chapter.jpg',
    items:['Any acrylic bookmark', 'Any greeting card'],
    blurb:'The standard gift. Pick the bookmark, pick the card, say who it is for.' },
  { id:'set-diwali', name:'Diwali Pair', price: PRICE.card * 2,
    img:'assets/img/shop/cd-diwali-gold.jpg',
    items:['Happy Diwali — Gold', 'Happy Diwali — Red'],
    blurb:'Both diya cards. One to give, one to keep.' },
  { id:'set-birthday', name:'Birthday Set', price: PRICE.card + PRICE.acrylic,
    img:'assets/img/shop/cd-birthday-cake.jpg',
    items:['A birthday card', 'An acrylic bookmark'],
    blurb:'Card and bookmark, wrapped together. Works as a present on its own.' },
  { id:'set-shelf', name:'Shelf Of Three', price: PRICE.acrylic * 3,
    img:'assets/img/shop/bm-book-stack-colour.jpg',
    items:['Three acrylic bookmarks, your pick'],
    blurb:'For someone with more than one book on the go.' }
];
