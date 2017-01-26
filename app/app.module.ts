import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptFormsModule } from "nativescript-angular/forms";

import { AppComponent } from "./app.component";
import { MonitoringService } from "./service/monitoring.service";

@NgModule({
    declarations: [AppComponent],
    bootstrap: [AppComponent],
    imports: [
        NativeScriptModule,
        NativeScriptFormsModule
    ],
    providers: [
        MonitoringService
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule {}
