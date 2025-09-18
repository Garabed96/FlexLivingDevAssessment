# Flex Living - Reviews Dashboard

This project is a developer assessment task to build a Reviews Dashboard for Flex Living. The dashboard allows managers to assess property performance based on guest reviews, normalize data from a mock API, and manage which reviews are displayed publicly. It provides insights into property performance, enables efficient review management, and demonstrates a modern web application architecture.

## Tech Stack

-   **Framework**: [React](https://react.dev/) `18.3.1` via [Vite](https://vitejs.dev/) `5.2.0` (with TypeScript `5.2.2`)
-   **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) `3.4.4`
-   **Data Fetching & State**: [TanStack Query (React Query)](https://tanstack.com/query/latest) `5.89.0`
-   **Routing**: [TanStack Router](https://tanstack.com/router/latest) `1.131.44`
-   **Data Grid**: [TanStack Table](https://tanstack.com/table/latest) `8.21.3`
-   **Schema Validation**: [Zod](https://zod.dev/) `4.1.8`
-   **Mock API**: [json-server](https://github.com/typicode/json-server) `0.17.4`

---

## Local Setup & Installation

Follow these steps to get the project running locally.

1.  **Prerequisites**
    Ensure you have [Node.js](https://nodejs.org/) installed. This project uses `pnpm` for package management, which offers efficient disk space usage and strict dependency management. If you don't have `pnpm`, install it globally:

    ```bash
    npm install -g pnpm
    ```

    Alternatively, `npm` or `yarn` can also be used, but `pnpm` is recommended for consistent package installations across different environments, thanks to its content-addressable store and `pnpm-lock.yaml` file.

2.  **Clone the Repository**

    ```bash
    git clone <your-repository-url>
    cd <repository-folder>
    ```
    Not necessary since the project is being uploaded on a different platform... 

3.  **Install Dependencies**
    Use `pnpm` to install the required packages.

    ```bash
    pnpm install
    ```

    If you prefer `npm` or `yarn`, use `npm install` or `yarn install` respectively.

4.  **Create the Mock Database**
    Create a file named `db.json` in the root of the project directory. Paste your mock review data into this file. This `db.json` will serve as the database for the mock API.

5.  **Run the Mock API Server**
    In your first terminal window, start the `json-server` to serve the mock review data. This will provide the backend API for the dashboard.

    ```bash
    pnpm run dev:api
    ```
    The API will be available at `http://localhost:3001/reviews`. Keep this terminal running.

6.  **Run the Development Server**
    In a separate terminal window, start the Vite development server for the React frontend.

    ```bash
    pnpm run dev
    ```
    The application will be running at `http://localhost:5173`. Open this URL in your browser to access the Reviews Dashboard.

---

## API Behaviors

The mock API, powered by `json-server`, provides the following behaviors:

-   **`GET /reviews`**: Fetches all reviews from the `db.json` mock database.
-   **`PATCH /reviews/:id`**: Updates a specific review object identified by its `id`. This is primarily used to toggle the `isApproved` boolean status of a review.