import { Component, NgZone, ViewChild, OnInit } from "@angular/core";
import * as application from "application";
import {registerElement} from "nativescript-angular/element-registry";
import { MapView } from "nativescript-google-maps-sdk";
import { Location, Options } from "nativescript-geolocation";
import { MonitoringService } from "./service/monitoring.service";

// Important - must register MapView plugin in order to use in Angular templates
registerElement("MapView", () => MapView);

declare var GMSServices: any;

@Component({
    selector: "my-app",
    templateUrl: "app.component.html",
})
export class AppComponent implements OnInit {

    private options: Options = {
        minimumUpdateTime: 10000
    };
    private monitorId?: number = null;

    private lastTimestamp: Date = null;
    private latitude: number;
    private longitude: number;
    private zoom: number;

    constructor(
        private monitoringService: MonitoringService
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
        if (this.monitoringService.isEnabled()) {
            if (!this.monitorId) {
                this.monitorId = this.monitoringService.watchLocation(location => {
                    if (location) {
                        console.log("location at ["+location.timestamp.toString()+"]: "+JSON.stringify(location));
                        this.lastTimestamp = location.timestamp;
                        this.latitude = location.latitude;
                        this.longitude = location.longitude;
                    }
                }, (error) => {
                    console.error("Error: during watchLocation()");
                });
            } else {
                console.error("Error: already monitoring.");
            }
        } else {
            console.warn("Warning: isEnabled() === false");
            this.monitoringService.enableLocationRequest(true).then(() => {
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
        this.monitoringService.clearWatch(this.monitorId);
        this.monitorId = null;
        this.resetMapToDefaults();
    }

    onMapReady(event) {
        console.log("onMapReady():");
    }

    resetMapToDefaults() {
        this.latitude = 38.73686;
        this.longitude = -96.20872;
        this.zoom = 3;
    }
}
