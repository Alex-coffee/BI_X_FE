import { Component } from '@angular/core';
import {PhotoService} from "../services/photo.service";
import {QRScanner, QRScannerStatus} from "@ionic-native/qr-scanner/ngx";
import {ApiService} from "../services/api.service";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  scanResult;
  errMessage;
  apiInfo;
  statusResult;
  fileName;
  fileUploadStatus;
  apiServer;

  constructor(
    private photoService: PhotoService,
    private qrScanner: QRScanner,
    private apiService: ApiService
  ) {}


  scanQRCode() {

    // installation of the cordova plugin is not success, skip the scanning part
    // use the mockup function to simulate QR process
    this.mockQRProcess();

    // this.qrScanner.prepare()
    //   .then((status: QRScannerStatus) => {
    //     if (status.authorized) {
    //       // start scanning
    //       const scanSub = this.qrScanner.scan().subscribe((text: string) => {
    //         // get text from QR code, process it
    //         this.scanResult = text;
    //         this.apiInfo = this.apiDataProcess(text);
    //         this.apiService.init(this.apiInfo['apiserver'], this.apiInfo['user'], this.apiInfo['password']);
    //         this.qrScanner.hide(); // hide camera preview
    //         scanSub.unsubscribe(); // stop scanning
    //       });
    //
    //     } else if (status.denied) {
    //       // camera permission was permanently denied
    //       // you must use QRScanner.openSettings() method to guide the user to the settings page
    //       // then they can grant the permission from there
    //     } else {
    //       // permission was denied, but not permanently. You can ask for permission again at a later time.
    //     }
    //   })
    //   .catch((e: any) => console.log('Error is', e));
  }

  mockQRProcess() {
    this.scanResult = 'apiserver:https://be-app-hiring-bixinf-test.apps.bi-x-ire.tftp.p1.openshiftapps.com/;user:admin;password:secret';
    this.apiInfo = this.apiDataProcess(this.scanResult);
    this.apiService.init(this.apiInfo['apiserver'], this.apiInfo['user'], this.apiInfo['password']);
  }

  apiDataProcess(apiInfo: string) {
    let result;
    if (apiInfo) {
      try {
        result = {};
        const keyValue = apiInfo.split(';');
        keyValue.forEach(kv => {
          // need to convert the : after https before making split process;
          const processedStr = kv.replace(/https:/gi, 'https__')
          const arr = processedStr.split(':');
          // change it back to https:
          result[arr[0]] = arr[1].replace(/https__/gi, 'https:');
        });
      } catch (e) {
        console.log(e);
        this.errMessage = 'QR Code process error, please check string value';
      }
    }
    return result;
  }


  async takePhoto() {
    const capturedPhoto = await this.photoService.takePhoto();
    // installation of the cordova plugin is not success, skip the resize step
    // resize the image, and make it's width to be 512 pixels
    // const resizeResult = await this.photoService.resizeImage(capturedPhoto, 512)

    try {
      const uploadResponse = await this.apiService.uploadImage(capturedPhoto).toPromise();
      this.fileName = uploadResponse['file'];
      this.fileUploadStatus = uploadResponse['status'];
    } catch (e) {
      console.log(e);
      this.errMessage = 'upload image error';
    }
  }

  getUploadedImageUrl() {
    return this.apiService.getImagePath(this.fileName);
  }

  checkServerStatus() {
    this.apiService.checkServerStatus().subscribe(res => {
      this.statusResult = res;
      this.apiServer = this.apiInfo['apiserver'];
    }, error => {
      this.statusResult = {'status': 'connection error'};
    });
  }
}
