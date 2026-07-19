# Step-by-Step Verification Plan

Follow these steps one by one to verify the connection, authentication flows, and frontend-backend synchronization.

---

## Step 1: Start the Backend & Check Health
We will start the Express Node server and verify the API listener is operational.

1.  **Action**: Run the backend server. Open your terminal in the `Backend` directory and execute:
    ```bash
    npm start
    ```
2.  **Verify Output**: Open your web browser and navigate to:
    [http://localhost:5000/api/health](http://localhost:5000/api/health)
3.  **Expected JSON Response**:
    ```json
    {
      "success": true,
      "status": "UP",
      "environment": "development"
    }
    ```

---

## Step 2: Test User Login API via CLI
We will verify that the backend correctly connects to Neon database to check credentials.

1.  **Action**: Open a new terminal tab and fire a `curl` request to authenticate the seeded student account:
    *   **PowerShell**:
        ```powershell
        Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -ContentType "application/json" -Body '{"email":"student@college.edu","password":"Password123"}'
        ```
    *   **Bash / CMD**:
        ```bash
        curl -X POST -H "Content-Type: application/json" -d "{\"email\":\"student@college.edu\",\"password\":\"Password123\"}" http://localhost:5000/api/auth/login
        ```
2.  **Expected Response**:
    ```json
    {
      "success": true,
      "token": "eyJhbGciOi...",
      "user": {
        "id": "student-uuid",
        "name": "Krishna Kumar",
        "email": "student@college.edu",
        "role": "STUDENT"
      }
    }
    ```

---

## Step 3: Install Frontend Dependencies & Start React
We will set up the Vite + React client.

1.  **Action**: Install frontend packages and run the Vite dev server. Open your terminal in the `Frontend` directory and run:
    ```bash
    npm install
    ```
    Then run:
    ```bash
    npm run dev
    ```
2.  **Verify Output**: Open your browser and navigate to the address shown in terminal (usually [http://localhost:3000](http://localhost:3000)).
3.  **Expected View**: You should see the custom animated **SkillForge Landing Page** with "Get Started" buttons.

---

## Step 4: Login via the UI Dashboard
We will check the complete frontend-backend database integration.

1.  **Action**:
    - Click **Sign In** on the top right header.
    - Log in using the student credentials:
      - **Email**: `student@college.edu`
      - **Password**: `Password123`
2.  **Expected View**:
    - You should be redirected to the **Student Dashboard**.
    - The profile name should display **Krishna Kumar**.
    - The dashboard should fetch and show your **Placement Score (82%)** and animated weekly/monthly graphs populated from Neon database queries.
