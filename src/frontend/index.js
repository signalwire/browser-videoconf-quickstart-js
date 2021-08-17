"use strict";
const $ = (x) => document.getElementById(x);

const backendurl = "";

let room;

// Simple js to control when forms appear
function gotopage(pagename) {
  if (pagename === "getusername") {
    $("getusername").style.display = "block";
    $("videoroom").style.display = "none";
    $("loading").style.display = "none";
  } else if (pagename === "videoroom") {
    $("getusername").style.display = "none";
    $("videoroom").style.display = "block";
    $("loading").style.display = "none";
  } else {
    $("getusername").style.display = "none";
    $("videoroom").style.display = "none";
    $("loading").style.display = "block";
  }
}

async function joinwithusername() {
  let username = $("usernameinput").value.trim();
  console.log("The user picked username", username);
  gotopage("loading");

  try {
    let token = await axios.post(backendurl + "/get_token", {
      user_name: username
    });
    console.log(token.data);
    token = token.data.token;

    try {
      console.log("Setting up RTC session");
      room = await SignalWire.Video.joinRoom({
        token,
        rootElementId: "root"
      });

      room.on("room.joined", (e) => logevent("You joined the room"));
      room.on("member.joined", (e) =>
        logevent(e.member.name + " has joined the room")
      );
      room.on("member.left", (e) =>
        logevent(e.member.id + " has left the room")
      );
    } catch (error) {
      console.error("Something went wrong", error);
    }

    gotopage("videoroom");
  } catch (e) {
    console.log(e);
    alert("Error encountered. Please try again.");
    gotopage("getusername");
  }
}

async function hangup() {
  if (room) {
    await room.hangup();
    gotopage("getusername");
  }
}

function logevent(message) {
  $("events").innerHTML += "<br/>" + message;
}

//Start
gotopage("getusername");
