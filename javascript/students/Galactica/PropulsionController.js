import { angleDiff } from '../helpers.js';
import PropulsionController from '../../src/subsystems/propulsionController.js';
export default class YourPropulsionController extends PropulsionController {
    constructor() {
        super(...arguments);
        this.prevHeadingDiff = 0;
    }
    //Add additional attributes here
    propulsionUpdate(setThruster) {
        //Student code goes here
        if (!this.sensors.target)
            return;
        const headingDiff = angleDiff(this.navigation.angle, this.sensors.target.heading);
        const turnVelocity = Math.abs(this.prevHeadingDiff - headingDiff); // How fast turning
        let turnForce = Math.min(Math.abs(8000 * headingDiff * (1 + turnVelocity)), 100);
        let mainForce = 60;
        let bowForce = 0;
        let velocityMagnitude = Math.sqrt(Math.pow(this.navigation.xVelocity, 2) + Math.pow(this.navigation.yVelocity, 2));
        if (velocityMagnitude > 2) {
            mainForce = 30;
        }
        // Slows down near planet to prevent taking damage
        if (this.sensors.targetDistance != 0
            && this.sensors.targetDistance < 250
            && (this.sensors.facing == "Planet" || this.sensors.facing == "WarpGate")) {
            mainForce = 0;
            bowForce = 100;
        }
        // Applies force in the opposite direction to slow down the turning
        // Wobbles less
        let antiForce = 0;
        if (Math.abs(headingDiff) < 30 * turnVelocity) { // Range depends on how fast ship is turning
            turnForce = 0;
            antiForce = Math.min(turnVelocity * 3000, 100); // Magnitude depends on how fast ship turning
        }
        if (headingDiff < 0) {
            setThruster('clockwise', turnForce);
            setThruster('counterClockwise', antiForce);
        }
        else {
            setThruster('counterClockwise', turnForce);
            setThruster('clockwise', antiForce);
        }
        setThruster('main', Math.abs(headingDiff) < 0.3 ? mainForce : 0);
        setThruster('bow', bowForce);
        this.prevHeadingDiff = headingDiff; // Update prevHeadingDiff for next iteration
    }
}
