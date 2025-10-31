# Gemini Code Assistant Context

This document provides context for the Gemini Code Assistant to understand the "LabFile Generator" project.

## Project Overview

The "LabFile Generator" is a command-line tool designed to streamline the process of creating lab reports. It is built with Python and features an interactive CLI powered by the `questionary` library. The tool's primary functions are to generate structured Markdown files for lab experiments and then convert them into DOCX format.

The tool offers two modes for generating Markdown files:

1.  **AI-Powered Aim Deduction:** Users can paste a block of text, and the tool will leverage Google's Generative AI to automatically extract experiment numbers and their corresponding aims.
2.  **Manual Entry:** Users can opt to manually input the experiment numbers and aims.

The generated Markdown files are well-structured, including sections for Aim, Theory, Materials, Procedure, Observations, and Conclusion. The tool can also utilize a Large Language Model (LLM) to expand on the provided aim and generate a more comprehensive lab report.

The conversion from Markdown to DOCX is handled by `pandoc`, using a customizable template to ensure consistent formatting.

## Building and Running

The project uses `uv` for managing dependencies.

To build and run the project, follow these steps:

1.  **Install dependencies:**
    ```bash
    uv pip install -e .
    ```

2.  **Run the application:**
    You can run the application using either of the following commands:
    ```bash
    python main.py
    ```
    or
    ```bash
    labgen
    ```

## Development Conventions

*   **Environment Variables:** The project uses `python-dotenv` to manage environment variables. The `GOOGLE_API_KEY` is a crucial environment variable for the AI-powered features.
*   **Code Structure:** The project is organized with the main CLI logic in `main.py` and the core functionalities separated into a `utils` directory. The `utils` directory contains modules for AI (`ai.py`) and DOCX conversion (`converter.py`).
*   **AI Functionality:** The AI-powered features are implemented using the `langchain-google-genai` library, with `pydantic` being used for structured data output.
*   **DOCX Conversion:** The conversion from Markdown to DOCX is performed using the `pandoc` command-line tool.
