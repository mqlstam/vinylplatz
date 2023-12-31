import { Route } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { AlbumlistComponent } from './albumlist/albumlist.component';
import { AlbumdetailsComponent } from './albumdetails/albumdetails.component';
import { AlbumformComponent } from './albumform/albumform.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component'; // Import the RegisterComponent
import { AuthGuard } from './services/auth.guard'; // Import your AuthGuard
import { UserAlbumListComponent } from './user-album-list/user-album-list.component'; // Import your UserAlbumListComponent

export const appRoutes: Route[] = [
  { path: '', component: AlbumlistComponent, canActivate: [AuthGuard] },
  { path: 'about', component: AboutComponent, canActivate: [AuthGuard] },
  { path: 'list', component: AlbumlistComponent, canActivate: [AuthGuard] }, // Apply the AuthGuard to this route
  { path: 'add', component: AlbumformComponent, canActivate: [AuthGuard] }, // You might want to protect this route as well
  { path: 'album/:id', component: AlbumdetailsComponent, canActivate: [AuthGuard] },
  { path: 'edit/:id', component: AlbumformComponent, canActivate: [AuthGuard] }, // Apply the AuthGuard to edit route
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }, // Add the register route
  { path: 'user-albums', component: UserAlbumListComponent, canActivate: [AuthGuard] }, // Apply the AuthGuard to this route
  { path: '**', redirectTo: '' },
];
