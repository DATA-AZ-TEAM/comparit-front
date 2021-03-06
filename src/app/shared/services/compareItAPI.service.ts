import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Configuration} from '../models/configuration';
import {User} from '../models/user';
import {environment} from '../../../environments/environment';
import {Model} from '../models/model';
import {Review} from '../models/review';
import {SavedFilter} from '../models/savedFilter';

@Injectable({
  providedIn: 'root',
})


export class CompareItAPIService {

  private DOMAIN = environment.settings.apiUrl;

  private alertController = '/alert';
  private companyController = '/company';
  private filterController = '/filter';
  private jwtAuthenticationController = '/authenticate';
  private modelController = '/model';
  private modelPropertyController = '/modelproperty';
  private userController = '/user';
  private websiteconfigController = '/websiteconfig';
  private reviewController = '/review';

  /*products uploading*/
  private byUrlController = '/company/byUrl';
  private byCsvUploadController = '/company/byCsvUpload';

  private HEADERS;

  constructor(private http: HttpClient) {
  }

  /**
   * Returns the complete URL based on the domain, the endpoint and the parameters list.
   * @param endPoint the endpoint to call
   * @param params the parameters to add to the url
   */
  private getBuiltUrl(endPoint: string, params: { key: any, value: any }[]): any {
    // add each param to paramString, and '&' between params (not after the last one)
    const paramString = '?' + params.map((kv) => kv.key + '=' + kv.value).join('&');
    // build complete URL with domain, controller and '?' + params if present
    return this.DOMAIN + endPoint + (params.length !== 0 ? paramString : '') + '';
  }

  getUploadUrl(typeProduit: string): string {
    return this.DOMAIN + this.byUrlController + '/' + typeProduit;
  }

  getUploadCsv(model: Model): string {
    return this.DOMAIN + this.byCsvUploadController + '/' + model.name;
  }

  private get(endPoint: string, params: { key: any, value: any }[]): any {
    return this.http.get(this.getBuiltUrl(endPoint, params)).toPromise();
  }

  private put(endPoint: string, params: { key: any, value: any }[], body: any): any {
    return this.http.put(this.getBuiltUrl(endPoint, params), body).toPromise();
  }

  private post(endPoint: string, params: { key: any, value: any }[], body: any): any {
    return this.http.post(this.getBuiltUrl(endPoint, params), body).toPromise();
  }

  private delete(endPoint: string, params: { key: any, value: any }[]): any {
    return this.http.delete(this.getBuiltUrl(endPoint, params)).toPromise();
  }


  // Authenticate
  public authenticate(username: string, password: string): any {
    return this.post(this.jwtAuthenticationController, [], {username, password});
  }

  // WebsiteConfig
  public putWebsiteconfig(configuration: Configuration): any {
    return this.put(this.websiteconfigController + '/saveWebsiteConfiguration', [], configuration);
  }

  public getWebsiteConfiguration(): any {
    return this.get(this.websiteconfigController + '/1', []);
  }

  // User
  public putRegisterUser(user: User): any {
    return this.put(this.userController + '/saveUser', [], user);
  }

  public putUpdateUser(user: User): any {
    return this.put(this.userController + '/updateUser', [], user);
  }

  public deleteUser(id: number): any {
    return this.delete(this.userController + '/' + id, []);
  }

  public getAllUsers(): any {
    return this.get(this.userController + '/', []);
  }

  public getCurrentUser(): any {
    return this.get(this.userController + '/currentUser', []);
  }

  public getUserById(idUser: number): any {
    return this.get(this.userController + '/' + idUser, []);
  }


  public getMockProduct(): any {
    return this.get('/product/search', []);
  }

  public getProducts(params: { key: string, value: string }[]): any {
    return this.get('/product/search', params);
  }

  public getProductById(id: string): any {
    return this.get('/product/' + id, []);
  }

  public getProductsByIds(ids: string): any {
    return this.get('/product/list/' + ids, []);
  }

  public getContactById(id: string): any {
    return this.get('/product/' + id, []);
  }
  // Filters & alerts

  public createFilter(filter: SavedFilter): any {
    return this.post(this.filterController, [], filter.toJSON());
  }

  public getUserFilters(): any {
    return this.get(this.filterController, []);
  }

  public deleteFilter(filter: SavedFilter): any {
    return this.delete(this.filterController + '/' + filter.id, []);
  }

  public getReviewById(id: number): any {
    return this.get(this.reviewController + '/' + id, []);
  }

  public getAllReviewByUserId(): any {
    return this.get(this.reviewController + '/getAllReviewsFromUser', []);
  }

  public getAllReview(): any {
    return this.get(this.reviewController + '/' , []);
  }

  public getAllReviewByProductId(id: string): any {
    return this.get(this.reviewController + '/getAllReviewsForAProduct?productId=' + id , []);
  }
  public putcreateReview(review: Review): any {
    return this.put(this.reviewController + '/saveReview' , [], review);
  }

  public putupdateReview(review: Review): any {
    return this.put(this.reviewController + '/updateReview' , [], review);
  }

  public getAvgByProductId(productId: string): any {
    return this.get(this.reviewController + '/avg/' + productId, []);
  }


}
