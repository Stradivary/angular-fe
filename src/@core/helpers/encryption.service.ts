import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EncryptionService {
  private encKey = environment.encryptionKey;

  encryptData(data: any): string {
    const key = CryptoJS.enc.Utf8.parse(this.encKey);
    return CryptoJS.AES.encrypt(JSON.stringify(data), key, { mode: CryptoJS.mode.ECB }).toString();
  }

  decryptData(data: string): any {
    if (!data) return undefined;
    try {
      const key = CryptoJS.enc.Utf8.parse(this.encKey);
      const bytes = CryptoJS.AES.decrypt(data, key, { mode: CryptoJS.mode.ECB });
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return decrypted ? JSON.parse(decrypted) : undefined;
    } catch {
      return undefined;
    }
  }
}
