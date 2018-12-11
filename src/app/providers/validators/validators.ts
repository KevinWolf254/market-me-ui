import { AbstractControl, ValidationErrors, AsyncValidatorFn } from "@angular/forms";
import { Observable, timer } from "rxjs";
import { CampaignService } from '../services/campaign.service';
import { map, switchMap } from 'rxjs/operators';
import { SenderIdService } from "../services/sender-id.service";

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
        // let strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
        let strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");

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
export function senderIdNameValidator(senderIdService: SenderIdService): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors> | Observable<ValidationErrors> | null => {
        return timer(1500).pipe(switchMap(() => {
            return senderIdService.exists(control.value).pipe(
                map(exists => {
                    if (exists)
                        return { exists: true };
                    return null;
                })
            )
        }))
    }
}
export function campaignNameValidator(campaignService: CampaignService): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors> | Observable<ValidationErrors> | null => {
        return timer(1500).pipe(switchMap(() => {
            return campaignService.nameExists(control.value).pipe(
                map(exists => {
                    if (exists)
                        return { exists: true };
                    return null;
                })
            )
        }))
    }
}
export function countryCodeValidator(control: AbstractControl) {
    if (control && (control.value != null || control.value != undefined)) {
        let code = control.value;
        const codePattern = new RegExp('^[+][2][0-9]{2}$');

        let isMatch = codePattern.test(code);
        if (!isMatch) {
            return {
                notMatch: true
            };
        }
        return null;
    }
}
export function phoneNoValidator(control: AbstractControl) {
    if (control && (control.value != null || control.value != undefined)) {
        let phoneNo = control.value;
        const phoneNoPattern = new RegExp('^[7][0-9]{8}$');

        let isMatch = phoneNoPattern.test(phoneNo);
        if (!isMatch) {
            return {
                notMatch: true
            };
        }
        return null;
    }
}