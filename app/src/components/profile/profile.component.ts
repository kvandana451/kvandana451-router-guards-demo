import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { UserInfo } from '../../interfaces/userInfo';
import { Router } from '@angular/router';
@Component({
  selector: 'app-profile',
  imports: [FormsModule, NgIf],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  userInfo?: UserInfo;
  userName: string = '';
  constructor(private authService: AuthService, private router: Router) {}
  save() {
    if (this.userInfo && this.userName !== '') {
      this.userInfo.name = this.userName;
      localStorage.setItem('userInfo', JSON.stringify(this.userInfo));
    } else if (this.userName === '' && this.userInfo) {
      this.userName = this.userInfo.name;
    }
    this.router.navigate(['/dashboard']);
  }
  cancel() {
    if (this.userInfo) {
      this.userName = this.userInfo.name;
    }
  }
  ngOnInit() {
    this.userInfo = this.authService.getUserInfo();
    this.userName = this.authService.getUserInfo().name;
  }
}
