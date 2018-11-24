export class Enums {
}
export enum Command{
  START = 'START', DELETE = 'DELETE'
}
export enum Days{
  SUNDAY = 'SUNDAY', MONDAY = 'MONDAY', TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY', THURSDAY = 'THURSDAY', FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY'
}
export enum PaymentType{
  MPESAC2B = 'MPESAC2B', PAYPAL = 'PAYPAL'
}
export enum ProductType{
  SMS, SENDER_ID, SHORT_CODE
}
export enum Role {
  ADMIN = "ADMIN", USER = "USER"
}
export enum ScheduleType{
  DATE = 'DATE', DAILY = 'DAILY', WEEKLY = 'WEEKLY', MONTHLY = 'MONTHLY', 
  NONE = 'NONE'
}
export enum ScheduleStatus {
  SCHEDULED ='SCHEDULED', RUNNING ='RUNNING', PAUSED ='PAUSED', 
  COMPLETE ='COMPLETE', BLOCKED ='BLOCKED', ERROR ='ERROR', 
  NONE ='NONE'
}
export enum SenderIdProduct{
  SENDER_ID_RW = 'SENDER_ID_RW', SENDER_ID_KE = 'SENDER_ID_KE', 
  SENDER_ID_TZ = 'SENDER_ID_TZ', SENDER_ID_UG = 'SENDER_ID_UG'
}
export enum UnitsProduct{
  SMS_RW ='SMS_RW', SMS_KE ='SMS_KE', 
  SMS_TZ ='SMS_TZ', SMS_UG ='SMS_UG'
}