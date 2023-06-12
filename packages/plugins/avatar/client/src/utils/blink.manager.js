import { VRMExpressionPresetName } from "@pixiv/three-vrm";
import { Clock } from "three";
import { customDebug } from "./custom.debug";


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
