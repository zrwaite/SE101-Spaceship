import { angleDiff } from '../helpers.js';
import PropulsionController from '../../src/subsystems/propulsionController.js';
export default class YourPropulsionController extends PropulsionController {
    //Add additional attributes here
    propulsionUpdate(setThruster) {
        const target = this.sensors.target;
        if (!target)
            return;
        const angularVelocity = this.navigation.angularVelocity;
        // const targetVec = new Vector2(Math.cos(target.heading), Math.sin(target.heading));
        // const velVec = new Vector2(this.navigation.linearVelocityX, this.navigation.linearVelocityY);
        // const velVecProj = targetVec.scale(targetVec.dot(velVec.normalize()));
        // const headingVec = velVec.scale(-1).add(targetVec.scale(1));
        // let heading = 0;
        // if (velVec.magnitude() > 1.2 || angleDiff(velVec.angle(), target.heading) > 0.05) {
        //     const headingAngle = headingVec.angle();
        //     heading = angleDiff(this.navigation.angle, headingAngle);       
        // }
        // else {
        //     heading = angleDiff(this.navigation.angle, target.heading);     
        // }
        const heading = angleDiff(this.navigation.angle, target.heading);
        const direction = angularVelocity == 0 ? "away" : heading / angularVelocity < 0 ? "towards" : "away";
        let force = 0;
        if (direction == "away" || direction == "towards" && Math.abs(heading) > 15 * angularVelocity) {
            // implement algorithm to go back
            force = Math.min(Math.abs(500 * heading * Math.sqrt(Math.abs(heading))), 100);
            if (heading < 0) {
                setThruster('clockwise', force);
                setThruster('counterClockwise', 0);
            }
            else {
                setThruster('counterClockwise', force);
                setThruster('clockwise', 0);
            }
        }
        else {
            // implement algorithm to slow down
            force = Math.min(angularVelocity * 15000, 100);
            if (heading < 0) {
                setThruster('counterClockwise', force);
                setThruster('clockwise', 0);
            }
            else {
                setThruster('clockwise', force);
                setThruster('counterClockwise', 0);
            }
        }
        setThruster('main', Math.abs(heading) < 0.2 ? 100 : 0);
        setThruster("bow", 0);
        const objects = this.sensors.activeScanData;
        if (objects) {
            for (let i = 0; i < (objects.length); i++) {
                const object = objects[i];
                const speed = Math.sqrt(this.navigation.linearVelocityX * this.navigation.linearVelocityX + this.navigation.linearVelocityY + this.navigation.linearVelocityY);
                if (object.distance < 400 && object.velocity.magnitude() <= 0.01) {
                    const acceleration = speed * speed / 2 / object.distance;
                    setThruster('bow', Math.abs(heading) < 0.2 ? Math.min(acceleration * 10000, 100) : 0);
                    setThruster("main", 0);
                }
            }
        }
    }
}
