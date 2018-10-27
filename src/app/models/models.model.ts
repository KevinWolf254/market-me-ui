import { Role } from "./enums.model";

export class Models {
}
export class Token {
    access_token: string;
    token_type: string;
    expires_in: number;
    scope: string;
}
export class Country{
    name: string;
    topLevelDomain: any[];
    alpha2Code: string;
    alpha3Code: string;
    callingCodes: any[];
    capital: string;
    altSpellings: any[];
    region: string;
    subregion: string;
    population: any;
    latlng: any[];
    demonym: string;
    area: any;
    gini: any;
    timezones: any[];
    borders: any[];
    nativeName: string;
    numericCode: string;
    currencies: any[];
    languages: any[];
    translations:any;
    flag: string;
    regionalBlocs: any[];
    cioc: string;
}
export class Country_{
    id: number;
	name: string;
	code: string;
	currency: string;
}
export class Report{
    code: string;
    title: string;
    message: string;
}
export class Organization{
    id: number;
    name: string;
    creditAmount: number;
    enables: boolean;
    createdOn: Date;
    country: Country_;
}
export class User{
    id: number;
    surname: string;
    otherNames: string;
    email: string;
}
export class Credentials{
    id: number;
    enabled: boolean;
    signIn: Date;
}
export class UserRole{
    id: number;
    role: Role;
}
export class UserReport extends Report{
    user: User;
    credentials: Credentials;
    roles: UserRole[];
    client: Organization;
    disbursement: Disbursement;
}
export class Disbursement{
    total: number;
    list:any[];
}
export class ReportDates{
    orgName: string;
    from: Date;
    to: Date;
    constructor(orgName: string, from: Date, to: Date){
        this.orgName = orgName;
        this.from = from;
        this.to = to;
    }
}
export class ServiceProvider{
    id: number;
    name: string;
    country: Country;
}
export class ServiceProviderReport{
    name: ServiceProvider;
    totalSubscribers: number;
}
