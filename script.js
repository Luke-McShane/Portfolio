import * as projectData from "./project-info.js";
import * as codepenData from "./codepen-info.js";
let scrollPosition = 0;
let isSetup = false;

window.onload = function () {

  function populateModal(title, link) {
    const a = document.createElement('a');
    const div = document.createElement('div');
    const hr = document.createElement('hr');
    a.innerText = title;
    a.setAttribute('href', link);
    a.setAttribute('target', '_blank');
    div.style.textAlign = 'center';
    div.style.height = '5px';
    div.style.marginBottom = '0.6rem';
    div.style.marginTop = '0.5rem';
    div.style.paddingTop = '0.3rem';
    hr.style.width = "40%";
    hr.style.color = '#55756C';
    hr.style.display = 'inline-block';
    hr.style.verticalAlign = 'top';
    document.querySelector('.exercises-info-content-grid-text').appendChild(a);
    document.querySelector('.exercises-info-content-grid-text').appendChild(div);
    div.appendChild(hr);
  }

  // function modalSetup(h3, key, h2 = false, header = '') {
  //   if (h2) {
  //     h2.innerText = header;
  //     h2.classList.add('modal-title');
  //     document.querySelector('.exercises-info-content-grid').insertBefore(h2, document.querySelector('.exercises-info-content-grid-text'));
  //   }
  //   h3.innerText = key;
  //   h3.style.textAlign = 'center';
  //   h3.style.marginTop = '2rem';
  //   document.querySelector('.exercises-info-content-grid-text').appendChild(h3);
  // }
  function modalSetup(h3, key, isSetup = false) {
    if (!isSetup) {
      h3.innerText = key;
      h3.style.textAlign = 'center';
      h3.style.marginTop = '2rem';
      document.querySelector('.exercises-info-content-grid-text').appendChild(h3);
    }
  }

  scroll();
  freezeForTransition();

  let closeOverlay = document.querySelectorAll(".close");
  closeOverlay.forEach(btn => {
    btn.onclick = function () {
      let overlay = (btn.parentElement.id == "projects-cancel") ?
        document.querySelector(".projects-info") :
        document.querySelector(".exercises-info");
      if (btn.parentElement.id == 'exercises-cancel') {
        const title = document.querySelector('.exercises-info-content-grid').querySelector('.modal-title');
        const modalBody = document.querySelector('.exercises-info-content-grid-text');
        document.querySelector('.exercises-info-content-grid').removeChild(title);
        modalBody.querySelectorAll('*').forEach(n => n.remove());
      }
      overlay.style.display = "none";
      document.body.classList.remove('show-overlay');
      window.scrollTo(0, scrollPosition);
    }
  })

  let exercisesBtns = document.querySelectorAll(`[class*="exercises-main-container-button"]`);
  let cssHeaders = ['CSS Projects', 'CSS Exercises'];
  let jsHeaders = ['JS Projects', 'JS Exercises'];
  for (let i = 0; i < exercisesBtns.length; i++) {
    let currentBtn = exercisesBtns[i];

    currentBtn.onclick = function () {
      isSetup = false;
      let classes = currentBtn.classList.value;
      let infoKey = (
        classes.includes('html') ? 'html' :
          classes.includes('css') ? 'css' :
            classes.includes('js') ? 'js' :
              null
      );
      const h2 = document.createElement('h2');
      h2.innerText = `My ${infoKey.toUpperCase()} Work`;
      h2.classList.add('modal-title');
      document.querySelector('.exercises-info-content-grid').insertBefore(h2, document.querySelector('.exercises-info-content-grid-text'));

      console.log(`Info Key: ${infoKey}`);
      scrollPosition = window.pageYOffset;
      document.body.style.top = -scrollPosition + 'px';
      document.body.classList.add('show-overlay');

      let overlay = document.getElementsByClassName("exercises-info")[0];
      let exercisesInfo = codepenData.default;
      overlay.style.display = "flex";

      for (const [tempKey, tempVal] of Object.entries(exercisesInfo[`${infoKey}`])) {

        const key = (
          infoKey === 'html' ? 'HTML Projects' :
            infoKey === 'css' ? cssHeaders[tempKey] :
              infoKey === 'js' ? jsHeaders[tempKey] :
                null
        );
        const val = Object.values(tempVal)[0];
        const h3 = document.createElement('h3');
        if (typeof (Object.values(val[0])[0]) === 'object') {
          modalSetup(h3, key);
          Object.entries(val[0]).forEach(entry => {
            const innerH3 = document.createElement('h3');
            modalSetup(innerH3, Object.values(entry)[0]);
            for (const innerVal of Object.values(entry[1])) {
              console.log(innerVal);
              populateModal(innerVal.title, innerVal.link);
            }
          });

        } else if (typeof (val) === 'object') {
          debugger;
          modalSetup(h3, key);
          console.log(`Inner Key: ${key}`);
          console.log(`Inner Value: ${val}`);
          val.forEach(entry => populateModal(entry.title, entry.link));
        } else if (typeof (val) === 'string') {
          modalSetup(h3, key, isSetup);
          isSetup = true;
          populateModal(tempVal.title, tempVal.link);
        }
      }


    }
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