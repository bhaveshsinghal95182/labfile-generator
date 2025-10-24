import os
import subprocess

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

# --- Main Script ---

def convert_files():
    """
    Loops through lab files, cleans them, adds a heading,
    and converts them to DOCX using Pandoc.
    """
    print("🚀 Starting conversion process...")

    # Create the output directory if it doesn't exist
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # Loop through Experiment 1 to 12
    for i in range(1, 13):
        md_filename = f"Experiment {i}.md"
        docx_filename = f"experiment{i}.docx"
        
        input_path = os.path.join(INPUT_DIR, md_filename)
        output_path = os.path.join(OUTPUT_DIR, docx_filename)
        
        # Check if the source file actually exists
        if not os.path.exists(input_path):
            print(f"⚠️  Skipping: {md_filename} not found.")
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
            # The '# ' makes it a "Heading 1" in Markdown.
            # The '\n\n' ensures it's properly separated from the content.
            final_content = f"# {heading_text}\n\n{content}"

            # 4. Build and run the Pandoc command
            command = [
                'pandoc',
                '--from', 'markdown',        # Input format
                '--to', 'docx',              # Output format
                '--no-highlight',            # As you requested
                '--reference-doc', TEMPLATE_FILE, # Our styled template!
                '--output', output_path      # The final output file path
            ]
            
            # We pipe the modified content directly to Pandoc's stdin
            subprocess.run(
                command, 
                input=final_content, 
                encoding='utf-8', 
                check=True # This will raise an error if pandoc fails
            )
            
            print(f"✅ Successfully converted {md_filename} to {docx_filename}")

        except FileNotFoundError:
            print(f"❌ ERROR: pandoc command not found. Is Pandoc installed and in your PATH?")
            break
        except subprocess.CalledProcessError as e:
            print(f"❌ ERROR: Pandoc failed to convert {md_filename}. Details: {e}")
        except Exception as e:
            print(f"❌ An unexpected error occurred with {md_filename}: {e}")

    print("\n✨ All done!")


if __name__ == "__main__":
    # Ensure the template file exists before we start
    if not os.path.exists(TEMPLATE_FILE):
        print(f"❌ CRITICAL ERROR: The template file '{TEMPLATE_FILE}' was not found.")
        print("Please follow Step 1 to create it and place it in this directory.")
    else:
        convert_files()
