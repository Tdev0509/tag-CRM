import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ChartDataInterface } from '../../models/chartData.interface';

const API_RUBI_URL = `${environment.apiUrl}/stats/admin/rubi`;

@Injectable({
    providedIn: 'root',
})

export class RubiService {
    constructor(private http: HttpClient) {}

    testingRoute() {
        console.log('being tested');
        console.log(API_RUBI_URL);
        return this.http.get<any>(`${environment.apiUrl}/stats/admin/rubi/test`);
    }

    getChartMetrics(company, startDate, endDate): Observable<ChartDataInterface> {
        return this.http.get<any>(API_RUBI_URL + '/chart_metrics', {
          params: { company: company, startDate: startDate, endDate: endDate },
        });
    }
    getAllRubiStats(company, startDate, endDate): Observable<any> {
        return this.http.get<any>(API_RUBI_URL + '/', {
          params: { company: company, startDate: startDate, endDate: endDate },
        });
    }

    getSummaryMetrics(company) {
        return this.http.get<any>(API_RUBI_URL + '/summary_metrics', {
          params: { company: company },
        });
    }
    updateAllPerionStats(company, startDate, endDate): Observable<any> {
        var data = {
          "company": company,
          'startDate': startDate,
          'endDate': endDate
        }
        return this.http.put<any>(API_RUBI_URL + '/', data);
    }
    getAllDashboardStats(): Observable<any> {
      return this.http.get<any>(API_RUBI_URL + '/all-stat');
    }
}