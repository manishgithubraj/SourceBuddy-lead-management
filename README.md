# SourceBuddy

SourceBuddy is a secure company and lead directory for aerospace and defence operations. It lets administrators maintain the company directory, create user accounts, and assign companies to individual users. Users can access and work only with the companies assigned to them.

The directory also includes CSV import/export tools and a guided outreach workflow that prepares manufacturer or distributor emails for Zoho Mail.

## What it does

- Secure first-time setup and sign-in
- Administrator and standard-user roles
- Server-enforced company access assignments
- Search, filters, sorting, pagination, and three visual themes
- Add, edit, view, export, and (for administrators) delete company records
- CSV import and export
- Duplicate and lead-completeness indicators
- Bulk email copying and selected-record export
- Configurable manufacturer/distributor outreach templates
- Email preparation, sent/not-sent tracking, and a Zoho Mail hand-off

## Roles and access

| Capability | Administrator | Standard user |
| --- | --- | --- |
| View directory | All companies | Assigned companies only |
| Add/edit companies | Yes | Only assigned companies; newly created records are assigned to that user |
| Delete companies | Yes | No |
| Import CSV | Yes | Available in the interface, but administrators should manage the shared directory |
| Export/copy records | Yes | Assigned records only |
| Create users/admins | Yes | No |
| Assign company access | Yes | No |

Each installation supports up to two administrator accounts. Administrators cannot be deleted through the dashboard.

## Using the application

### First-time setup

1. Start the application or deploy it to Netlify.
2. Open the site. If no administrator exists, SourceBuddy opens **First-Time Setup**.
3. Create the first administrator. You may create a second administrator at the same time, or add one later from the Admin Dashboard.
4. Sign in using the new credentials.

Usernames must be 3-50 characters and may contain letters, numbers, periods, underscores, and hyphens. Passwords must contain at least 8 characters.

### Administrator workflow

1. Sign in. You will arrive at the main **Directory**.
2. Use **Admin Dashboard** to create standard users and manage their access.
3. In **Manage Users & Company Access**, select a user, choose an assignee in the **Assign To** list, select companies, then choose **Save assignments**.
4. Use the dashboard filters to narrow companies by category, assignment state, or existing assignee.
5. Open **Directory** to manage the shared company data.

Deleting a standard user is permanent. Companies previously assigned to that user remain in the directory but no longer grant that user access.

### Working with the directory

The Directory header shows totals for all visible authorized records, manufacturers, distributors, and Source Buddy records.

Use the left-side filters to search by company, contact, or email and filter by:

- Manufacturer, Distributor, or Source Buddy status
- Vertical
- Presence of email, phone, website, or LinkedIn data
- Lead-data completeness
- Mailing status
- Duplicate company names

Select a row to open its detail panel. From there you can view or edit company/contact information, copy contact details, export the record, prepare an email, and, if you are an administrator, delete the record.

Use **Add Company** to create a record. The form validates email addresses, phone numbers, website URLs, LinkedIn URLs, and duplicate company names.

### CSV import and export

Use **Import CSV** to add records. Administrators can import into the shared directory; a standard user's imported records are saved only to that user's assigned records. The importer accepts common heading variants and maps them to these fields:

| Source heading | Directory field |
| --- | --- |
| `Company` or `Company Name` | Company Name |
| `Website` | Website |
| `POC`, `Contact Name`, or `Main Contact` | Primary Contact Name |
| `Designation` | Designation |
| `Email` | Email |
| `Phone`, `Phone.`, `Number`, or `Mobile` | Phone |
| `LinkedIn` | LinkedIn |
| `Manufacturer`, `Distributor`, `Source Buddy`, `Vertical` | Same-named fields |

The **Export** menu can download all authorized records, the current filtered view, or a `companies.js` data file. The bulk-action bar can export selected records or copy their email addresses.

### Outreach and Zoho Mail

1. Open **Mail Templates** and set the approved sender email used as an in-app check.
2. Edit and save the manufacturer and distributor subject/body templates as needed. Available placeholders are `{{greeting}}`, `{{contact_name}}`, `{{first_name}}`, `{{company_name}}`, `{{email}}`, and `{{vertical}}`.
3. For a record with an email address and exactly one of Manufacturer/Distributor set to `Yes`, choose **Prepare Mail**, or use **Start Mailing** for the current filtered ready-to-mail list.
4. Review the recipient, subject, and body. Select **Open in Zoho Mail** after signing into the approved Zoho account and completing the browser's one-time Zoho mail-handler setup.
5. After sending, select **Mark Sent & Next**. Use **Mark Not Sent** to undo that status.

The application prepares a `mailto:` hand-off and adds `suhaas.sastry@idamtat.in` as CC. Zoho controls the actual From address based on the signed-in account and its permitted aliases; SourceBuddy does not send email itself.

