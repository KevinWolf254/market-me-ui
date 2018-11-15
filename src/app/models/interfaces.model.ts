import { ScheduleType, ScheduleStatus, Days } from "./enums.model";
import { } from "./models.model";

export interface Interfaces {
}
export interface Campaign{
    name: string;
    type: ScheduleType;
    schedule: Date;
    nextFire: Date;
    lasFired: Date;
    status: ScheduleStatus
}
export interface Country {
    name: string;
    topLevelDomain: any[];
    alpha2Code: string;
    alpha3Code: string;
    callingCodes: string[];
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
    translations: any;
    flag: string;
    regionalBlocs: any[];
    cioc: string;
}
export interface Country_ {
    id: number;
    name: string;
    code: string;
    currency: string;
}
export interface Credentials {
    id: number;
    enabled: boolean;
    signIn: Date;
}
export interface Disbursement {
    total: number;
    list: any[];
}
export interface Organization {
    id: number;
    name: string;
    creditAmount: number;
    enables: boolean;
    createdOn: Date;
    country: Country_;
}
export interface Prefix{
    id: number;
    number: number;
}
export interface SenderId {
    id: number;
    name: string;
}
export interface ServiceProvider {
    id: number;
    name: string;
    country: Country_;
}
export interface ServiceProviderReport {
    name: ServiceProvider;
    totalSubscribers: number;
}
export interface SubscriberDetails{
    id: number;
    number: number;
    fullPhoneNo: string;
    serviceProvider: ServiceProvider;
    prefix: Prefix;
}
export interface Token {
    access_token: string;
    token_type: string;
    expires_in: number;
    scope: string;
}
export interface User {
    id: number;
    surname: string;
    otherNames: string;
    email: string;
}