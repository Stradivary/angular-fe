import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { mockApiInterceptor } from '../@core/helpers/mock-api.interceptor';
import { authInterceptor } from '../@core/helpers/auth.interceptor';
import { coreProviders } from '../data/core.module';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([mockApiInterceptor, authInterceptor])),
    provideAnimationsAsync(),
    ...coreProviders
  ]
};
