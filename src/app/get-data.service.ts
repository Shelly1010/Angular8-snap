import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const localUrl = 'https://storage.googleapis.com/snap2insight-livedemo/assessment/test_analysis.json';

@Injectable({
  providedIn: 'root'
})

export class GetDataService {

  constructor(private httpClient: HttpClient) {
   }
   public getData() {
    return this.httpClient.get(localUrl);
  }
}
