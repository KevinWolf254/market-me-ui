import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../providers/services/user.service';
import { UserReport } from '../../../models/models.model';
import { NgbModal, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReportService } from '../../../providers/services/report.service';
import { SubscriberService } from '../../../providers/services/subscriber.service';
import { Chart } from 'chart.js';
import { ServiceProviderReport } from '../../../models/interfaces.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public profile: UserReport = new UserReport();

  public purchasesForm: FormGroup;
  public deliveryForm: FormGroup;

  public purchaseReportParamsIsValid: boolean;
  public deliveryReportParamsIsValid: boolean;

  public expendituresAreLoading: boolean = true;
  public subscribersPieChart: Chart;

  constructor(private fb: FormBuilder, private userService: UserService, private modalService: NgbModal,
    private reportService: ReportService, private subscriberService: SubscriberService) { }

  ngOnInit() {
    this.userService.profileObserver.subscribe(profile => this.profile = profile);

    this.purchasesForm = this.fb.group({
      'from': ['', Validators.required],
      'to': ['', Validators.required],
    });
    this.deliveryForm = this.fb.group({
      'from': ['', Validators.required],
      'to': ['', Validators.required],
    });
    this.subscribers;
  }
  public get units() {
    return this.profile.client.creditAmount;
  }
  public get currency() {
    return this.profile.client.country.currency.toLowerCase();
  }
  public openPurchase(modal) {
    this.modalService.open(modal, { size: 'lg' });
  }
  public sendRequestForPurchasesReport(form) {
    let from: NgbDate = new NgbDate(form.from.year, form.from.month, form.from.day);
    let to: NgbDate = new NgbDate(form.to.year, form.to.month, form.to.day);
    if (from.after(to)) {
      this.purchaseReportParamsIsValid = false;
    } else {
      this.reportService.requestPurchasesReport(this.profile.user.email, from, to).subscribe();
    }
  }
  public openDelivery(modal) {
    this.modalService.open(modal, { size: 'lg' });
  }
  public sendRequestForDeliveryReport(form) {
    let from: NgbDate = new NgbDate(form.from.year, form.from.month, form.from.day);
    let to: NgbDate = new NgbDate(form.to.year, form.to.month, form.to.day);
    if (from.after(to)) {
      this.deliveryReportParamsIsValid = false;
    } else {
      this.reportService.requestDeliveryReport(this.profile.user.email, from, to).subscribe();
    }
  }

  public get subscribers() {
    if (!this.expendituresAreLoading)
      this.expendituresAreLoading = true;

    return this.subscriberService.subscribers.subscribe(
      (contacts: ServiceProviderReport[]) => {
        this.expendituresAreLoading = false;
        this.setPieChart(contacts);
      }
    );
  }

  public setPieChart(reports: ServiceProviderReport[]) {
    let pieChartData = [];
    let pieChartLabel = [];
    let i: number = 0;
    reports.forEach((report: ServiceProviderReport) => {
      pieChartData[i] = report.subscribers;
      pieChartLabel[i] = report.provider.name;
      i++;
    });
    this.subscribersPieChart = new Chart('ctx', {
      type: 'pie',
      data: {
        datasets: [{
          data: pieChartData,
          backgroundColor: [
            '#3cba9f',
            '#148970',
            '#348bca',
            '#175d91',
            '#b8d759',
            '#749219',
            '#d6bc44',
            '#a48b16',
            '#9334bf',
          ],
          label: 'Dataset 1'
        }],
        labels: pieChartLabel
      },
      options: {
        responsive: true,
        title: {
          display: true,
          text: 'Service Providers'
        },
        legend: {
          display: true,
          labels: {
            fontColor: 'rgb(255, 99, 132)'
          }
        }
      }
    });
  }
}
