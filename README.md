# CodePlayground

A collection of digital toys, interactive experiments, and creative coding projects.

## Local Development (VS Code)

1.  **Clone or Download** this project to your local machine.
2.  **Open in VS Code**.
3.  **Install Dependencies**:
    ```bash
    npm install
    ```
4.  **Set Environment Variables**:
    -   Create a `.env` file in the root directory.
    -   Add your Gemini API Key:
        ```env
        VITE_GEMINI_API_KEY=your_api_key_here
        ```
    -   *Note: In `vite.config.ts`, it's configured to use `GEMINI_API_KEY`, but for client-side Vite, it's better to use `VITE_` prefix if you want to access it via `import.meta.env`. Currently, it's injected via `define`.*
5.  **Run the App**:
    ```bash
    npm run dev
    ```
    The app will be available at `http://localhost:3000`.

## Deployment (Vercel)

This project is ready to be deployed to Vercel.

1.  **Push to GitHub/GitLab/Bitbucket**.
2.  **Import to Vercel**:
    -   Go to [Vercel Dashboard](https://vercel.com/dashboard).
    -   Click "Add New" -> "Project".
    -   Select your repository.
3.  **Configure Environment Variables**:
    -   In the Vercel project settings, add `GEMINI_API_KEY` with your actual key.
4.  **Deploy**:
    -   Vercel will automatically detect Vite and use `npm run build` to deploy.

## Project Structure

-   `src/App.tsx`: Main application component.
-   `src/constants.ts`: Project data and categories.
-   `src/types.ts`: TypeScript interfaces.
-   `vite.config.ts`: Vite configuration.
-   `vercel.json`: Vercel routing configuration.
