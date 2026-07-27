import { inject, Injectable } from '@angular/core';
import { EncryptionService } from './encryption.service';

const USER_TOKEN = 'USER_TOKEN';
const USER_ID = 'USER_ID';
const USER_EMAIL = 'USER_EMAIL';
const USER_NAME = 'USER_NAME';
const ROLE = 'ROLE';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private encryptionService = inject(EncryptionService);

  getToken(): string | undefined {
    return this.getStoredData(USER_TOKEN);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  saveUserData(id: string, email: string, role: string, token: string): void {
    this.storeData(USER_ID, id);
    this.storeData(USER_EMAIL, email);
    this.storeData(ROLE, role);
    this.storeData(USER_TOKEN, token);
  }

  removeUserData(): void {
    const keys = [USER_ID, USER_NAME, USER_EMAIL, USER_TOKEN, ROLE];
    keys.forEach((key) => {
      const encryptedKey = this.encryptionService.encryptData(key);
      localStorage.removeItem(encryptedKey);
    });
  }

  getUserEmail(): string | undefined {
    return this.getStoredData(USER_EMAIL);
  }

  storeData(key: string, value: string): void {
    const encryptedKey = this.encryptionService.encryptData(key);
    const encryptedValue = this.encryptionService.encryptData(value);
    localStorage.setItem(encryptedKey, encryptedValue);
  }

  getStoredData(key: string): string | undefined {
    const encryptedKey = this.encryptionService.encryptData(key);
    const storedValue = localStorage.getItem(encryptedKey);
    if (!storedValue) return undefined;
    return this.encryptionService.decryptData(storedValue);
  }
}
