(function(){
  'use strict';
  // Utilities
  function $(sel, ctx){ return (ctx||document).querySelector(sel); }
  function $all(sel, ctx){ return Array.prototype.slice.call((ctx||document).querySelectorAll(sel)); }

  document.addEventListener('DOMContentLoaded', function(){
    var menuBtn = $('#menu-btn');
    var side = $('#side-menu');
    var close = $('#close-menu');
    var toc = $('#toc');
    var themeToggle = $('#theme-toggle');

    if(menuBtn){
      menuBtn.addEventListener('click', function(){
        side.classList.add('open');
        side.setAttribute('aria-hidden','false');
      });
    }
    if(close){
      close.addEventListener('click', function(){
        side.classList.remove('open');
        side.setAttribute('aria-hidden','true');
      });
    }

    // Build TOC from headings in the article
    var content = document.querySelector('.content');
    if(content && toc){
      var headings = $all('h1,h2,h3', content);
      if(headings.length){
        var ul = document.createElement('div');
        headings.forEach(function(h){
          if(!h.id){
            h.id = h.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
          }
          var a = document.createElement('a');
          a.href = '#'+h.id;
          a.textContent = h.textContent;
          a.className = 'toc-link';
          ul.appendChild(a);
        });
        toc.appendChild(ul);
      } else {
        toc.innerHTML = '<p style="color:var(--muted)">No headings found.</p>';
      }
    }

    // Theme toggle
    function setTheme(name){
      if(name === 'light') document.body.classList.remove('theme-dark'), document.body.classList.add('theme-light');
      else document.body.classList.remove('theme-light'), document.body.classList.add('theme-dark');
      try{ localStorage.setItem('flw-theme', name); }catch(e){}
    }
    var saved = null;
    try{ saved = localStorage.getItem('flw-theme'); }catch(e){}
    if(saved) setTheme(saved);
    if(themeToggle){
      themeToggle.addEventListener('click', function(){
        var isLight = document.body.classList.contains('theme-light');
        setTheme(isLight ? 'dark' : 'light');
      });
    }

    // 404 page localization if present
    if(document.body.classList.contains('page-404') && window._FLW_TRANSLATIONS){
      var userLang = (navigator.language || 'en').toLowerCase();
      var translations = window._FLW_TRANSLATIONS;
      var pick = 'en';
      // try to find best match
      Object.keys(translations).forEach(function(code){
        if(userLang.indexOf(code.toLowerCase()) !== -1 || (code.toLowerCase()==='zh-hans' && userLang.indexOf('zh')===0)){
          pick = code;
        }
      });
      // replace placeholders in page
      var t = translations[pick] || translations['en'];
      var title = document.querySelector('#err-title');
      var msg = document.querySelector('#err-msg');
      if(title) title.textContent = t['404_title'];
      if(msg) msg.textContent = t['404_message'];
    }
  });

})();
