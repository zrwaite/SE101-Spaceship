import PropulsionController from '../../src/subsystems/propulsionController.js';
import { angleDiff } from '../helpers.js';
export default class YourPropulsionController extends PropulsionController {
    //Add additional attributes here
    propulsionUpdate(setThruster) {
        if (!this.sensors.targets)
            return;
        const headingDiff = angleDiff(this.navigation.angle, this.sensors.targets[0].heading);
        const force = Math.min(Math.abs(500 * headingDiff), 100);
        if (headingDiff < 0) {
            setThruster('clockwise', force);
            setThruster('counterClockwise', 0);
        }
        else {
            setThruster('counterClockwise', force);
            setThruster('clockwise', 0);
        }
        setThruster('main', Math.abs(headingDiff) < 0.7 ? 30 : 0);
    }
}
