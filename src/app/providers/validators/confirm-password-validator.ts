import { AbstractControl } from "@angular/forms";

export function confirmPasswordValidator(control: AbstractControl){

    if(control && (control.value != null || control.value != undefined)){
        const confirmPass = control.value;
        const passControl = control.root.get('newPass');

        if(passControl){
            const pass = passControl.value;
            if(pass != confirmPass){
                return{
                    notMatch: true
                };
            }
        }

        return null;
    }
}