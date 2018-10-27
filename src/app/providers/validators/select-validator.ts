import { AbstractControl } from "@angular/forms";

export function selectValidator(control: AbstractControl){

    if(control && (control.value != null || control.value != undefined)){
        const role = control.value;

        if(role == 0){
            return{
                defaultValue: true
            };
        }       

        return null;
    }
}

export function countryValidator(control: AbstractControl){

    if(control && (control.value != null || control.value != undefined)){
        const role = control.value;

        if(role == 4){
            return{
                defaultValue: true
            };
        }       

        return null;
    }
}