import { Injectable, NgZone } from "@angular/core";
import { Location, Options } from "nativescript-geolocation";
import * as geolocation from "nativescript-geolocation";

@Injectable()
export class MonitoringService {

    public static readonly DEFAULT_OPTIONS: Options = {
        minimumUpdateTime: 10000
    };

    constructor(
        private zone: NgZone
    ) {
    }

    public isEnabled(): boolean {
        return geolocation.isEnabled();
    }

    public enableLocationRequest(always?: boolean): Promise<void> {
        return geolocation.enableLocationRequest(always);
    }

    public watchLocation(
        successCallback: (location: Location) => void,
        errorCallback?: (error: Error) => void,
        options?: Options
    ): number {
        console.log("watchLocation()");
        return geolocation.watchLocation(location => {
            this.zone.run(() => {
                successCallback(location);
            });
        }, (error) => {
            console.error("Error: during watchLocation()");
            if (errorCallback) {
                errorCallback(error);
            }
        }, options || MonitoringService.DEFAULT_OPTIONS);
    }

    public clearWatch(watchId: number) {
        console.log("clearWatch()");
        geolocation.clearWatch(watchId);
    }
}