Mail templates, sender-check value, mail status, and theme preference are stored in the current browser's local storage. They are not shared with other users or browsers.

## Run locally

Prerequisite: Node.js 18 or newer is recommended.

```powershell
cd C:\path\to\leadsapp
npm.cmd install
npm.cmd run dev
```

Open [http://localhost:3000](http://localhost:3000). The local server stores users and company changes in `auth-data.json` in the `leadsapp` folder. This file contains password hashes and must not be committed or shared.

## Deploy to Netlify

Netlify deployment uses a serverless API and Netlify Blobs for persistent data.

1. Push the contents of `leadsapp` to a Git repository.
2. In Netlify, create a new project from that repository.
3. If the repository also contains parent folders, set the project base directory to `leadsapp`; otherwise leave it empty.
4. Add a `SESSION_SECRET` environment variable with a unique, random value of at least 32 characters.
5. Deploy and open the site to complete first-time setup.

Generate a suitable secret locally:

```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

For Netlify-backed local development, run:

```powershell
npm.cmd run dev:netlify
```

Link the folder to the appropriate Netlify project when prompted. Do not use a production site for test accounts or test data.

### Hosted data and reset

On first use, the hosted application initializes company data from `companies.js`. It then stores users, passwords, assignments, and company changes in the Netlify Blob store named `sourcebuddy`, under `app-data`.

To reset a test deployment, delete the `app-data` entry in the `sourcebuddy` Blob store from the Netlify Blobs UI. This removes all hosted users and company changes for that deployment.

## Architecture

| Area | Local development | Netlify deployment |
| --- | --- | --- |
| Front end | Static HTML, CSS, and JavaScript | Same static files |
| API | `server.js` | `netlify/functions/api.mjs` |
| Data store | `auth-data.json` | Netlify Blob store |
| Sessions | In-memory, 8-hour cookie session | Signed, secure 8-hour cookie session |
| Seed company data | `companies.js` | `companies.js` on first API request |

Key files:

- `index.html` and `app.js` - main directory and outreach workflow
- `admin.html` - user provisioning and assignment management
- `user.html` - compact assigned-company view
- `login-new.html` and `setup.html` - authentication and first-time setup
- `server.js` - secure local HTTP/API server
- `netlify/functions/api.mjs` - hosted API implementation
- `companies.js` - initial company data
- `netlify.toml` - Netlify build, function, and protected-file configuration

## API reference

All API paths are same-origin under `/api`. Except setup status, setup, and login, endpoints require the secure session cookie. Administrator-only endpoints return `403` for standard users.

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/setup-status` | Check whether an administrator must be created |
| `POST` | `/api/setup` | Create the initial one or two administrator accounts |
| `POST` | `/api/login` | Sign in and create a session |
| `POST` | `/api/logout` | End the current session |
| `GET` | `/api/me` | Get the signed-in user's public profile |
| `GET` | `/api/companies` | List authorized companies; supports assignment views |
| `PUT` | `/api/companies` | Save companies within the caller's permissions |
| `POST` | `/api/companies/assign` | Assign/unassign companies (administrator only) |
| `GET` | `/api/users` | List users (administrator only) |
| `POST` | `/api/users` | Create a standard user (administrator only) |
| `DELETE` | `/api/users/:id` | Delete a standard user (administrator only) |
| `PUT` | `/api/users/:id/password` | Reset a user password (administrator only) |
| `PUT` | `/api/users/:id/companies` | Replace a user's company assignments (administrator only) |
| `POST` | `/api/admins` | Create the second administrator (administrator only) |

## Security notes

- Passwords are stored as salted `scrypt` hashes, not plain text.
- Hosted sessions are signed with `SESSION_SECRET`; keep this value private and out of source control.
- Session cookies are `HttpOnly`, `Secure` (hosted), and `SameSite=Strict`.
- The server applies company assignments on every request; hiding interface controls alone is not relied upon for authorization.
- Netlify blocks public access to `companies.js` and `auth-data.json` through redirects.
- Back up production data through an export before making material changes or resetting a Blob store.

## Troubleshooting

| Issue | What to check |
| --- | --- |
| "Secure server unavailable" | Start the local server with `npm.cmd run dev` and use `http://localhost:3000`. |
| Setup page keeps appearing | Confirm an administrator was created successfully and that the data store is writable. |
| Cannot open the admin dashboard | Sign in with an administrator account. |
| User cannot see a company | In Admin Dashboard, ensure the company is assigned to that exact user and save assignments. |
| Changes do not persist locally | Confirm the process can write `auth-data.json`; do not open the HTML files directly from the filesystem. |
| Hosted login fails | Confirm `SESSION_SECRET` is configured in Netlify and is at least 32 characters. |
| Zoho does not open from "Open in Zoho Mail" | Sign in to Zoho and configure its browser mail-handler integration; otherwise the browser may use another mail client. |
