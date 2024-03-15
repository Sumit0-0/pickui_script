// ==UserScript==
// @name        Picuki Features
// @namespace   Violentmonkey Scripts
// @match       https://picuki.me/*
// @grant       none
// @version     1.0
// @author      -
// @downloadURL https://github.com/Sumit0-0/picuki_script/raw/main/pickui.user.js
// @updateURL   https://github.com/Sumit0-0/picuki_script/raw/main/pickui.user.js
// @description Picuki Instagram frontend Some Features.
// @icon        https://www.google.com/s2/favicons?sz=64&domain=picuki.me
// ==/UserScript==

const pathname = window.location.pathname;

if (!localStorage.getItem("users")) {
  console.log("Storage Initialized");
  localStorage.setItem("users", "[]");
}

const mediaPlayer = () => {
  const videoEle = document.createElement("video");
  const sourceEle = document.createElement("source");
  sourceEle.setAttribute("type", "video/mp4");
  videoEle.setAttribute("controls", "controls");
  videoEle.setAttribute("style", "width: 100%; height: 100%;");
  const mediaWrap = document.querySelector(".media-wrap");
  if (mediaWrap) {
    sourceEle.setAttribute("src", mediaWrap.getAttribute("data-src"));
    videoEle.appendChild(sourceEle);
    mediaWrap.appendChild(videoEle);
  } else {
    console.error(
      "Video Source Not Found: " + "Picuki Features couldn't play video."
    );
  }
};

if (pathname.startsWith("/p/")) {
  mediaPlayer();
}

if (pathname !== "/" && !pathname.startsWith("/p/")) {
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const Button = document.createElement("button");
  const tag = document.querySelector(".user-header .avatar img").alt;
  Button.textContent = "Add Bookmark";
  Button.classList.add("bookmark-btn");
  Button.classList.add("add-bookmark");
  Button.setAttribute("data-id", tag);
  Button.setAttribute("type", "button");
  Button.onclick = () => {
    addBookmark();
  };
  const isHave = users.find((user) => {
    return user.link === window.location.href;
  });
  if (!isHave) {
    document.querySelector(".tabs").appendChild(Button);
  } else {
    const tag = document.querySelector(".user-header .avatar img").alt;
    const removeEle = `<button type="button" data-id="${tag}" class="remove-bookmark bookmark-btn">Remove</button>`;
    document.querySelector(".tabs").insertAdjacentHTML("beforeend", removeEle);
  }
}

const addBookmark = () => {
  const users = JSON.parse(localStorage.getItem("users"));
  const isHave = users.find((user) => {
    return user.link === window.location.href;
  });
  if (!isHave) {
    document.querySelector(".add-bookmark").textContent = "Added";
    users.push(userDetails());
    localStorage.setItem("users", JSON.stringify(users));
    window.location.reload();
  }
};

const exportBtn = () => {
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const data = JSON.stringify(users);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const downloadBookmark = document.createElement("a");
  downloadBookmark.style.textDecoration = "underline";
  downloadBookmark.style.marginLeft = "10px";
  downloadBookmark.setAttribute("href", url);
  downloadBookmark.setAttribute(
    "download",
    `bookmark-${new Date().toISOString()}.json`
  );
  downloadBookmark.innerHTML = "Export";
  return downloadBookmark;
};

const userDetails = () => {
  const link = document.querySelector(".user-header .avatar a").href;
  const avatar = document.querySelector(".user-header .avatar img").src;
  const tag = document.querySelector(".user-header .avatar img").alt;
  const followers = document.querySelector(".followers span").textContent;
  if (!link || !avatar || !tag || !followers) {
    return console.error("Element not found");
  }
  return { link, avatar, tag, followers, id: tag };
};

const injectBookmark = () => {
  if (window.location.pathname === "/") {
    const localStorage = window.localStorage;
    let users = JSON.parse(localStorage.getItem("users") || "[]");
    const data = JSON.stringify(users);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const downloadBookmark = document.createElement("a");
    downloadBookmark.style.textDecoration = "underline";
    downloadBookmark.style.marginLeft = "10px";
    downloadBookmark.setAttribute("href", url);
    downloadBookmark.setAttribute(
      "download",
      `Picuki-${new Date().toISOString()}.json`
    );
    downloadBookmark.innerHTML = "Export";

    const title = "Bookmark";
    const indexSection = `
    <div class="index-section">
    <div class="index-section-title">${title}  | ${exportBtn().outerHTML}</div>
    <table class="index-items">
        <tbody>
        ${users
          .map(
            (user) => `
            <tr class="index-item">
                <td class="user-wrap">
                    <a class="user-info" href="${user.link}">
                        <img src="${user.avatar}" alt="${user.tag}">
                        <h2>${user.tag}</h2>
                    </a></td>
                <td class="count-wrap">
                    <div class="fllow-count">${user.followers}</div>
                </td>
                <td class="increase">
                    <div class="">
                        <button type="button" data-id="${user.tag}" class="remove-bookmark bookmark-btn">Remove</button>
                    </div>
                </td>
            </tr>
        `
          )
          .join("")}
        </tbody>
    </table>
</div>
    `;
    const appElement = document.querySelector("#app .slogan");
    if (appElement) {
      appElement.insertAdjacentHTML("afterend", indexSection);
    }
  }
};

function removeBookmark() {
  const removeBtn = document.querySelectorAll(".remove-bookmark");
  if (removeBtn) {
    removeBtn.forEach((btn) => {
      btn.addEventListener("click", () => {
        const users = JSON.parse(localStorage.getItem("users"));
        const id = btn.getAttribute("data-id");
        const index = users.findIndex((user) => user.id === id);
        users.splice(index, 1);
        localStorage.setItem("users", JSON.stringify(users));
        window.location.reload();
      });
    });
  }
}

function importBookmark() {
  try {
    const fileInput = `
    <label for="file-input" class="bookmark-btn">Import Bookmark</label>
    <input type="file" id="file-input" style="display: none;" accept=".json">
    </input>
  `;
    const header = document.getElementsByClassName("g-header-inner");
    header[0].insertAdjacentHTML("beforeend", fileInput);
    const fileInputElement = document.getElementById("file-input");
    if (fileInputElement) {
      fileInputElement.addEventListener("change", (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          const data = JSON.parse(reader.result);
          localStorage.setItem("users", JSON.stringify(data));
          location.reload();
        };
        reader.readAsText(file);
      });
    }
  } catch (error) {
    console.error(error);
  }
}

injectBookmark();
importBookmark();
removeBookmark();

(() => {
  const video = document.querySelector(".media-video video");
  if (video) {
    let isplaying = false;
    video.addEventListener("click", () => {
      if (isplaying) {
        video.pause();
      } else {
        video.play();
      }
      isplaying = !isplaying;
    });
  }
})();
