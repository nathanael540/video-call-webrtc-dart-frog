// VARS
const emojisOptions = [
  "🎁",
  "🌹",
  "💝",
  "💖",
  "❤️‍🔥",
  "🔥",
  "⚠️",
  "🧨",
  "🎉",
  "🎊",
  "🏆",
  "🍅",
  "🍭",
  "🍼",
  "💐",
  "🌻",
  "🌼",
  "🌈",
  "⭐",
];
const waitListServerWWS = "ws://localhost:8080/ws";
let friendId;
let sendingIdToSearchTimeout = null;
let sendIdToSearchTries = 0;
const maxTries = 15;
let timerInterval = null;

// Search friend
async function sendIdToSearchFriend(socket) {
  if (friendId != null) {
    clearInterval(sendingIdToSearchTimeout);
    sendIdToSearchTries = 0;
    socket.close();
    return;
  }

  if (sendIdToSearchTries > maxTries) {
    socket.close();
    stopCallAndSearch();

    dialog(
      "Tempo esgotado",
      "Não foi possível encontrar uma pessoa para conversar. Tente novamente mais tarde..."
    );
    return;
  }

  socket.send(
    JSON.stringify({ name: "join", data: '{"id": "' + getUserId() + '"}' })
  );
  sendIdToSearchTries++;

  sendingIdToSearchTimeout = setTimeout(
    () => sendIdToSearchFriend(socket),
    5000
  );
}

function stopCallAndSearch() {
  resetVideoSources();
  navPage("intro");
}

async function searchFriend() {
  resetVideoSources();
  startTimer(true);
  await navPage("searching");

  // Random number from 3 to 10 seconds
  const randomTime = Math.floor(Math.random() * 7000) + 3000;
  await new Promise((resolve) => setTimeout(resolve, randomTime));

  const listSocket = new WebSocket(waitListServerWWS);

  listSocket.onmessage = function (message) {
    const event = JSON.parse(message.data);
    if (event.name == "room") {
      const users = event.data;
      friendId = users[0] == getUserId() ? users[1] : users[0];

      listSocket.close();
    }
  };

  listSocket.onerror = function (event) {
    searchFriend();
  };

  listSocket.onclose = function (event) {
    if (friendId) {
      preConnectPeer();
    }
  };

  listSocket.onopen = function (event) {
    sendIdToSearchFriend(listSocket);
  };
}

async function preStart() {
  const cameraAccess = await askCameraPermissions();
  if (!cameraAccess) {
    return;
  }

  searchFriend();
}

async function askCameraPermissions() {
  showLoading("Obtendo acesso à câmera...");
  const mediaStream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "user" },
    audio: true,
  });
  hideLoading();

  if (mediaStream.getVideoTracks().length == 0) {
    dialog(
      "Sem acesso à câmera",
      "Não foi possível obter acesso à câmera. Sem acesso à câmera, não é possível usar o aplicativo."
    );
    return false;
  }

  mediaStream.getTracks().forEach(function (track) {
    track.stop();
  });

  return true;
}

// Utils
function getUserId() {
  const hash = location.hash.replace("#", "");
  if (!hash || hash == "") {
    if (localStorage.getItem("userId")) {
      return localStorage.getItem("userId");
    }

    dialog(
      "Sem dados",
      "Não foi possível encontrar seu id de usuário. Por favor, feche o aplicativo e tente entrar novamente."
    );

    return "sem-id";
  }

  const userId = "videocalls-" + hash;

  window.localStorage.setItem("userId", userId);

  return userId;
}

// UI
function showLoading(message = "Carregando...") {
  const loading = document.getElementById("loading");

  document.getElementById("loading-message").innerHTML = message;

  loading.style.display = "flex";
  loading.classList.add("animated", "fadeIn");
}

function hideLoading() {
  const loading = document.getElementById("loading");
  loading.classList.remove("animated", "fadeIn");
  loading.classList.add("animated", "bounceOutDown");
  setTimeout(function () {
    loading.style.display = "none";
    loading.classList.remove("animated", "bounceOutDown");
  }, 800);
}

function dialog(titulo, mensagem, callback = null) {
  document.getElementById("dialog-title").innerHTML = titulo;
  document.getElementById("dialog-content").innerHTML = mensagem;

  if (callback) {
    document.querySelector("#dialog button").onclick = callback;
  }

  const dialogBG = document.getElementById("dialog");
  dialogBG.classList.add("animated", "fadeIn");
  dialogBG.style.display = "flex";

  setTimeout(function () {
    const dialogBox = document.querySelector("#dialog .content");
    dialogBox.classList.add("animated", "bounceIn");
    dialogBox.style.display = "block";
  }, 300);
}

