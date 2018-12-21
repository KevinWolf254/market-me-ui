import { Role, ScheduleType, Days, Command, PaymentType, ProductType, SenderIdProduct } from "./enums.model";
import { Disbursement, User, Organization, Credentials, Country_ } from "./interfaces.model";

export class Models {
}
export class CampaignRequest {
    campaignName: string;
    command: Command;
    constructor(campaignName: string, command: Command) {
        this.campaignName = campaignName;
        this.command = command;
    }
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
export class Payment {
    productName: string;
    productType: ProductType;
    paymentType: PaymentType;
    email: string;
    currency: string;
    amount: number;
    mpesaNo: string;
    senderId: string;

    constructor(productName: string, productType: ProductType, 
        paymentType: PaymentType, email: string, currency: string, 
        amount: number, mpesaNo: string, senderId: string) {
        this.productName = productName;
        this.productType = productType;
        this.paymentType = paymentType;
        this.email = email;
        this.currency = currency;
        this.amount = amount;
        this.mpesaNo = mpesaNo;
        this.senderId = senderId;
    }
}
export class Report {
    code: number;
    title: string;
    message: string;
    constructor(code?: number, title?: string, message?: string){
        this.code = code;
        this.title = title;
        this.message = message;
    }
}
export class CampaignReport extends Report {
    schedule: Schedule;
    groups: Group[];
    charges: ChargesReport;
}
export class ChargesReport extends Report {
    currency: Country_;
    estimatedCost: number;
    totalContacts: number;
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
    private name: string;
    private senderId: string;
    private createdBy: string;
    private type: ScheduleType;
    private date: Date;
    private dayOfWeek: Days;
    private dayOfMonth: number;

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
            return this.weeklyCronExpression
        if (this.type == ScheduleType.MONTHLY)
            return this.monthlyCronExpression;
    }
    private get dateCronExpression(): string {
        return '';
    }
    private get dailyCronExpression(): string {
        return "0 " + this.date.getMinutes() + " " + this.date.getHours() + " ? * 1/1 *";
    }
    private get weeklyCronExpression(): string {
        return "0 " + this.date.getMinutes() + " " + this.date.getHours() + " ? * " + this.day + " *";
    }
    private get monthlyCronExpression(): string {
        return "0 " + this.date.getMinutes() + " " + this.date.getHours() + " " + this.dayOfMonth + " * ?";
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
    countries: Country_[];
}
export class SenderIdRequest{
    product: SenderIdProduct;
    type: string;
    email: string;
    senderId: string;
    country: string;
    transNo: string;
    currency: string;
    amount: number;
    constructor(product: SenderIdProduct, type: string, email: string, senderId?: string, country?: string, transNo?: string, currency?: string, amount?: number){
        this.product = product;
        this.type = type;
        this.email = email;
        this.senderId = senderId;
        this.country = country;
        this.transNo = transNo;
        this.currency = currency;
        this.amount = amount;
    }
}
// export class SenderIdResponse extends Report{ 
//     id: number;
//     paid: boolean;
//     name: string;
// }
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
export class Subscriber_ {
    code: string;
    number: string;
    constructor(code: string, number: string) {
        this.code = code;
        this.number = number;
    }
}
export class UserReport extends Report {
    user: User;
    credentials: Credentials;
    roles: UserRole[];
    client: Organization;
    disbursement: Disbursement;
}
export class UserRole {
    id: number;
    role: Role;
}
