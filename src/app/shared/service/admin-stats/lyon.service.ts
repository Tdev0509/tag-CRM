import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ChartDataInterface } from '../../models/chartData.interface';

const API_LYON_URL = `${environment.apiUrl}/stats/admin/lyon`;

@Injectable({
  providedIn: 'root',
})
export class LyonService {
  constructor(private http: HttpClient) {}

  testingRoute() {
    console.log('being tested');
    console.log(API_LYON_URL);
    return this.http.get<any>('http://localhost:3000/stats/admin/lyon/asd');
  }

  // getAllLyonStats(company, startDate, endDate): Observable<any> {
  //   return this.http.get<any>(API_LYON_URL + '/all', {
  //     params: { company: company, startDate: startDate, endDate: endDate },
  //   });
  // }

  getAllStats(startDate, endDate): Observable<any> {
    return this.http.get<any>(API_LYON_URL + '/all', {
      params: { startDate: startDate, endDate: endDate },
    });
  }

  getAllDashboardStats(): Observable<any> {
    return this.http.get<any>(API_LYON_URL + '/all-stat');
  }

  updateAllLyonStats(company, startDate, endDate): Observable<any> {
    let params = new HttpParams()
      .set('company', company)
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.put<any>(API_LYON_URL + '/', { params });
  }

  getSummaryMetrics(company) {
    return this.http.get<any>(API_LYON_URL + '/summary_metrics', {
      params: { company: company },
    });
  }

  getChartMetrics(company, startDate, endDate): Observable<ChartDataInterface> {
    return this.http.get<any>(API_LYON_URL + '/chart_metrics', {
      params: { company: company, startDate: startDate, endDate: endDate },
    });
  }
}
