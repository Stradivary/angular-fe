# Angular FE Starter

Code base modern untuk membangun aplikasi frontend dengan Angular 22. Dilengkapi Clean Architecture, Atomic Design pattern, dan konfigurasi siap pakai untuk mempercepat development project baru.

## Tech Stack

- **Angular 22** — Standalone components, signal-based APIs, zoneless change detection
- **Angular Material** — UI component library (Material Design 3)
- **TailwindCSS 4** — Utility-first CSS (layout & spacing)
- **Vitest** — Unit testing framework
- **fast-check** — Property-based testing
- **CryptoJS** — AES encryption untuk token storage
- **RxJS** — Reactive programming

## Arsitektur

Project mengikuti **Clean Architecture** dengan pemisahan layer yang ketat:

```
src/
├── @core/                  # Domain layer (innermost)
│   ├── base/               # UseCase<S,T>, Mapper<I,O> interfaces
│   ├── domain/             # Entity interfaces
│   ├── repository/         # Abstract repository contracts
│   ├── usecase/            # Business logic (grouped by feature)
│   │   ├── auth/           # login-email, logout
│   │   └── todo/           # create, get, update, delete
│   └── helpers/            # TokenService, EncryptionService, AuthGuard, AuthInterceptor
├── data/                   # Data layer (middle)
│   ├── api-adapter/        # RestApiService, HttpResponseEntity
│   ├── repository/         # Adapter implementations (LoginAdapter, TodoAdapter)
│   └── core.module.ts      # DI provider registration
├── app/                    # Presentation layer (outermost)
│   ├── common-ui/          # Atomic Design components
│   │   ├── molecules/      # TodoItem, TodoForm
│   │   ├── organisms/      # Sidebar, TopHeader, ModalConfirm
│   │   └── templates/      # AdminLayout
│   ├── home/               # Public home page
│   ├── login/              # Login page
│   ├── dashboard/          # Admin dashboard (lazy-loaded)
│   │   ├── layout/         # Dashboard layout shell
│   │   ├── welcome/        # Welcome page
│   │   └── todolist/       # Todolist page
│   └── not-found/          # 404 page
└── environments/           # Environment config
```

### Layer Dependency Rule

```
@core ← data ← app
```

- `@core` tidak import dari `data` atau `app`
- `data` import dari `@core` (implements abstract repository)
- `app` import dari `@core` (inject use cases) dan `data` (DI registration)

## Quick Start

### Prerequisites

- Node.js v24+
- npm v11+

### Install

```bash
cd angular-fe
npm install
```

### Development Server

```bash
ng serve
```

Buka [http://localhost:4200](http://localhost:4200)

### Build

```bash
ng build
```

Output di `dist/angular-fe/`

### Test

```bash
npx vitest run
```

## Dummy Login

Aplikasi dilengkapi mock API interceptor untuk development tanpa backend:

| Field | Value |
|-------|-------|
| Email | `admin-fe@yopmail.com` |
| Password | `admin-fe@Password123!` |

Mock interceptor mensimulasikan endpoint:
- `POST /auth/email` — Login
- `GET /auth/logout` — Logout
- `GET /todos` — Get todos
- `POST /todos` — Create todo
- `PUT /todos/:id` — Update todo
- `DELETE /todos/:id` — Delete todo

> Hapus `mockApiInterceptor` dari `app.config.ts` ketika backend sudah siap.

## Konvensi Kode

| Aspek | Konvensi |
|-------|----------|
| Components | Standalone, signal-based (`input()`, `output()`, `signal()`) |
| DI | `inject()` function (bukan constructor injection) |
| Template | `@if`, `@for`, `@switch` (bukan `*ngIf`, `*ngFor`) |
| Guards | Functional `CanActivateFn` |
| Interceptors | Functional `HttpInterceptorFn` |
| Styling | SCSS external file + TailwindCSS utilities di template |
| File structure | `component.ts` + `component.html` + `component.scss` |

## Folder Structure — Atomic Design

| Level | Deskripsi | Contoh |
|-------|-----------|--------|
| Atoms | Disediakan oleh Angular Material | `mat-button`, `matInput`, `mat-icon` |
| Molecules | Gabungan atoms untuk satu fungsi | `TodoItemMolecule`, `TodoFormMolecule` |
| Organisms | Section mandiri yang reusable | `SidebarOrganism`, `TopHeaderOrganism` |
| Templates | Layout shell dengan slot content | `AdminLayoutTemplate` |

## Scripts

| Command | Deskripsi |
|---------|-----------|
| `npm start` | Development server (port 4200) |
| `npm run build` | Production build |
| `npm run lint` | ESLint check |
| `npm test` | Run tests via Angular CLI |
| `npx vitest run` | Run unit tests via Vitest |

## Environment Variables

Lihat `.env.example` untuk daftar lengkap:

```
API_URL=http://localhost:3000/api
ENCRYPTION_KEY=your-16-or-32-byte-key
GOOGLE_CLIENT_ID=your-google-client-id
RECAPTCHA_SITE_KEY=your-recaptcha-site-key
GTM_ID=your-gtm-id
```

## License

Private — Internal use only.
