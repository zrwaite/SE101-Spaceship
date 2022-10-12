import { Vector2 } from '../helpers.js'
import { MapData, ShipStatus} from '../types.js'

import NavigationController from '../../src/subsystems/navigationController.js'
import YourDefenceController from './DefenseController.js'
import YourPropulsionController from './PropulsionController.js'
import YourSensorsController, { SpaceObject } from './SensorsController.js'
import ColonyShip from '../../src/ship/colonyShip.js'

export default class YourNavigationController extends NavigationController {
	// To get other subsystem information, use the attributes below.
	// @ts-ignore
	defence: YourDefenceController // @ts-ignore
	sensors: YourSensorsController // @ts-ignore
	propulsion: YourPropulsionController
	angle: number = 0
	

	//Add additional attributes here
	exploredSystems: string[] = []
	mapData: MapData|null = null

	possibleObjects: SpaceObject[] = []

	scanned: boolean = false
	position: Vector2 = new Vector2(0,0)
	angularVelocity: number = 0
	target: Vector2 = new Vector2(0,0)
	targetAngle: number = 0
	targetIsPlanet: boolean | null = null
	distanceIsSet: boolean = false

	landingDistance: number = 50; // change if needed

	navigationUpdate(getShipStatus: (key: keyof ShipStatus) => number, warp: () => Error|null, land: () => Error|null, getMapData: () => MapData) {
		//Student code goes here
		if (!this.scanned) {
			this.mapData = getMapData()
			this.scanned = true;
			this.distanceIsSet = false;
			this.targetIsPlanet = null;
			
		}
		this.possibleObjects = this.sensors.warpgatesOrPlanets
		this.updateTarget()

		// Constantly update position
		this.position = new Vector2(getShipStatus('positionX'), getShipStatus('positionY'))
		this.angularVelocity = getShipStatus('angularVelocity')
		this.angle = getShipStatus('angle')
		this.targetAngle = this.target.angle()
		// If target has been set
		if (this.targetIsPlanet !== null) {

			// If the target is a planet
			if (this.targetIsPlanet === true) {

				// If we're close enough, attempt to land
				if (this.target.magnitude() !== 0 && this.target.magnitude() <= this.landingDistance) {
					land()
				}
			} else {

				// If instead the target is a warp gate, attempt to warp
				if (this.target.magnitude() !== 0 && this.target.magnitude() <= this.landingDistance) {
					warp()
				}
			}
		}
		
		
	}

	//getter for mapData
	public get getMapData() {
		return this.mapData
	}

	//getter for target, returns target or null
	public get getTarget() {
		return this.target
	}


	// tries to update target
	updateTarget() {
		let d = 100000 // distance to target, used in x and y calculation
		for (var val of this.possibleObjects) {
			// If the target is a planet
			console.log(val.angle)
			if (val.type === 'Planet') {

				if (this.distanceIsSet && val.distance === undefined) {
					continue;
				}
				if (!(val.distance === undefined)) {
					d = val.distance
					this.distanceIsSet = true;
				}

				// save target angle
				this.targetAngle = val.angle
				// Calculate target vector
				this.target.set(d * Math.cos(val.angle), d * Math.sin(val.angle))
				if (this.targetIsPlanet === null)
					this.targetIsPlanet = true;
				break;
			} else {		// If target is not a planet
				
				if (!(val.distance === undefined)) {
					d = val.distance
				}
				
				// save target angle
				this.targetAngle = val.angle

				// Calculate target vector
				this.target.set(d * Math.cos(val.angle), d * Math.sin(val.angle))
				if (this.targetIsPlanet === null)
					this.targetIsPlanet = false;
			}
		} 
	
		
	}


	// Public get function to get x and y coordinates of ship
	public get getPosition() {
		return this.position
	}

	// Public get function to get angular velocity of ship
	public get getAngularVelocity() {
		return this.angularVelocity
	}
	public get getTargetAngle() {
		return this.targetAngle
	}

	public get getTargetMagnitude() {
		return this.target.magnitude()
	}


}