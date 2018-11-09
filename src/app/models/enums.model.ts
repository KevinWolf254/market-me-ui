export class Enums {
}
export enum Role {
  ADMIN = "ADMIN", USER = "USER"
}
export enum Days{
  SUNDAY = 'SUNDAY', MONDAY = 'MONDAY', TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY', THURSDAY = 'THURSDAY', FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY'
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
export enum Command{
  START = 'START', DELETE = 'DELETE'
}