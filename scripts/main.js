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
        sendSpeed();
        //valueSpeed.textContent = localStorage.getItem("setSpeed");

    }
}

function sendSpeed(){
    const uint8arr=Uint8Array.of(localStorage.getItem("setSpeed"));
    bicycle.writeSpeed(uint8arr);
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
writeSpeed(data) {
    return this.device.gatt.getPrimaryService(0xFFE0)
    .then(service => service.getCharacteristic(0xFFE1))
    .then(characteristic => characteristic.writeValueWithoutResponse(data));
}

startNotifications() {
    this.device.gatt
        .getPrimaryService(0xffe0)
        .then((service) => service.getCharacteristic(0xffe1))
        .then((characteristic) => {
            characteristic.addEventListener("characteristicvaluechanged", (e) => {
                let data = e.target.value;
                localStorage.setItem("setSpeed",data.getUint8(0).toString(10));
                valueSpeed.textContent = localStorage.getItem("setSpeed");
                document.querySelector("#realSpeed").textContent = "实时速度: " + data.getUint8(1).toString(10).padStart(3, "0") + "\n";
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
//注册service worker
/*if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
        .then(serviceWorker => {
            console.log('Service Worker registered');
        });
}
*/

