import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

const API_MANUAL_UPDATE_URL = `${environment.apiUrl}/stats/admin/manual-update`;

@Injectable({
    providedIn: 'root',
})

export class ManualUpdateService {
    constructor(private http: HttpClient) {}

    updateManualStats(updateData: any): Observable<any> {
        const { company , reportType, startDate, endDate } = updateData;
        var data = {
            "company": company,
            "reportType": reportType,
            'startDate': startDate,
            'endDate': endDate
        }
        return this.http.put<any>(API_MANUAL_UPDATE_URL + '/stat-update', data);
      }
    updateManualSplit(updateData: any): Observable<any> {
        const { company , tag, startDate, endDate } = updateData;
        var data = {
            "company": company,
            "tag": tag,
            'startDate': startDate,
            'endDate': endDate
        }
        return this.http.put<any>(API_MANUAL_UPDATE_URL + '/split-update', data);
      }
}