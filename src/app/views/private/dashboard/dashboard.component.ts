import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../providers/services/user.service';
import { UserReport } from '../../../models/models.model';
import { NgbModal, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReportService } from '../../../providers/services/report.service';
import { SubscriberService } from '../../../providers/services/subscriber.service';
import { Chart } from 'chart.js';
import { ServiceProviderReport, Campaign } from '../../../models/interfaces.model';
import { CampaignService } from '../../../providers/services/campaign.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

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
  subsReport: ServiceProviderReport[] = [];
  totalActiveCampaigns: number = 0;

  constructor(private fb: FormBuilder, private userService: UserService, private modalService: NgbModal,
    private reportService: ReportService, private subscriberService: SubscriberService, private campaignService: CampaignService) { }

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
    this.getSubscribers();
    this.getActiveCampaigns();
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
  public getSubscribers() {
    if (!this.expendituresAreLoading)
      this.expendituresAreLoading = true;

    this.subscriberService.subscribers.subscribe(
      (subsReport: ServiceProviderReport[]) => {
        this.expendituresAreLoading = false;
        this.subsReport = subsReport;
        this.pieChart = subsReport;
      }
    );
  }

  public get totalSubscribers(): number{
    let total: number = 0;
    this.subsReport.forEach(report =>{
      total = report.subscribers + total
    })
    return total;
  }

  public getActiveCampaigns(){
    this.campaignService.getCampaigns().pipe(
      map((campaigns: Campaign[]) => campaigns.length)
    ).subscribe(total => this.totalActiveCampaigns = total);
  }
  public set pieChart(reports: ServiceProviderReport[]) {
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
