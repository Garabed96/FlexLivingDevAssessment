# Flex Living - Reviews Dashboard

This project is a developer assessment task to build a Reviews Dashboard for Flex Living. The dashboard allows managers to assess property performance based on guest reviews, normalize data from a mock API, and manage which reviews are displayed publicly.

## Tech Stack

-   **Framework**: [React](https://react.dev/) via [Vite](https://vitejs.dev/) (with TypeScript)
-   **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Data Fetching & State**: [TanStack Query (React Query)](https://tanstack.com/query/latest)
-   **Routing**: [TanStack Router](https://tanstack.com/router/latest)
-   **Data Grid**: [TanStack Table](https://tanstack.com/table/latest)
-   **Schema Validation**: [Zod](https://zod.dev/)
-   **Mock API**: [json-server](https://github.com/typicode/json-server)

---

## Local Setup & Installation

Follow these steps to get the project running locally.

1.  **Clone the Repository**

    ```bash
    git clone <your-repository-url>
    cd <repository-folder>
    ```

2.  **Install Dependencies**
    Use `npm` to install the required packages.

    ```bash
    npm install
    ```

3.  **Create the Mock Database**
    Create a file named `db.json` in the root of the project and paste the provided mock review data into it.

4.  **Run the Mock API Server**
    In a separate terminal, start the `json-server` to serve the mock review data.

    ```bash
    npx json-server --watch db.json --port 3001
    ```
    The API will be available at `http://localhost:3001/reviews`.

5.  **Run the Development Server**
    In another terminal, start the Vite development server.

    ```bash
    npm run dev
    ```
    The application will be running at `http://localhost:5173`.

---

## Development Plan

This project will be built in three main phases:

### Morning Session: Foundation & Data (3-4 hours)

1.  **Setup Environment**: Initialize Vite, `shadcn/ui`, and `json-server`.
2.  **Define Data Schema**:
    -   Create a `reviewSchema` using Zod in `src/schemas/`.
    -   Include `isApproved: z.boolean().optional()` for manager approvals.
    -   Export the inferred TypeScript `Review` type.
3.  **Fetch Data**:
    -   Wrap the application in `QueryClientProvider`.
    -   Create a `useGetReviews` custom hook in `src/api/` to fetch and parse reviews from `http://localhost:3001/reviews`.

### Afternoon Session: Build The Dashboard (4-5 hours)

1.  **Create Dashboard Page**:
    -   Set up TanStack Router with a root route and a `/dashboard` route.
    -   Fetch data on the page using the `useGetReviews` hook.
2.  **Implement Data Table**:
    -   Build a `DataTable` component using `shadcn/ui` and TanStack Table.
    -   Define columns for the table (Author, Rating, Comment, etc.).
3.  **Add Core Functionality**:
    -   **Filtering**: Add an `Input` component for live searching.
    -   **Approval Switch**: Add a `Switch` component column for approvals.
    -   **Mutation**: Create a `useMutation` hook to send a `PATCH` request to update a review's `isApproved` status. Use optimistic updates for a better UX.

### Finalizing: Public Page & Docs (2-3 hours)

1.  **Build Public Page**:
    -   Create a new `/property-reviews` route.
    -   Fetch data and use `.filter()` to display only approved reviews.
2.  **Google Reviews API**:
    -   Time-box one hour to research the Google Places API for review integration.
    -   Document findings in this `README.md`.
3.  **Final Polish**:
    -   Update documentation with setup instructions and design decisions.
    -   Clean up code and perform a final review.

---

## API Behaviors

-   **`GET /reviews`**: Fetches all reviews from the `db.json` mock database.
-   **`PATCH /reviews/:id`**: Updates a review object. Used to toggle the `isApproved` boolean.
    -   *Example Body*: `{ "isApproved": true }`

## Google Reviews Findings

*(To be completed after research)*