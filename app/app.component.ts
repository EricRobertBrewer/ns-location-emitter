import { Component, NgZone, ViewChild, OnInit } from "@angular/core";
import * as application from "application";
import {registerElement} from "nativescript-angular/element-registry";
import { MapView } from "nativescript-google-maps-sdk";
import { Location, Options, isEnabled, enableLocationRequest, watchLocation, clearWatch } from "nativescript-geolocation";

// Important - must register MapView plugin in order to use in Angular templates
registerElement("MapView", () => MapView);

declare var GMSServices: any;

@Component({
    selector: "my-app",
    templateUrl: "app.component.html",
})
export class AppComponent implements OnInit {

    private isMonitoring: boolean = false;
    private locationOptions: Options = {
        minimumUpdateTime: 5000
    };
    private monitorId: number;

    private lastTimestamp: string = "";
    private latitude: number;
    private longitude: number;
    private zoom: number;

    constructor(
        private zone: NgZone
    ) {
        this.resetMapToDefaults();
    }

    ngOnInit() {
        // Also see App_Resources/Android/values/nativescript-google-maps-api.xml
        if (application.ios) {
            GMSServices.provideAPIKey("AIzaSyCM2qDN-vQQuNF9F409MdQYN_lLU0bTims");
        }
    }

    onStartTapped(event) {
        this.startMonitoring();
    }

    startMonitoring() {
        console.log("startMonitoring()");
        if (isEnabled()) {
            if (!this.isMonitoring) {
                this.monitorId = watchLocation(location => {
                    if (location) {
                        this.zone.run(() => {
                            this.lastTimestamp = new Date().toString();
                            console.log("location at ["+this.lastTimestamp+"]: "+JSON.stringify(location));
                            this.latitude = location.latitude;
                            this.longitude = location.longitude;
                            this.zoom = 12.4;
                        });
                    }
                }, (error) => {
                    console.error("Error: during watchLocation()");
                }, this.locationOptions);
                this.isMonitoring = true;
            } else {
                console.error("Error: already monitoring.");
            }
        } else {
            console.warn("Error: isEnabled() === false");
            enableLocationRequest(true).then(() => {
                console.log("Success: user granted access to location services.");
                this.startMonitoring();
            }, (rejectionError) => {
                console.error("Error: user rejected access to location services.");
            }).catch(error => {
                console.error("Caught error in enableLocationRequest(): "+error);
            });
        }
    }

    onStopTapped(event) {
        this.stopMonitoring();
    }

    stopMonitoring() {
        console.log("stopMonitoring()");
        clearWatch(this.monitorId);
        this.isMonitoring = false;
        this.resetMapToDefaults();
    }

    onMapReady(event) {
        console.log("onMapReady():");
    }

    resetMapToDefaults() {
        this.latitude = 38.73686;
        this.longitude = -96.20872;
        this.zoom = 3.1;
    }
}
