# GenQuantis Discovery Platform — Frontend Client

This repository contains the standalone, static frontend client for the **GenQuantis Discovery (Biologics Discovery) Platform**. It communicates entirely via API endpoints and WebSockets with the deployed FastAPI backend.

---

## 🛠️ Tech Stack
* **Structure & UI Templates**: HTML5 (designed for clean, semantic structure)
* **Styling**: Custom CSS3 system with responsive layouts
* **Client-side Logic**: Vanilla JavaScript
* **Data Visualization & NGL**: NGL Viewer for 3D molecular visualization, Chart.js for system and analytics charts.
* **Server Tooling**: `lite-server` (Browsersync-based local environment)

---

## 📂 Repository Structure
* `/templates` — HTML pages (landing page, dashboard, target explorer, molecular docking, pocket discovery, admin overview, etc.)
* `/static` — Asset files:
  * `/css` — Core design stylesheet (`platform.css`)
  * `/js` — Client side routers, API integrations, and analytics scripts
  * `/images` — UI mockups, infographics, and visual design assets
* `package.json` & `bs-config.json` — Local dev server config (uses Browsersync to map routes automatically)

---

## 💻 How to Run Locally

### Option 1: Using Node & npm (Recommended)
This uses `lite-server` to automatically serve files on port `3000` with hot-reloading:
1. Ensure Node.js is installed.
2. Run npm install to fetch the dev server dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm start
   ```
4. Access the login screen at:
   👉 **`http://localhost:3000/templates/login.html`**

### Option 2: Using Python HTTP Server (Zero Dependencies)
Since this is a fully static client, you can serve the root directory with any HTTP server:
```bash
python -m http.server 3000
```
Open **`http://localhost:3000/templates/login.html`** in your browser.

---

## ⚙️ Connecting to the Backend API

The frontend is currently configured to connect directly to the live deployed Azure App Service backend:
🔗 **`https://biologics-htf4hhd5gphaaeb7.southindia-01.azurewebsites.net`**

If a DevOps engineer needs to change or redirect the API backend URL, they must update the base URL in the following **three files**:

1. **Global App Settings**: `static/js/main.js`
   ```javascript
   var API_BASE_URL = 'https://your-new-backend-url.azurewebsites.net';
   ```
2. **Login Auth Controller**: `templates/login.html`
   ```javascript
   const API_BASE = 'https://your-new-backend-url.azurewebsites.net';
   ```
3. **Admin Dashboard Controller**: `templates/admin_dashboard.html`
   ```javascript
   const API_BASE = 'https://your-new-backend-url.azurewebsites.net';
   ```

---

## 🚀 DevOps: Production Deployment to Azure Static Web Apps

Deploying this client to Azure is simple and completely free using **Azure Static Web Apps (ASWA)**:

### 1. Azure Portal Configuration
1. Create a new **Static Web App** in the Azure Portal.
2. Select **GitHub** as the deployment source.
3. Link your GitHub account and select your repository: `BIOLOGICS_V3_FRONTEND`.
4. Under **Build Details**, use the **Custom** preset:
   * **App location**: `/` *(Tells Azure that the static files are at the root level)*
   * **Api location**: *(Leave blank)*
   * **Output location**: `.` *(Tells Azure to publish the current root)*
5. Click **Review + Create**, then **Create**. This will auto-configure a GitHub Actions CI/CD deployment workflow in your repository.

### 2. Configure Backend CORS
Once the Static Web App is deployed, Azure will generate a URL (e.g. `https://xxx.azurestaticapps.net`).
You must allow this URL on the backend App Service to avoid CORS preflight request errors:
1. Go to the Azure Portal page for the **Backend API Web App**.
2. Go to **Configuration** (or **Environment Variables**).
3. Update the `ALLOWED_ORIGINS` setting to include your new frontend URL:
   * **Name**: `ALLOWED_ORIGINS`
   * **Value**: `https://your-frontend.azurestaticapps.net,http://localhost:3000`
4. Save and restart the backend.
