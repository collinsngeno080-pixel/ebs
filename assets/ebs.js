(function(){
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Mobile menu
  var btn = document.getElementById("menuBtn"), mnav = document.getElementById("mnav");
  if (btn && mnav){
    btn.addEventListener("click", function(){
      var open = mnav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // Gentle rise as sections enter (content is visible at rest)
  if (!reduce && "IntersectionObserver" in window && !window.__ebsReveal){
    var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add("rise"); io.unobserve(e.target); } }); }, {rootMargin:"0px 0px -8% 0px"});
    document.querySelectorAll(".reveal").forEach(function(el){ if (el.getBoundingClientRect().top > innerHeight) io.observe(el); });
  }

  // Compile checklist (How It Works hero)
  var list = document.getElementById("compile");
  if (list){
    var items = list.querySelectorAll("li"), bar = document.getElementById("cbar"),
        st = document.getElementById("cstatus"), stT = document.getElementById("cstatusText");
    var run = function(){
      items.forEach(function(li){ li.className = ""; });
      if (st){ st.classList.add("busy"); stT.textContent = "Compiling…"; }
      bar.style.width = "0%";
      var i = 0;
      var step = function(){
        if (i > 0) items[i-1].className = "done";
        if (i < items.length){
          items[i].className = "run";
          bar.style.width = Math.round((i+0.5)/items.length*100) + "%";
          i++; setTimeout(step, 900);
        } else {
          bar.style.width = "100%";
          if (st){ st.classList.remove("busy"); stT.textContent = "In sync"; }
          setTimeout(run, 4200);
        }
      };
      step();
    };
    if (reduce){ items.forEach(function(li){ li.className = "done"; }); bar.style.width = "100%"; }
    else run();
  }

  // Contact form: set data-endpoint on the form to a form service URL (e.g. Formspree) to go live
  var form = document.getElementById("contactForm");
  if (form){
    var msg = document.getElementById("formMsg");
    form.addEventListener("submit", function(e){
      e.preventDefault();
      if (!form.checkValidity()){ form.reportValidity(); return; }
      var endpoint = form.getAttribute("data-endpoint");
      var show = function(cls, text){ msg.hidden = false; msg.className = "form-msg " + cls; msg.textContent = text; };
      if (!endpoint){
        show("warn", "Thanks. This form isn't connected to an inbox yet, so your message wasn't sent.");
        return;
      }
      var b = form.querySelector("button[type=submit]"); b.disabled = true; b.textContent = "Sending…";
      fetch(endpoint, {method:"POST", body:new FormData(form), headers:{"Accept":"application/json"}})
        .then(function(r){ if (!r.ok) throw new Error(); form.reset(); show("ok", "Thanks, your message is on its way. We'll reply by email."); })
        .catch(function(){ show("warn", "Your message didn't go through. Check your connection and try again."); })
        .finally(function(){ b.disabled = false; b.textContent = "Send message"; });
    });
  }
})();
