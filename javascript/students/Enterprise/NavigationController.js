import NavigationController from '../../src/subsystems/navigationController.js';
export default class YourNavigationController extends NavigationController {
    constructor() {
        super(...arguments);
        this.angle = 0; //initializes angle
    }
    navigationUpdate(getShipStatus, warp, land, getMapData) {
        const closeRangeObject = this.sensors.closeRangeObject;
        // Landing if the distance between the spaceship and A planet is less than 20
        closeRangeObject && closeRangeObject.forEach(object => {
            if (object === null || object === void 0 ? void 0 : object.closeRange) {
                if (object.closeRange.type === 'Planet' && object.distance < 50)
                    land();
                else if (object.closeRange.type === 'WarpGate' && object.distance < 50)
                    warp();
            }
        });
        this.angle = getShipStatus("angle");
    }
}
