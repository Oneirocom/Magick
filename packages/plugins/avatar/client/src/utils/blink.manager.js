import { VRMExpressionPresetName } from "@pixiv/three-vrm";

class Clock {

  constructor( autoStart = true ) {

    this.autoStart = autoStart;

    this.startTime = 0;
    this.oldTime = 0;
    this.elapsedTime = 0;

    this.running = false;

  }

  start() {

    this.startTime = now();

    this.oldTime = this.startTime;
    this.elapsedTime = 0;
    this.running = true;

  }

  stop() {

    this.getElapsedTime();
    this.running = false;
    this.autoStart = false;

  }

  getElapsedTime() {

    this.getDelta();
    return this.elapsedTime;

  }

  getDelta() {

    let diff = 0;

    if ( this.autoStart && ! this.running ) {

      this.start();
      return 0;

    }

    if ( this.running ) {

      const newTime = now();

      diff = ( newTime - this.oldTime ) / 1000;
      this.oldTime = newTime;

      this.elapsedTime += diff;

    }

    return diff;

  }

}

function now() {
  return ( typeof performance === 'undefined' ? Date : performance ).now(); // see #10732
}

export class BlinkManager {
  constructor(closeTime = 0.1, openTime = 0.1, continuity = 0.3, randomness = 5) {
    this.vrmBlinkers = [];
    this.mode = 'ready';
    this.clock = new Clock();
    this.closeTime = closeTime
    this.openTime = openTime
    this.continuity = continuity;
    this.randomness = randomness
    this._eyeOpen = 1
    this._blinkCounter = 0;
    this.update()
  }


  addBlinker(vrm) {
    this.vrmBlinkers.push(vrm)
  }


  update() {
    setInterval(() => {
      const deltaTime = this.clock.getDelta()

      switch (this.mode) {
        case 'closing':
          // customDebug().log('blink.manager#closing: this._eyeOpen: ', this._eyeOpen)

          if (this._eyeOpen > 0) {
            this._eyeOpen -= deltaTime / this.closeTime;

          } else {
            this._eyeOpen = 0
            this.mode = 'open'
          }

          this._updateBlinkers();
          break;

        case 'open':
          // customDebug().log('blink.manager#open: this._eyeOpen: ', this._eyeOpen)

          if (this._eyeOpen < 1) {
            this._eyeOpen += deltaTime / this.openTime;
          } else {
            this._eyeOpen = 1
            this.mode = 'ready'
          }

          this._updateBlinkers();
          break;

        case 'ready':
          this._blinkCounter += deltaTime;

          if (this._blinkCounter >= this.continuity) {
            // customDebug().log('blink.manager#ready: this._blinkCounter: ', this._blinkCounter)
            if (Math.floor(Math.random() * this.randomness) === 0) {
              this.mode = 'closing'
            }
            this._blinkCounter = 0;
          }

          break;
      }
    }, 1000 / 30);
  }


  _updateBlinkers() {
    this.vrmBlinkers.forEach(vrm => {
      const blendShapeValue = 1 - this._eyeOpen
      // customDebug().log('blink.manager#_updateBlinkers: blendShapeValue: ', blendShapeValue)
      vrm.expressionManager.setValue(VRMExpressionPresetName.Blink, blendShapeValue)
      vrm.expressionManager.update()
    });
  }
}
