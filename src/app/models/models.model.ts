import { Role, ScheduleType, Days } from "./enums.model";

export class Models {
}
export class Token {
    access_token: string;
    token_type: string;
    expires_in: number;
    scope: string;
}
export class Country {
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
    translations: any;
    flag: string;
    regionalBlocs: any[];
    cioc: string;
}
export class Country_ {
    id: number;
    name: string;
    code: string;
    currency: string;
}
export class Report {
    code: number;
    title: string;
    message: string;
}
export class Organization {
    id: number;
    name: string;
    creditAmount: number;
    enables: boolean;
    createdOn: Date;
    country: Country_;
}
export class User {
    id: number;
    surname: string;
    otherNames: string;
    email: string;
}
export class Credentials {
    id: number;
    enabled: boolean;
    signIn: Date;
}
export class UserRole {
    id: number;
    role: Role;
}
export class UserReport extends Report {
    user: User;
    credentials: Credentials;
    roles: UserRole[];
    client: Organization;
    disbursement: Disbursement;
}
export class Disbursement {
    total: number;
    list: any[];
}
export class ReportDates {
    orgName: string;
    from: Date;
    to: Date;
    constructor(orgName: string, from: Date, to: Date) {
        this.orgName = orgName;
        this.from = from;
        this.to = to;
    }
}
export class ServiceProvider {
    id: number;
    name: string;
    country: Country;
}
export class ServiceProviderReport {
    name: ServiceProvider;
    totalSubscribers: number;
}
export class Group {
    id: number;
    name: string;

    constructor(id?: number, name?: string) {
        this.id = id;
        this.name = name;
    }
}
export class GroupedContactsRequest {
    groupIds: number[];

    constructor(groupIds: number[]) {
        this.groupIds = groupIds;
    }
}
export class ChargesReport extends Report {
    currency: Country_;
    estimatedCost: number;
    totalContacts: number;
}
export class Sms {
    email: string;
    senderId: string;
    message: string;
    schedule: Schedule;
    groupIds: number[];
    constructor(email?: string, senderId?: string, message?: string, schedule?: Schedule, groupIds?: number[]) {
        this.email = email;
        this.senderId = senderId;
        this.message = message;
        this.schedule = schedule;
        this.groupIds = groupIds;
    }
}
export class Schedule {
    name: string;
    senderId: string;
    createdBy: string;
    type: ScheduleType;
    date: Date;
    dayOfWeek: Days;
    dayOfMonth: number;
    cronExpression: string;

    constructor(name?: string, senderId?: string, createdBy?: string, type?: ScheduleType, date?: Date, dayOfWeek?: Days,
        dayOfMonth?: number, cronExpression?: string) {
        this.name = name;
        this.senderId = senderId;
        this.createdBy = createdBy;
        this.type = type;
        this.date = date;
        this.dayOfWeek = dayOfWeek;
        this.dayOfMonth = dayOfMonth;
        this.cronExpression = cronExpression;
    }
}
export class ScheduleBuilder {
    name: string;
    senderId: string;
    createdBy: string;
    type: ScheduleType;
    date: Date;
    dayOfWeek: Days;
    dayOfMonth: number;

    setName(name: string): ScheduleBuilder {
        this.name = name;
        return this;
    }
    setSenderId(senderId: string): ScheduleBuilder {
        this.senderId = senderId;
        return this;
    }
    setCreatedBy(createdBy: string): ScheduleBuilder {
        this.createdBy = createdBy;
        return this;
    }
    setType(type: ScheduleType): ScheduleBuilder {
        this.type = type;
        return this;
    }
    setDate(date: Date): ScheduleBuilder {
        this.date = date;
        return this;
    }
    setDayOfWeek(dayOfWeek: Days): ScheduleBuilder {
        this.dayOfWeek = dayOfWeek;
        return this;
    }
    setDayOfMonth(dayOfMonth: number): ScheduleBuilder {
        this.dayOfMonth = dayOfMonth;
        return this;
    }
    private get cronExpression(): string {
        if (this.type == ScheduleType.DATE)
            return this.dateCronExpression
        if (this.type == ScheduleType.DAILY)
            return this.dailyCronExpression
        if (this.type == ScheduleType.WEEKLY)
            this.weeklyCronExpression
        if (this.type == ScheduleType.MONTHLY)
            return this.monthlyCronExpression;
    }
    private get dateCronExpression(): string {
        return '';
    }
    private get dailyCronExpression(): string {
        return "0 " + this.date.getMinutes + " " + this.date.getHours + " ? * *";
    }
    private get weeklyCronExpression(): string {
        return "0 " + this.date.getMinutes + " " + this.date.getHours + " ? * " + this.day + " *";
    }
    private get monthlyCronExpression(): string {
        return "0 " + this.date.getMinutes + " " + this.date.getHours + " " + this.dayOfMonth + " * ?";
    }
    private get day(): string {
        if (this.dayOfWeek == Days.SUNDAY)
            return "SUN";
        if (this.dayOfWeek == Days.MONDAY)
            return "MON";
        if (this.dayOfWeek == Days.TUESDAY)
            return "TUE";
        if (this.dayOfWeek == Days.WEDNESDAY)
            return "WED";
        if (this.dayOfWeek == Days.THURSDAY)
            return "THU";
        if (this.dayOfWeek == Days.FRIDAY)
            return "FRI";
        if (this.dayOfWeek == Days.SATURDAY)
            return "SAT";
    }
    build(): Schedule {
        return new Schedule(this.name, this.senderId, this.createdBy, this.type,
            this.date, this.dayOfWeek, this.dayOfMonth, this.cronExpression)
    }
}
export class SenderId {
    id: number;
    name: string;
}
