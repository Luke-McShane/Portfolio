import * as projectData from "./project-info.js";
import * as codepenData from "./codepen-info.js";
let scrollPosition = 0;
let isSetup = false;

window.onload = function () {

  let closeOverlay = document.querySelectorAll(".close");
  // These headers are used for the subheadings inside the modal
  let cssHeaders = ['CSS Projects', 'CSS Exercises'];
  let jsHeaders = ['JS Projects', 'JS Exercises'];
  let exercisesBtns = document.querySelectorAll(`[class*="exercises-main-container-button"]`);

  // This sets up the subheadings for the respective section
  // If the subheading(s) is already setup, the function is not run
  // This check is necessary, because the user can close and reopen the modal, and the
  // modal needs to be re setup each time
  function modalSetup(h3, key, isSetup = false) {
    if (!isSetup) {
      h3.innerText = key;
      h3.style.textAlign = 'center';
      h3.style.marginBottom = '1rem';
      document.querySelector('.exercises-info-content-grid-text').appendChild(h3);
    }
  }

  function populateModal(title, link) {
    const a = document.createElement('a');
    const div = document.createElement('div');
    const hr = document.createElement('hr');
    a.innerText = title;
    a.style.textAlign = 'center';
    a.setAttribute('href', link);
    a.setAttribute('target', '_blank');
    div.style.textAlign = 'center';
    div.style.height = '5px';
    div.style.marginBottom = '1rem';
    div.style.marginTop = '1rem';
    // div.style.paddingTop = '0.5rem';
    hr.style.width = "40%";
    hr.style.color = '#55756C';
    hr.style.display = 'inline-block';
    hr.style.verticalAlign = 'top';
    document.querySelector('.exercises-info-content-grid-text').appendChild(a);
    document.querySelector('.exercises-info-content-grid-text').appendChild(div);
    div.appendChild(hr);
  }

  scroll();
  freezeForTransition();

  // Here we creat functionality for closing both of the overlays - one for the Projects section,
  // the other for the Exercises section.
  closeOverlay.forEach(btn => {

    // For the Projects section, we simply change the display setting to 'none' and
    // remove the 'show-overlay' class, and finally scroll the window to the appropriate position
    // However, for the Exercises section, we must remove all elements we added to the modal.
    // This is because the modal is newly generated each time it is shown, meaning that, if we did
    // not remove the elements, they would stack
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


  // Each exerciseBtn, when clicked, will run code that causes the modal overlay to dynamically
  // populate (based on the button clicked) and then display the correspending data to the user
  for (let i = 0; i < exercisesBtns.length; i++) {

    let currentBtn = exercisesBtns[i];
    currentBtn.onclick = function () {
      const h2 = document.createElement('h2');
      let classes = currentBtn.classList.value;
      // This infoKey will be used to select the corresponding data in the js object found in
      // the codepen-info.js file. The value of infoKey depends on the button clicked, for each
      // button has class data corresponding to the data we want selected
      let infoKey = (
        classes.includes('html') ? 'html' :
          classes.includes('css') ? 'css' :
            classes.includes('js') ? 'js' :
              null
      );
      // isSetup is reset each time the modal is shown, and is set to 'true' if the js object
      // is one layer deep (no nested objects), which is the case for the HTML data, for example
      isSetup = false;
      // Setting up the main header for the modal and adding it to the HTML structure
      h2.innerText = `My ${infoKey.toUpperCase()} Work`;
      h2.classList.add('modal-title');
      document.querySelector('.exercises-info-content-grid').insertBefore(h2, document.querySelector('.exercises-info-content-grid-text'));

      // Find the scroll position to prevent the page moving to the top after the modal is closed.
      scrollPosition = window.pageYOffset;
      document.body.style.top = -scrollPosition + 'px';
      // Add the class that causes the the core of the webpage to display as fixed, meaning the user,
      // when scrolling, will not be scrolling through the main webpage, but only through the overlay
      document.body.classList.add('show-overlay');

      // Display the overlay and bring in the data from the codepen-info.js object
      let overlay = document.getElementsByClassName("exercises-info")[0];
      let exercisesInfo = codepenData.default;
      overlay.style.display = "flex";

      // Loop through the corresponding object data
      for (const [tempKey, tempVal] of Object.entries(exercisesInfo[`${infoKey}`])) {

        // Set the key which will be used to determine the subheading
        const key = (
          infoKey === 'html' ? 'HTML Projects' :
            infoKey === 'css' ? cssHeaders[tempKey] :
              infoKey === 'js' ? jsHeaders[tempKey] :
                null
        );
        const val = Object.values(tempVal)[0];
        const h3 = document.createElement('h3');
        h3.style.fontSize = '1.4rem';
        // If we have nested objects within the current subheading..
        if (typeof (Object.values(val[0])[0]) === 'object') {
          modalSetup(h3, key);
          // Loop through each of these inner objects..
          Object.entries(val[0]).forEach(entry => {
            // Creating both a subheading for this inner-object..
            const innerH3 = document.createElement('h3');
            modalSetup(innerH3, Object.values(entry)[0]);
            // And looping through the inner object to populate the modal with the innermost data
            for (const innerVal of Object.values(entry[1])) {
              populateModal(innerVal.title, innerVal.link);
            }
          });

          // If there is only only one sub layer of objects, as is the case with the CSS data..
        } else if (typeof (val) === 'object') {
          modalSetup(h3, key);
          // Loop through each inner object and populate the modal accordingly
          val.forEach(entry => populateModal(entry.title, entry.link));
        } else if (typeof (val) === 'string') {
          modalSetup(h3, key, isSetup);
          isSetup = true;
          // Else, we need not loop through anything internally, for there are no objects to
          // loop through, and may just populate this part of the modal as such then proceed
          // to the next title/link pair
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