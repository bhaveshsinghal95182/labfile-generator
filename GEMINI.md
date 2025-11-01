# Gemini Code Assistant Context

## Project Overview

This repository contains the "LabFile Generator" project, which is composed of two main parts:

1.  **A command-line tool (`cli`)**: A Python-based tool to streamline the process of creating lab reports. It features an interactive CLI, AI-powered content generation, and conversion from Markdown to DOCX.
2.  **A web interface (`www`)**: A Next.js application that provides a web-based UI for the LabFile Generator.

The project is structured as a monorepo, with the CLI and web application in separate directories.

## Building and Running

### CLI (`cli`)

The CLI is a Python application.

1.  **Install dependencies:**
    ```bash
    uv pip install -e ./cli
    ```

2.  **Run the application:**
    ```bash
    python cli/main.py
    ```
    or
    ```bash
    labgen
    ```

### Web (`www`)

The web application is a Next.js project.

1.  **Install dependencies:**
    ```bash
    pnpm install --prefix ./www
    ```

2.  **Run the development server:**
    ```bash
    pnpm --prefix ./www dev
    ```

3.  **Build the application:**
    ```bash
    pnpm --prefix ./www build
    ```

4.  **Start the production server:**
    ```bash
    pnpm --prefix ./www start
    ```

5.  **Lint the code:**
    ```bash
    pnpm --prefix ./www lint
    ```

## Development Conventions

### CLI (`cli`)

*   **Environment Variables:** The project uses `python-dotenv` to manage environment variables. The `GOOGLE_API_KEY` is a crucial environment variable for the AI-powered features.
*   **Code Structure:** The main CLI logic is in `main.py`, with core functionalities in the `utils` directory.
*   **AI Functionality:** The AI-powered features are implemented using the `langchain-google-genai` library.
*   **DOCX Conversion:** The conversion from Markdown to DOCX is performed using `pandoc`.

### Web (`www`)

*   **Package Manager:** The project uses `pnpm` for managing dependencies.
*   **Code Structure:** The application code is organized within the `src` directory.
*   **Styling:** The project uses Tailwind CSS for styling.
*   **Linting:** ESLint is used for code linting.
