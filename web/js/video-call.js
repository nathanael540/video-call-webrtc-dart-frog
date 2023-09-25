let userPeer;
let friendCall = null;
let friendConnection = null;

function createUserPeer() {
  userPeer = new Peer(getUserId(), {
    debug: 3,
    config: {
      iceServers: [getSTUNServer()],
    },
  });

  userPeer.on("call", onReceiveCall);
  userPeer.on("connection", friendConnectionListen);

  userPeer.on("disconnected", function () {});

  userPeer.on("error", function (error) {
    console.error(error);
    dialog(
      "Aconteceu um erro",
      "Houve um erro de comunicação desconhecido. Por favor, feche o aplicativo e tente entrar novamente."
    );
  });

  userPeer.on("open", function (id) {
    if (!friendConnection) {
      friendConnectionListen(userPeer.connect(friendId));
    }
  });
}

function preConnectPeer() {
  if (userPeer == null) {
    createUserPeer();
  }

  if (!friendConnection) {
    friendConnectionListen(userPeer.connect(friendId));
  }
}

function friendConnectionListen(connectionData) {
  connectionData.on("open", function () {
    if (friendConnection != null) return;

    friendConnection = connectionData;

    friendConnection.on("data", function (data) {
      if (isEmoji(data)) {
        emojiExplosion(data);
      }
    });

    friendConnection.on("close", function () {
      searchFriend();
    });

    friendConnection.on("error", function (err) {
      console.error(err);
    });

    onReceiveCall();
  });
}

function sendEmojiToFriend(element) {
  if (friendConnection != null) {
    friendConnection.send(element.innerHTML);
    emojiExplosion(element.innerHTML);
  } else {
    dialog(
      "Aconteceu um erro",
      "Não foi possível enviar o emoji. Tente novamente mais tarde."
    );
  }
}

async function onReceiveCall(call = false) {
  const isReceiveCall = !!call;

  showLoading("Conectando chamada...");
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
    return;
  }

  showLoading("Iniciando chamada...");

  if (isReceiveCall) {
    call.answer(mediaStream);
  } else {
    call = userPeer.call(friendId, mediaStream);
  }

  videoCallListen(call);

  const videoOut = document.querySelector("#video-out");
  videoOut.srcObject = mediaStream;
  videoOut.onloadedmetadata = function (e) {
    document.getElementById("video-loading").classList.remove("hidden");

    startTimer(true);
    navPage("video-call");

    videoOut.play();
  };
}

function videoCallListen(call) {
  call.on("stream", function (remoteStream) {
    const videoIn = document.querySelector("#video-in");
    videoIn.srcObject = remoteStream;
    videoIn.onloadedmetadata = function (e) {
      document.getElementById("video-loading").classList.add("hidden");

      videoIn.play();
    };
  });

  call.on("close", function (id) {
    searchFriend();
  });

  call.on("error", function (err) {
    console.error(err);
  });

  friendCall = call;
}

// UTILS
function resetVideoSources() {
  window.friendId = null;

  if (friendCall != null) {
    friendCall.close();
  }
  friendCall = null;

  if (friendConnection != null) {
    friendConnection.close();
  }
  friendConnection = null;

  const videoIn = document.querySelector("#video-in");
  videoIn.srcObject = null;
  videoIn.pause();
  videoIn.load();

  const videoOut = document.querySelector("#video-out");
  videoOut.srcObject = null;
  videoOut.pause();
  videoOut.load();

  document.getElementById("video-loading").classList.remove("hidden");

  clearInterval(sendingIdToSearchTimeout);
  window.sendIdToSearchTries = 0;
}

function getSTUNServer() {
  return {
    urls: "stun:stun.l.google.com:19302",
  };
}
