import os
import subprocess
from rich.console import Console

CONSOLE = Console()

# --- Configuration ---
# Use os.path.expanduser to correctly handle the '~' for your home directory
INPUT_DIR = os.path.expanduser('~/vault/College/Software Craftsmanship Lab')
OUTPUT_DIR = os.path.expanduser('~/college/software-craftsmanship')
TEMPLATE_FILE = 'template/template.docx' # Must be in the same folder as this script

# The exact lines you want to remove from the markdown files
LINES_TO_REMOVE = [
    "**Description and definitions:**",
    "### **How certain keywords are used in the above example**"
]

def convert_files(md_input_dir: str = "", docx_output_dir: str = "", template_file: str = ""):
    """
    Loops through lab files, cleans them, adds a heading,
    and converts them to DOCX using Pandoc.
    """
    CONSOLE.print("🚀 Starting conversion process...")

    # Ensure the template file exists before we start
    template_file = template_file or TEMPLATE_FILE
    if not os.path.exists(template_file):
        CONSOLE.print(f"❌ [bold red]CRITICAL ERROR: The template file '{template_file}' was not found.[/bold red]")
        CONSOLE.print("Please ensure the template file exists in the 'template' directory.")
        return

    # Determine input/output directories (allow overrides)
    md_input_dir = md_input_dir or INPUT_DIR
    docx_output_dir = docx_output_dir or OUTPUT_DIR

    # Create the output directory if it doesn't exist
    os.makedirs(docx_output_dir, exist_ok=True)

    # Loop through Experiment 1 to 12
    for i in range(1, 13):
        md_filename = f"Experiment {i}.md"
        docx_filename = f"experiment{i}.docx"
        input_path = os.path.join(md_input_dir, md_filename)
        output_path = os.path.join(docx_output_dir, docx_filename)
        
        # Check if the source file actually exists
        if not os.path.exists(input_path):
            CONSOLE.print(f"⚠️  Skipping: {md_filename} not found.")
            continue

        try:
            # 1. Read the original markdown content
            with open(input_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # 2. Remove the specified lines
            for line in LINES_TO_REMOVE:
                content = content.replace(line, '')

            # 3. Add the new title at the top as a Markdown H1 heading
            heading_text = f"Experiment - {i}"
            final_content = f"# {heading_text}\\n\\n{content}"

            # 4. Build and run the Pandoc command
            command = [
                'pandoc',
                '--from', 'markdown',
                '--to', 'docx',
                '--no-highlight',
                '--reference-doc', template_file,
                '--output', output_path
            ]
            
            subprocess.run(
                command, 
                input=final_content, 
                encoding='utf-8', 
                check=True
            )
            
            CONSOLE.print(f"✅ Successfully converted [bold green]{md_filename}[/bold green] to [bold green]{docx_filename}[/bold green]")

        except FileNotFoundError:
            CONSOLE.print(f"❌ [bold red]ERROR: pandoc command not found. Is Pandoc installed and in your PATH?[/bold red]")
            break
        except subprocess.CalledProcessError as e:
            CONSOLE.print(f"❌ [bold red]ERROR: Pandoc failed to convert {md_filename}. Details: {e}[/bold red]")
        except Exception as e:
            CONSOLE.print(f"❌ [bold red]An unexpected error occurred with {md_filename}: {e}[/bold red]")

    CONSOLE.print("\\n✨ All done!")
