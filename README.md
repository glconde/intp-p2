
# Monorepo Fullstack App Documentation (AWS CI/CD)

## 1. Introduction to the Monorepo App

This project is a full-stack application organized in a **monorepo structure**. It contains the following major components:  
- **Frontend**: React/React Native/Next.js (as applicable), written in **TypeScript**, bundled and deployed via **AWS Amplify**.  
- **Backend**: Spring Boot (Java 17) API hosted on **AWS Elastic Beanstalk**. Provides CRUD endpoints for the application.  
- **Database**: **Amazon RDS (MySQL)** as the persistent storage layer.  

### Tech Stack Summary
- **Frontend**: React Native / React (TypeScript), Expo, Amplify hosting  
- **Backend**: Spring Boot (Java 17), Maven build  
- **Database**: Amazon RDS (MySQL engine)  
- **Infrastructure**: AWS Amplify, AWS Elastic Beanstalk, AWS RDS, VPC, Security Groups  
- **CI/CD**: GitHub Actions (staging branches `staging-frontend` and `staging-backend`)  


## Architecture Diagram

![Architecture Diagram](/docs/arch.png)

*The diagram shows:*
- **Amplify (Frontend)** → communicates over **HTTPS**  
- **CloudFront** → terminates HTTPS and forwards requests to Elastic Beanstalk over **HTTP**  
- **Elastic Beanstalk (Spring Boot API)** → handles backend logic and connects to **RDS**  
- **RDS (MySQL)** → backend data layer, typically accessed via **JDBC (SSL optional)**  

---

## 2. Frontend Setup

1. Navigate to the `frontend` folder of the monorepo.
2. Install dependencies:  
   ```bash
   npm install
   ```
3. Run the development server locally:
   ```bash
   npm run dev
   ```
4. Build the production bundle:  
   ```bash
   npm run build
   ```
5. Test endpoints by pointing API URLs to your local backend or deployed backend (`.env`).

---

## 3. Backend Setup

1. Navigate to the `backend` folder of the monorepo. 
   ```bash
   cd backend
   ```
2. Verify Maven wrapper permissions (No need on Windows):  
   ```bash
   chmod +x mvnw
   ```
