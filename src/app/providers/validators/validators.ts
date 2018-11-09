import { AbstractControl, ValidationErrors, AsyncValidatorFn } from "@angular/forms";
import { Observable } from "rxjs";
import { CampaignService } from '../services/campaign.service';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';

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
export function passwordValidator(control: AbstractControl) {
    if (control && (control.value != null || control.value != undefined)) {
        let password = control.value;
        let strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
        // let hasNumber = /\d/.test(control.value);
        // let hasUpper = /[A-Z]/.test(control.value);
        // let hasLower = /[a-z]/.test(control.value);
        // let hasSpecial = /[$@$!%*?&]/.test(control.value);
        // let hasMin = /[?=.{7,}]/.test(control.value);
        let isStrong = strongRegex.test(password);
        if (!isStrong) {
            return {
                isNotStrong: true
            };
        }
        return null;
    }
}
export function confirmPasswordValidator(control: AbstractControl) {
    if (control && (control.value != null || control.value != undefined)) {
        const confirmPass = control.value;
        const passControl = control.root.get('password');
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
        return campaignService.nameExists(control.value).pipe(
            map(exists => {
                if (exists)
                    return { exists: true };
                return null;
            })
        )
    }
}