import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserInfo } from '../interfaces/userInfo';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Its OK in service file for attributes to get Initialized
  userInfo: UserInfo = this.getUserInfo();
  constructor(private router: Router) {}
  login(role: string) {
    this.userInfo.role = role;
    this.userInfo.name = 'John Doe';
    localStorage.setItem('userInfo', JSON.stringify(this.userInfo));
    if (this.userInfo.role === 'student') {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/admin']);
    }
  }
  getUserInfo(): UserInfo {
    let storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    return { role: '', name: '' };
  }

  logout() {
    localStorage.removeItem('userInfo');
    this.router.navigate(['/home']);
  }
}