3. Build the backend (see [Windows Alternative Commands](#windows-alternative-commands-backend-setup)): 
   ```bash
   ./mvnw package -DskipTests=true
   ```
4. Run locally with a connected RDS instance:  
   ```bash
   ./mvnw spring-boot:run
   ```
5. Update `application.properties` or `application.yml` with RDS connection details:
   ```properties
   spring.datasource.url=jdbc:mysql://<rds-endpoint>:3306/<dbname>
   spring.datasource.username=admin
   spring.datasource.password=<password>
   spring.jpa.hibernate.ddl-auto=update
   ```

---

### Windows Alternative Commands (Backend Setup)

If you are on Windows, use these commands instead of the Linux/Mac commands:

1. Navigate to the `backend` folder:  
   ```powershell
   cd backend
   ```

2. **Skip `chmod +x`** (not required on Windows).

3. Build the backend:  
   ```powershell
   mvnw.cmd package -DskipTests=true
   ```

4. Run locally with a connected RDS instance:  
   ```powershell
   mvnw.cmd spring-boot:run
---

## 4. Setting up RDS on AWS

### Step 1: Create RDS Instance
1. Log in to **AWS Management Console** → Search **RDS** → **Create database**.  
2. Choose **Standard Create**, **MySQL**, Free-tier if available.  
3. Database instance identifier: `project-db`  
4. Credentials:  
   - Master username: `admin`  
   - Password: generate and save securely.  
5. Instance size: `db.t3.micro` (free-tier)  
6. VPC: Use **default VPC** or create a dedicated VPC.  
7. Public Access: Set to **Yes** if you want external Workbench access (otherwise use private).  

### Step 2: Configure Security Groups
1. Go to **EC2 → Security Groups**.  
2. Locate the RDS security group, **Edit inbound rules**:  
   - Add MySQL/Aurora rule: Port **3306**, Source **your IP** (or Elastic Beanstalk security group).  

### Step 3: Test Connection
- **From local machine**:  
  Use MySQL Workbench:  
  ```
  Hostname: <rds-endpoint>
  Port: 3306
  Username: admin
  Password: <password>
  ```
- Ensure inbound rules allow your current IP.

---

## 5. Setting up Backend on Elastic Beanstalk

### Step 1: Prepare Elastic Beanstalk
1. Open AWS Console → **Elastic Beanstalk** → **Create Application**.  
2. Platform: **Java 17**, Upload source: skip initial upload (we'll deploy via GitHub).  
3. Set environment name: `movies-backend-env`.  
4. Attach to the same **VPC** and **security group** used for RDS.

### Step 2: Update GitHub Actions for CI/CD

Add `.github/workflows/deploy-backend.yml`:

```yaml
name: Deploy to Backend
on:
  push:
    branches:
      - staging-backend

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout source
        uses: actions/checkout@v4

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'

      - name: Grant execute permission for Maven wrapper
        working-directory: ./backend
        run: chmod +x mvnw

      - name: Build Spring Boot Jar
        working-directory: ./backend
        run: ./mvnw package -DskipTests=true

      - name: Deploy to Elastic Beanstalk
        uses: einaregilsson/beanstalk-deploy@v21
        with:
          application_name: "movies-backend"
          environment_name: "movies-backend-env"
          region: "us-east-2"
          version_label: ${{ github.sha }}
          aws_access_key: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws_secret_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          file: ./backend/target/*.jar
```

### Step 3: GitHub Secrets
1. In GitHub Repo → **Settings** → **Secrets and Variables**:  
   - `AWS_ACCESS_KEY_ID`  
   - `AWS_SECRET_ACCESS_KEY`  

### Step 4: Deploy
- Initial manual deploy through **EB Console** → **Upload and deploy**.  
- Subsequent pushes to `staging-backend` branch trigger automatic deploy.

---

## CloudFront Setup for Backend (Elastic Beanstalk)

Because the backend Elastic Beanstalk environment uses HTTP by default, browsers block requests from the frontend (Amplify on HTTPS) due to mixed-content restrictions. To solve this, we configured **Amazon CloudFront** as an HTTPS reverse proxy in front of Elastic Beanstalk.

### Steps

1. **Create a CloudFront Distribution**
   - Go to **AWS Console → CloudFront → Create Distribution**.
   - **Origin domain**: Select your Elastic Beanstalk endpoint (e.g., `your-backend-env.elasticbeanstalk.com`).
   - Set **Origin Protocol Policy** = `HTTP Only`.
   - Set **Viewer Protocol Policy** = `Redirect HTTP to HTTPS`.

2. **Alternate Domain (optional)**  
   - If using a custom domain, add it under "Alternate Domain Names (CNAMEs)" and configure DNS.

3. **Default Cache Behavior**  
   - Allowed HTTP Methods: `GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE`.
   - Disable caching for API paths.

4. **SSL/TLS**  
   - Choose an AWS-managed SSL certificate.

5. **Deploy**  
   - Save and deploy the distribution. You will get a CloudFront URL like:  
     `https://<your-distribution>.cloudfront.net`

6. **Update Frontend API URL**  
   - Change `NEXT_PUBLIC_API_URL` in the frontend `.env` to use the CloudFront URL.

7. **CORS**  
   - Ensure the backend CORS configuration allows both the Amplify and CloudFront domains.
---

## 6. Setting up Frontend on Amplify

### Step 1: Connect GitHub Repo
1. AWS Console → **Amplify** → **Create New App** → **Host web app**.  
2. Choose **GitHub** as the repository, select the monorepo root.  
3. Build settings: Specify **frontend folder** (Amplify detects automatically or edit `amplify.yml`).  

### Step 2: Environment Variables
- Add `.env` keys (e.g., `API_URL` pointing to Elastic Beanstalk API endpoint).

- See [See Environment Variables Appendix](#appendix-environment-variables-configuration)

### Step 3: CI/CD
- Pushes to the `staging-frontend` branch trigger automatic build and deploy in Amplify.

---

## 7. CI/CD Flow

### Designated Branches
- **Frontend**: `staging-frontend` → AWS Amplify.  
- **Backend**: `staging-backend` → AWS Elastic Beanstalk.  

### How Services Communicate
1. **Backend ↔ RDS**: EB app connects to RDS endpoint in the same VPC/security group.  
2. **Frontend ↔ Backend**: Amplify app uses the Elastic Beanstalk API endpoint (e.g., `https://<cloudfront>/api`).  
3. **Authentication**: API secured with CORS, only frontend Amplify domain allowed.  

---

### CORS Configuration Clarification

To secure API calls, the backend enforces **CORS** so that only requests from trusted domains are allowed. This is controlled by the `ALLOWED_ORIGIN` environment variable.

Example in `application.properties` or configuration class:

```properties
ALLOWED_ORIGIN=https://your-frontend.amplifyapp.com
```

Spring Boot CORS filter sample:

```java
@Bean
public WebMvcConfigurer corsConfigurer() {
    return new WebMvcConfigurer() {
        @Override
        public void addCorsMappings(CorsRegistry registry) {
            registry.addMapping("/**")
                    .allowedOrigins(System.getenv("ALLOWED_ORIGIN"))
                    .allowedMethods("*");
        }
    };
}
```

### Code Push Process
1. Developer commits code and pushes to the respective `staging-*` branch.  
2. GitHub Actions (backend) or Amplify CI/CD (frontend) builds and deploys automatically.  
3. On success, updated environment is live.  



---

## 8. CRUD API Documentation

Base URL: `https://<cloudfront-or-elastic-beanstalk-url>/api/movies`

### GET All Movies
```http
GET /api/movies
```
Response:
```json
[
  {
    "id": 1,
    "title": "Movie Title",
    "releaseYear": 2024,
    "genre": "Action",
    "posterUrl": "http://...",
    "description": "Movie description"
  }
]
```

### GET Movie by ID
```http
GET /api/movies/{id}
```

### POST Create Movie
```http
POST /api/movies
Content-Type: application/json
```
Body:
```json
{
  "title": "New Movie",
  "releaseYear": 2024,
  "genre": "Drama",
  "posterUrl": "http://...",
  "description": "Description"
}
```

### PUT Update Movie
```http
PUT /api/movies/{id}
Content-Type: application/json
```
Body:
```json
{
  "title": "Updated Movie",
  "releaseYear": 2025,
  "genre": "Comedy",
  "posterUrl": "http://...",
  "description": "Updated Description"
}
```

### DELETE Movie
```http
DELETE /api/movies/{id}
```

---

## Notes
- Use Postman or cURL to test CRUD operations.
- Ensure correct **CORS configuration** in the backend to allow frontend domain.

---

## Appendix: Environment Variables Configuration

### Backend Environment Variables (Elastic Beanstalk)

When deploying the backend to Elastic Beanstalk, set the following **environment properties** under:  
**Elastic Beanstalk → Configuration → Software → Environment properties.**

- `DB_URL` = `<your-rds-endpoint>`  
- `DB_USERNAME` = `<db-username>`  
- `DB_PASSWORD` = `<db-password>`  
- `DB_PORT` = `3306`  
- `DB_MOVIETABLE` = `<database-name>`  
- `SPRING_PROFILES_ACTIVE` = `dev` *(or other profile as needed)*  
- `ALLOWED_ORIGIN` = `<frontend-amplify-domain>` *(to allow CORS)*  

**Example:**  

```properties
DB_URL=your-rds-endpoint.rds.amazonaws.com
DB_USERNAME=your-db-username
DB_PASSWORD=your-db-password
DB_PORT=3306
DB_MOVIETABLE=movies_db
SPRING_PROFILES_ACTIVE=dev
ALLOWED_ORIGIN=https://your-frontend.amplifyapp.com
```

These variables are automatically injected into Spring Boot at runtime.

---

### Frontend Environment Variables (Amplify / Local)

For local development or when configuring Amplify:  

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080
```

When deployed on Amplify, `NEXT_PUBLIC_API_URL` should point to the backend's **public URL (Elastic Beanstalk or CloudFront)**:  

```bash
NEXT_PUBLIC_API_URL=https://<your-cloudfront-distribution>.cloudfront.net
```

> **Note:** The `NEXT_PUBLIC_` prefix is required in Next.js/React so that variables are exposed to the browser.