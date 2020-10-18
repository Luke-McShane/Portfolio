import * as projectData from "./project-info.js";
import * as codepenData from "./codepen-info.js";
let scrollPosition = 0;

window.onload = function () {

  scroll();
  freezeForTransition();

  let closeOverlay = document.querySelector("#close");
  closeOverlay.onclick = function () {
    let overlay = document.querySelector(".projects-info");
    overlay.style.display = "none";
    document.body.classList.remove('show-overlay');
    window.scrollTo(0, scrollPosition);
  }

  let exercisesBtns = document.querySelectorAll(`[class*="exercises-main-container-button"]`);
  console.log(exercisesBtns.length);
  for (let i = 0; i < exercisesBtns.length; i++) {
    console.log(exercisesBtns[i]);
  }

  let readMoreBtns = document.getElementsByClassName("project-btn-2");
  for (let i = 0; i < readMoreBtns.length; i++) {
    let currentBtn = readMoreBtns[i];
    currentBtn.onclick = function () {
      scrollPosition = window.pageYOffset;
      document.body.style.top = -scrollPosition + 'px';
      document.body.classList.add('show-overlay');

      let overlay = document.getElementsByClassName("projects-info")[0];
      let projectInfo = projectData.default;
      overlay.style.display = "flex";
      // The projectInfor is the javascript object, the projects is the key, and them I am accessing
      // each inner component by grabbing the id of the current button being clicked and accessing the final
      // element, which is the number. This number is used to index the projectInfo object to locate the
      // text that corresponds to the element being clicked. This data is then used to populate the overlay.
      let title = projectInfo.projects[this.id.toString()[this.id.toString().length - 1] - 1].title;
      let overview = projectInfo.projects[this.id.toString()[this.id.toString().length - 1] - 1].overview;
      let difficulties = projectInfo.projects[this.id.toString()[this.id.toString().length - 1] - 1].difficulties;
      let lessonsLearned = projectInfo.projects[this.id.toString()[this.id.toString().length - 1] - 1].lessons_learned;
      let site = projectInfo.projects[this.id.toString()[this.id.toString().length - 1] - 1].site;
      let source = projectInfo.projects[this.id.toString()[this.id.toString().length - 1] - 1].source;

      let overlayTitle = overlay.querySelector(".modal-title");
      let overlayOverview = overlay.querySelector("#modal-overview");
      let overlayDifficulties = overlay.querySelector("#modal-difficulties");
      let overlayLessonsLearned = overlay.querySelector("#modal-lessons-learned");
      let overlaySite = overlay.querySelector("#live");
      let overlaySource = overlay.querySelector("#source");

      overlayTitle.innerHTML = title;
      overlayOverview.innerHTML = overview;
      overlayDifficulties.innerHTML = difficulties;
      overlayLessonsLearned.innerHTML = lessonsLearned;
      overlaySite.href = site;
      overlaySource.href = source;
    }
  }
}

function scroll() {
  var lastId,
    menu = $("#nav-main"),
    header = $("#header-arrow"),
    menuHeight = menu.outerHeight() + 15,
    menuItems = menu.find("a"),
    scrollItems = menuItems.map(function () {
      var item = $($(this).attr("href"));
      if (item.length) { return item; }
    });

  menuItems = menuItems.add(header);
  menuItems.click(function (e) {
    var href = $(this).attr("href"),
      // offsetTop = href === "#home-section" ? 0 : $(href).offset().top - menuHeight + 1;
      offsetTop = href === "#home-section" ? 0 : $(href).offset().top + 1;
    $('html, body').stop().animate({
      scrollTop: offsetTop
    }, 300);
    e.preventDefault();
  });

  $(window).scroll(function () {
    // Get container scroll position
    var fromTop = $(this).scrollTop() + menuHeight;

    // Get id of current scroll item
    var cur = scrollItems.map(function () {
      if ($(this).offset().top < fromTop)
        return this;
    });
    // Get the id of the current element
    cur = cur[cur.length - 1];
    var id = cur && cur.length ? cur[0].id : "";

    if (lastId !== id) {
      lastId = id;
      // Set/remove active class
      menuItems
        .parent().removeClass("current")
        .end().filter("[href='#" + id + "']").parent().addClass("current");
    }
  });
}

function freezeForTransition() {
  let gridItems = document.querySelectorAll("#grid-system-item");
  for (let item of gridItems) {
    item.click(function () {
      item.addClass('freeze');
    });
    item.on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function () {
      item.removeClass('freeze');
    });
  }
}