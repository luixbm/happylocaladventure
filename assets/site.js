// ---- Mobile nav toggle ----
document.querySelectorAll('.nav-toggle').forEach(function(btn){
  btn.addEventListener('click', function(){
    var links = btn.closest('.nav').querySelector('.nav-links');
    var open = links.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
});
document.querySelectorAll('.nav-links a').forEach(function(a){
  a.addEventListener('click', function(){
    var links = a.closest('.nav-links');
    if(links) links.classList.remove('open');
  });
});

// ---- Price toggle tabs (activity detail pages) ----
document.querySelectorAll('.price-toggle').forEach(function(group){
  group.querySelectorAll('.toggle-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      group.querySelectorAll('.toggle-btn').forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
      var scope = group.closest('.detail-sidebar') || group.closest('.card-body') || document;
      scope.querySelectorAll('.price-panel').forEach(function(p){ p.classList.add('hidden'); });
      var target = document.getElementById(btn.getAttribute('data-panel'));
      if(target){ target.classList.remove('hidden'); }
    });
  });
});

// ---- Contact form -> WhatsApp ----
var bookingForm = document.getElementById('bookingForm');
if(bookingForm){
  bookingForm.addEventListener('submit', function(e){
    e.preventDefault();
    var name = document.getElementById('name').value.trim();
    var pax = document.getElementById('pax').value.trim();
    var email = document.getElementById('email').value.trim();
    var date = document.getElementById('date').value;
    var activity = document.getElementById('activity').value;
    var message = document.getElementById('message').value.trim();

    var lines = [
      "Hi Happy Local Adventure, I'd like to plan a trip.",
      "Name: " + (name || "-"),
      "Activity: " + activity,
      "Guests: " + (pax || "-"),
      "Date: " + (date || "-"),
    ];
    if(email) lines.push("Email: " + email);
    if(message) lines.push("Notes: " + message);

    var text = encodeURIComponent(lines.join("\n"));
    window.open("https://wa.me/6285737287843?text=" + text, "_blank");
  });
}

// ---- Blog: list + detail rendering from content/posts.json ----
// Works from both /blog.html (root) and any depth via the `postsPath` global set per-page.
function hlaLoadPosts(callback){
  var path = window.HLA_POSTS_PATH || 'content/posts.json';
  fetch(path)
    .then(function(r){ return r.json(); })
    .then(function(data){ callback(data.posts || []); })
    .catch(function(){ callback([]); });
}

function hlaFormatDate(iso){
  try{
    var d = new Date(iso);
    return d.toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' });
  }catch(e){ return iso; }
}

// Very small markdown-ish renderer: paragraphs + blank-line breaks + basic ## headings + bold/italic.
function hlaRenderBody(md){
  if(!md) return '';
  var lines = md.split(/\n/);
  var html = '';
  var htmlLines = [];
  lines.forEach(function(line){
    line = line.trim();
    if(line.startsWith('## ')){
      htmlLines.push('<h3>' + line.slice(3) + '</h3>');
    } else if(line.startsWith('# ')){
      htmlLines.push('<h2>' + line.slice(2) + '</h2>');
    } else if(line.length === 0){
      // paragraph break marker
      htmlLines.push('');
    } else {
      htmlLines.push(line);
    }
  });
  var paragraphs = [];
  var buffer = [];
  htmlLines.forEach(function(l){
    if(l === ''){
      if(buffer.length){ paragraphs.push(buffer.join(' ')); buffer = []; }
    } else if(l.startsWith('<h2>') || l.startsWith('<h3>')){
      if(buffer.length){ paragraphs.push(buffer.join(' ')); buffer = []; }
      paragraphs.push(l);
    } else {
      buffer.push(l);
    }
  });
  if(buffer.length) paragraphs.push(buffer.join(' '));

  html = paragraphs.map(function(p){
    if(p.startsWith('<h2>') || p.startsWith('<h3>')) return p;
    var withBold = p.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    var withItalic = withBold.replace(/\*(.+?)\*/g, '<em>$1</em>');
    return '<p>' + withItalic + '</p>';
  }).join('\n');

  return html;
}

function hlaInitBlogList(){
  var mount = document.getElementById('blogList');
  if(!mount) return;
  hlaLoadPosts(function(posts){
    posts.sort(function(a,b){ return new Date(b.date) - new Date(a.date); });
    if(posts.length === 0){
      mount.innerHTML = '<div class="empty-state">No stories yet — the first guest update will show up here.</div>';
      return;
    }
    mount.innerHTML = posts.map(function(p){
      var cover = p.cover
        ? '<img src="' + p.cover + '" alt="">'
        : '';
      return (
        '<a class="post-card" href="blog.html?post=' + encodeURIComponent(p.slug) + '">' +
          '<div class="cover">' + cover + '</div>' +
          '<div class="body">' +
            '<span class="date">' + hlaFormatDate(p.date) + '</span>' +
            '<h3>' + p.title + '</h3>' +
            '<p>' + (p.excerpt || '') + '</p>' +
          '</div>' +
        '</a>'
      );
    }).join('');
  });
}

function hlaInitBlogDetail(){
  var mount = document.getElementById('postDetail');
  if(!mount) return;
  var params = new URLSearchParams(window.location.search);
  var slug = params.get('post');
  hlaLoadPosts(function(posts){
    var post = posts.filter(function(p){ return p.slug === slug; })[0];
    if(!post){
      mount.innerHTML = '<div class="empty-state">Story not found. <a href="blog.html">Back to all stories</a></div>';
      var fb = document.getElementById('fbCommentsBox');
      if(fb) fb.style.display = 'none';
      return;
    }
    document.title = post.title + ' — Happy Local Adventure';
    var cover = post.cover ? '<div class="cover"><img src="' + post.cover + '" alt=""></div>' : '';
    mount.innerHTML = (
      '<span class="eyebrow">' + hlaFormatDate(post.date) + '</span>' +
      '<h1 style="margin-top:10px; font-size:clamp(1.8rem,4vw,2.6rem);">' + post.title + '</h1>' +
      cover +
      '<div class="body">' + hlaRenderBody(post.body) + '</div>'
    );
    // wire up Facebook comments for this exact post URL
    var fbDiv = document.getElementById('fbCommentsPlugin');
    if(fbDiv){
      fbDiv.setAttribute('data-href', window.location.href);
      if(window.FB && window.FB.XFBML){ window.FB.XFBML.parse(); }
    }
  });
}

document.addEventListener('DOMContentLoaded', function(){
  hlaInitBlogList();
  hlaInitBlogDetail();
});
