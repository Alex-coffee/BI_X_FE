import { Injectable } from '@angular/core';
import {Camera, CameraPhoto, CameraResultType, CameraSource} from '@capacitor/camera';
import { ImageResizer, ImageResizerOptions } from '@ionic-native/image-resizer/ngx';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {


  constructor(private imageResizer: ImageResizer) { }

  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  public async resizeImage(imgUri, maxWidth) {
    const options = {
      uri: imgUri,
      folderName: 'temp',
      quality: 90,
      width: 512
    } as ImageResizerOptions;

    return this.imageResizer.resize(options);
  }

  public async takePhoto() {
    // Take a photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });
    return this.readAsBase64(capturedPhoto);
  }

  private async readAsBase64(cameraPhoto: CameraPhoto) {
    // Fetch the photo, read as a blob, then convert to base64 format
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const response = await fetch(cameraPhoto.webPath!);
    const blob = await response.blob();

    return await this.convertBlobToBase64(blob) as string;
  }
}
