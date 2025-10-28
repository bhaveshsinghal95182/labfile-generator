# LabFile Generator

A command-line tool to streamline the process of creating lab reports. This tool helps you quickly generate structured Markdown files for your experiments and then convert them into DOCX format, ready for submission.

## Features

- **Interactive CLI:** An easy-to-use command-line interface that guides you through the process.
- **AI-Powered Aim Deduction:** Automatically extract experiment aims and numbers from a piece of text using Google's Generative AI.
- **Manual Entry Mode:** Manually enter experiment aims and numbers if you prefer.
- **Markdown Generation:** Creates well-structured Markdown files for each experiment, including sections for Aim, Theory, Materials, Procedure, Observations, and Conclusion.
- **AI-Powered Content Generation:** Optionally uses a Large Language Model to expand on the provided aim and generate a more complete lab report.
- **DOCX Conversion:** Converts the generated Markdown files into DOCX format using a customizable Pandoc template.

## Requirements

- Python 3.7+
- Pandoc
- A Google AI API Key

## Quick Start with `pipx`

If you have `pipx` installed, you can run the LabFile Generator directly from the GitHub repository:

```bash
pipx run --spec=git+https://github.com/bhaveshsinghal95182/labfile-generator.git labgen
```

## Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/bhaveshsinghal95182/labfile-generator.git
    cd labfile-generator
    ```

2.  **Create a virtual environment and install dependencies with `uv`:**
    ```bash
    uv venv
    uv pip install -e .
    ```

    **Note:** If you don't have `uv` installed, you can install it with `pipx`:
    ```bash
    pipx install uv
    ```

## Usage

1.  **Activate the virtual environment:**
    ```bash
    source .venv/bin/activate
    ```

2.  **Run the script:**
    ```bash
    python main.py
    ```

3.  **Follow the prompts:**
    The script will guide you through the process of generating your lab files.

## Configuration

### Google AI API Key

The script requires a Google AI API key to use the AI-powered features. You can provide the API key in one of two ways:

1.  **Environment Variable:**
    Create a `.env` file in the root of the project and add the following line:
    ```
    GOOGLE_API_KEY="your-api-key"
    ```

2.  **Prompt:**
    If the `GOOGLE_API_KEY` environment variable is not set, the script will prompt you to enter your API key when you run it.

### Pandoc Template

The DOCX conversion uses a Pandoc template to ensure consistent formatting. The default template is located at `template/template.docx`. You can modify this template to change the appearance of the generated DOCX files.
