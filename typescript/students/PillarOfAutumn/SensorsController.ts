import { withinPiRange, Vector2 } from '../helpers.js'
import SensorsController from '../../src/subsystems/sensorsController.js'
import YourDefenceController from './DefenseController.js'
import YourNavigationController from './NavigationController.js'
import YourPropulsionController from './PropulsionController.js'
import { EMSReading, PassiveReading } from '../types.js'
export default class YourSensorsController extends SensorsController {
	// To get other subsystem information, use the attributes below.
	// @ts-ignore
	defence: YourDefenceController // @ts-ignore
	navigation: YourNavigationController // @ts-ignore
	propulsion: YourPropulsionController

	//Add additional attributes here
	target:PassiveReading|null=null
	timeCounter: number = 0
	asteroidHeading: Array<EMSReading> = []
	slowDown: boolean = false;
	
	sensorsUpdate(activeScan: (heading: number, arc: number, range: number) => EMSReading[] | Error, passiveScan: () => PassiveReading[] | Error) {
		
		if(this.timeCounter % 500 == 0){
			const passScanRes = passiveScan()
			console.log(passScanRes)
			if (!(passScanRes instanceof Error)) {
				passScanRes.forEach((reading) => {
					if(reading.gravity > 0.02 || reading.gravity < 0){
						this.target = reading;
						console.log(this.target)
					}
				})
			} else {
				// Something went wrong, you should probably log this and make sure it doesn't happen again
			}
		}

		if(this.timeCounter % 60 == 0){
			const activeScanResult = activeScan(this.navigation.angle - 0.4, 1.1, 130)
			if(!(activeScanResult instanceof Error)) {
				activeScanResult.forEach((reading) => {
					
					if(reading.closeRange?.type == "Asteroid"){
						this.asteroidHeading.push(reading)
						console.log(reading.closeRange.type)
					}
					if(reading.closeRange?.type == "Planet"){
						this.slowDown == true
					}
				})
			}
		}
		
		
		this.timeCounter++;
			
		
		}
	}

