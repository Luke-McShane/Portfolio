import * as data from "./project-info.js";
let scrollPosition = 0;

window.onload = function () {

  let closeOverlay = document.querySelector("#close");
  closeOverlay.onclick = function () {
    let overlay = document.querySelector(".projects-info");
    overlay.style.display = "none";
    document.body.classList.remove('show-overlay');
    window.scrollTo(0, scrollPosition);
  }

  let readMoreBtns = document.getElementsByClassName("project-btn-2");
  for (let i = 0; i < readMoreBtns.length; i++) {
    let currentBtn = readMoreBtns[i];
    currentBtn.onclick = function () {
      scrollPosition = window.pageYOffset;
      document.body.style.top = -scrollPosition + 'px';
      document.body.classList.add('show-overlay');

      let overlay = document.getElementsByClassName("projects-info")[0];
      let projectInfo = data.default;
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

      let overlayTitle = overlay.querySelector("#modal-title");
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