function closeDialog() {
  const dialogBG = document.getElementById("dialog");
  dialogBG.classList.remove("animated", "fadeIn");
  const dialogBox = document.querySelector("#dialog .content");
  dialogBox.classList.remove("animated", "bounceIn");

  dialogBox.classList.add("animated", "bounceOutDown");
  setTimeout(function () {
    dialogBG.style.display = "none";
  }, 800);

  setTimeout(function () {
    dialogBox.style.display = "none";
    dialogBox.classList.remove("animated", "bounceOutDown");
  }, 2000);
}

function emojiExplosion(emoji) {
  window.emojisExplosionRunning = window.emojisExplosionRunning || [];

  if (window.emojisExplosionRunning.indexOf(emoji) > -1) {
    return;
  }

  window.emojisExplosionRunning.push(emoji);

  emojisplosion({
    container: document.getElementById("visual-effects"),
    emojis: [emoji],
    emojiCount: () => Math.random() * 100 + 30,
    physics: {
      fontSize: {
        max: 100,
        min: 20,
      },
    },
    position: {
      x: window.innerWidth / 2,
      y: window.innerHeight - 50,
    },
  });
  setTimeout(function () {
    window.emojisExplosionRunning.splice(
      window.emojisExplosionRunning.indexOf(emoji),
      1
    );
  }, 5000);
}

function isEmoji(str) {
  let isValue = false;

  emojisOptions.forEach(function (emoji) {
    if (str.indexOf(emoji) > -1) {
      isValue = true;
    }
  });
  return isValue;
}

function changeEmojis() {
  const buttons = document.querySelectorAll("#controls button.icon");
  let emojiUsed = [];
  for (const element of buttons) {
    const button = element;
    let emoji = emojisOptions[Math.floor(Math.random() * emojisOptions.length)];
    while (emojiUsed.indexOf(emoji) > -1) {
      emoji = emojisOptions[Math.floor(Math.random() * emojisOptions.length)];
    }
    emojiUsed.push(emoji);
    button.innerHTML = emoji;
  }
}

function startTimer(resert = false) {
  const timerCounters = document.querySelectorAll(".timer-counter");

  if (resert) {
    clearInterval(timerInterval);
    timerCounters.forEach(function (timerCounter) {
      timerCounter.innerHTML = "00 : 00";
    });
  }

  const time = timerCounters[0].innerHTML.split(":");
  let minutes = parseInt(time[0].trim());
  let seconds = parseInt(time[1].trim());

  if (seconds == 59) {
    minutes++;
    seconds = 0;
  }

  seconds++;

  if (seconds < 10) {
    seconds = "0" + seconds;
  }

  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  const newTime = minutes + " : " + seconds;

  timerCounters.forEach(function (timerCounter) {
    timerCounter.innerHTML = newTime;
  });

  timerInterval = setTimeout(startTimer, 1000);
}

async function navPage(pageId) {
  hideLoading();

  const nextPage = document.getElementById(pageId);
  const currentPage = document.querySelector(".page.show");

  if (nextPage.id == currentPage.id) {
    return;
  }

  changePage(currentPage, "out");
  await changePage(nextPage, "in");
}

const changePage = (selectorOrNode, direction) => {
  return new Promise((resolve, reject) => {
    pageTransition(selectorOrNode, direction, (err, data) => {
      if (err) {
        return reject(err);
      }

      resolve(data);
    });
  });
};

function pageTransition(selectorOrNode, direction, callback) {
  const zIndexClass = direction == "out" ? "outPage" : "show";
  const animationName = direction == "out" ? "bounceOutDown" : "bounceInRight";
  const node =
    typeof selectorOrNode == "string"
      ? document.querySelector(selectorOrNode)
      : selectorOrNode;

  // Remove classes de animação
  node.classList.remove(
    "animated",
    "bounceInRight",
    "bounceOutDown",
    "show",
    "hidden"
  );

  // Adiciona classes de animação
  node.classList.add(zIndexClass, "animated", animationName);

  function handleAnimationEnd() {
    node.classList.remove("animated", animationName);

    // Add classe de hidden
    if (direction == "out") {
      node.classList.add("hidden");
    }

    node.removeEventListener("animationend", handleAnimationEnd);

    if (typeof callback === "function") callback();
  }

  node.addEventListener("animationend", handleAnimationEnd);
}

document.addEventListener("DOMContentLoaded", function () {
  if (getUserId() == "sem-id") return;

  // Altera emojis da tela de chamada de video
  setInterval(changeEmojis, 15000);

  // Esconde o loading
  hideLoading();
});
