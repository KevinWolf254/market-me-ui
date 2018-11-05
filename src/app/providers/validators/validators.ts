import { AbstractControl, ValidationErrors, AsyncValidatorFn } from "@angular/forms";
import { Observable } from "rxjs";
import { CampaignService } from '../services/campaign.service';
import { map } from 'rxjs/operators';

export function selectValidator(control: AbstractControl) {

    if (control && (control.value != null || control.value != undefined)) {
        const role = control.value;

        if (role == 0) {
            return {
                defaultValue: true
            };
        }

        return null;
    }
}

export function countryValidator(control: AbstractControl) {

    if (control && (control.value != null || control.value != undefined)) {
        const role = control.value;

        if (role == 4) {
            return {
                defaultValue: true
            };
        }

        return null;
    }
}
export function confirmPasswordValidator(control: AbstractControl) {

    if (control && (control.value != null || control.value != undefined)) {
        const confirmPass = control.value;
        const passControl = control.root.get('newPass');

        if (passControl) {
            const pass = passControl.value;
            if (pass != confirmPass) {
                return {
                    notMatch: true
                };
            }
        }

        return null;
    }
}

export function campaignNameValidator(campaignService: CampaignService): AsyncValidatorFn {

    return (control: AbstractControl): Promise<ValidationErrors> | Observable<ValidationErrors> | null => {
        return campaignService.checkName(control.value).pipe(
            map((response: Response) => {
                if (response.status == 200) {
                    return {
                        campaignNameValidator: true
                    };
                }
                return null;
            })
        );
    }
}