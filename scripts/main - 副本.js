"use strict";

let valueSpeed = document.querySelector("#thresholdValue");
valueSpeed.textContent = localStorage.getItem("setSpeed");
let myButton = document.querySelector("#setSpeedButton");
let blueButton = document.querySelector("#requestBluetooth");
let discon = document.querySelector("#disBluetooth");

function setSpeed() {
  let speed = prompt("请输入速度阈值。");
  if (speed === null) return 0;
  let x = +speed;

  if (x <= 0 || !speed) {
    alert("您输入的速度阈值太小！");
    setSpeed();
  } else {
    localStorage.setItem("setSpeed", x);
    valueSpeed.textContent = localStorage.getItem("setSpeed");
  }
}

myButton.onclick = function () {
  setSpeed();
};
/*blueButton.onclick=function(){
}*/

discon.onclick = function () {
  bicycle.disconnect();
};

class Bicycle {
  constructor() {
    this.device = null;
    this.onDisconnected = this.onDisconnected.bind(this);
  }

  request() {
    let options = {
      filters: [
        {
          services: [0xfff0]
        }
      ],
      optionalServices: [0xffe0]
    };
    return navigator.bluetooth.requestDevice(options).then((device) => {
      this.device = device;
      this.device.addEventListener(
        "gattserverdisconnected",
        this.onDisconnected
      );
    });
  }

  connect() {
    if (!this.device) {
      return Promise.reject("Device is not connected.");
    }

    return this.device.gatt.connect();
  }
/*
  readSpeed() {
    return this.device.gatt
      .getPrimaryService(0xffe0)
      .then((service) => service.getCharacteristic(0xffe1))
      .then((characteristic) => characteristic.readValue());
  }
  */
  startNotifications() {
    this.device.gatt
      .getPrimaryService(0xffe0)
      .then((service) => service.getCharacteristic(0xffe1))
      .then((characteristic) => {
          characteristic.addEventListener("characteristicvaluechanged", (e) => {
              
          let data = e.target.value;
          let haha = [];
          for (let i = 0; i < data.byteLength; i++) {
            haha.push(data.getUint8(i).toString(10).padStart(4, "0"));
          }

        //  console.log("characteristicvaluechanged: " + haha.join(""));
          document.querySelector("#realSpeed").textContent =
            "characteristicvaluechanged: " + haha.join("") + "\n";
      /*  let data = e.target.value;
        let haha = new Array(data.byteLength);

      for (let i = 0; i < data.byteLength; i++) {
          haha[i] = data.getUint8(i);
      }
      console.log(haha);
      document.querySelector("#realSpeed").textContent +=
        "characteristicvaluechanged: " + String.fromCharCode.apply(null, haha) + "\n";   */
        });
        characteristic.startNotifications();
      });
  }

  disconnect() {
    if (!this.device) {
      return Promise.reject("Device is not connected.");
    }

    return this.device.gatt.disconnect();
  }

  onDisconnected() {
    console.log("Device is disconnected.");
  }
}

var bicycle = new Bicycle();
blueButton.addEventListener("click", (event) => {
  bicycle
    .request()
    .then((_) => bicycle.connect())
    .then((_) => {
      /*bicycle.readSpeed().then(value =>{
        console.log(value.getUint8());*/
      bicycle.startNotifications();
    })
    .catch((error) => {
      console.log(error);
    });
});

    function hex2ascii(hex){
    var a=hex;
    for(var i=0;;i++){
        
    }
    }