import os
import questionary
from rich.console import Console
from rich.panel import Panel
from utils.ai import deduce_aims_from_text, get_api_key, get_llm
from utils.converter import convert_files as convert_md_to_docs

CONSOLE = Console()


def _sanitize_subject(name: str) -> str:
    """Sanitize a subject name into a filesystem-safe folder name."""
    import re
    s = (name or '').strip()
    s = s.replace(' ', '_')
    s = re.sub(r"[^A-Za-z0-9_\-]", '', s)
    return s or 'subject'

def generate_md_file(exp_number, aim, subject_name, output_dir):
    """Generates a markdown file for a single experiment.

    This will attempt to use the configured LLM (via `get_llm`) to expand the
    provided aim into a full markdown skeleton (Theory, Materials, Procedure,
    Observations, Conclusion, and optional Program). If the AI call fails,
    a minimal template will be written instead.
    """
    filename = os.path.join(output_dir, f"Experiment {exp_number}.md")

    # Try to generate a richer markdown using the LLM
    try:
        llm = get_llm()
        system_prompt = (
            f"You are an assistant that writes lab experiment markdown files for the subject '{subject_name}'. "
            "Produce a clear, student-friendly Markdown document for a single experiment. "
            "Include a top-level H1 title, an 'Aim' section, and a 'Program' section if the experiment involves code. "
            "Keep headings in Markdown and keep the content concise but useful"
            "Return ONLY the Markdown content — do not surround it with backticks."
        )

        human_prompt = f"Experiment {exp_number} — Aim: {aim}\n\nWrite the lab file."
        messages = [
            ("system", system_prompt),
            ("human", human_prompt),
        ]

        # Show a loading status while the AI generates the content
        with CONSOLE.status("[bold cyan]AI is thinking...[/bold cyan]", spinner="dots"):
            ai_msg = llm.invoke(messages)
        raw = getattr(ai_msg, 'content', '') or ''
        # strip common markdown code fences if present
        content = raw.strip().replace('```markdown', '').replace('```', '').strip()

        if not content:
            raise RuntimeError("LLM returned empty content")

    except Exception as e:
        CONSOLE.print(f"[yellow]AI generation failed or skipped ({e}). Writing minimal template instead.[/yellow]")
        content = f"# Experiment - {exp_number}\n\n**Aim:** {aim}\n\n## Theory\n\n*Add theory here.*\n\n## Materials / Apparatus\n\n- ...\n\n## Procedure\n\n1. ...\n\n## Observations\n\n*Record your observations here.*\n\n## Analysis\n\n*Add analysis here.*\n\n## Conclusion\n\n*Add conclusion here.*\n\n## Program\n\n```\n# Add program/code here if required\n```\n"

    # Save to file
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    CONSOLE.print(f"✅ Created Markdown file: [bold green]{filename}[/bold green]")
    return filename

def manual_entry_mode(subject_name, output_dir):
    """Handles the manual entry of experiment aims."""
    def parse_selection(sel: str):
        """Parse selection strings like '8-12', '3,5,7', '1-4,6,8' or '10' into a sorted list of ints."""
        sel = sel.strip()
        if not sel:
            return []
        sel = sel.replace(' ', '')
        if sel.lower() == 'all':
            # ask for start and end
            start = questionary.text("Enter start experiment number:", validate=lambda t: t.isdigit() and int(t) > 0).ask()
            end = questionary.text("Enter end experiment number:", validate=lambda t: t.isdigit() and int(t) >= int(start)).ask()
            if not start or not end:
                return []
            return list(range(int(start), int(end) + 1))

        parts = sel.split(',')
        nums = set()
        for p in parts:
            if '-' in p:
                try:
                    a, b = p.split('-', 1)
                    a_i = int(a)
                    b_i = int(b)
                    if a_i <= 0 or b_i <= 0 or b_i < a_i:
                        return None
                    for n in range(a_i, b_i + 1):
                        nums.add(n)
                except Exception:
                    return None
            else:
                try:
                    n = int(p)
                    if n <= 0:
                        return None
                    nums.add(n)
                except Exception:
                    return None
        return sorted(nums)

    sel = questionary.text(
        "Enter experiment numbers to generate (examples: '8-12', '3,5,7', '1-4,6,8', or 'all'):",
        qmark="🔢"
    ).ask()
    if not sel:
        return

    parsed = parse_selection(sel)
    if parsed is None or len(parsed) == 0:
        CONSOLE.print("[bold red]Invalid selection. Please use formats like '8-12', '3,5,7', 'all'.[/bold red]")
        return

    CONSOLE.print(f"Will generate files for experiments: [bold cyan]{', '.join(map(str, parsed))}[/bold cyan]")

    # For convenience, allow defaulting aims (reuse previous input)
    prev_aim = ""
    created_files = []
    for i in parsed:
        aim = questionary.text(f"Enter the aim for Experiment {i}:", default=prev_aim).ask()
        if aim is None:
            # user aborted
            CONSOLE.print("[bold yellow]Aborted by user.[/bold yellow]")
            return
        if not aim.strip():
            skip = questionary.confirm(f"No aim provided for Experiment {i}. Skip generating this file?", default=True).ask()
            if skip:
                CONSOLE.print(f"Skipping Experiment {i}.")
                continue
            else:
                # ask again
                aim = questionary.text(f"Enter the aim for Experiment {i}:").ask()
                if not aim:
                    CONSOLE.print(f"Skipping Experiment {i}.")
                    continue

        created = generate_md_file(i, aim.strip(), subject_name, output_dir)
        if created:
            created_files.append(created)
        prev_aim = aim.strip()

    # After generating files, offer to convert to DOCX
    if created_files:
        convert_now = questionary.confirm("Do you want to convert the generated MD files to DOCX now?", default=True).ask()
        if convert_now:
            subject_dirname = _sanitize_subject(subject_name)
            default_docs = os.path.expanduser(f"~/college/{subject_dirname}")
            docx_output_dir = questionary.path(
                "Enter docs output directory:",
                default=default_docs
            ).ask() or default_docs
            os.makedirs(docx_output_dir, exist_ok=True)
            convert_md_to_docs(md_input_dir=output_dir, docx_output_dir=docx_output_dir)

def ai_deduction_mode(subject_name, system_instruction, output_dir):
    """Handles the AI-powered deduction of experiment aims."""
    CONSOLE.print(Panel("Paste the text containing the experiment aims. Press [bold]Ctrl+D[/bold] or [bold]Ctrl+Z[/bold] (Windows) when you're done.", title="[bold yellow]Input Text[/bold yellow]", border_style="yellow"))
    text_blob = ""
    try:
        while True:
            line = input()
            text_blob += line + "\n"
    except EOFError:
        pass

    if not text_blob.strip():
        CONSOLE.print("[bold red]No input received. Aborting.[/bold red]")
        return

    with CONSOLE.status("[bold cyan]AI is thinking...[/bold cyan]", spinner="dots"):
        result = deduce_aims_from_text(text_blob, system_instruction, subject_name)

    if result and 'experiments' in result:
        CONSOLE.print("[bold green]AI analysis complete! Found experiments:[/bold green]")
        for exp in result['experiments']:
            CONSOLE.print(f"  - [bold]Exp {exp['number']}:[/bold] {exp['aim']}")

        confirm = questionary.confirm("Do you want to generate these files?").ask()
        if confirm:
            created_files = []
            for exp in result['experiments']:
                created = generate_md_file(exp['number'], exp['aim'], subject_name, output_dir)
                if created:
                    created_files.append(created)
            # After generating, offer conversion
            if created_files:
                convert_now = questionary.confirm("Do you want to convert the generated MD files to DOCX now?", default=True).ask()
                if convert_now:
                    subject_dirname = _sanitize_subject(subject_name)
                    default_docs = os.path.expanduser(f"~/college/{subject_dirname}")
                    docx_output_dir = questionary.path(
                        "Enter docs output directory:",
                        default=default_docs
                    ).ask() or default_docs
                    os.makedirs(docx_output_dir, exist_ok=True)
                    convert_md_to_docs(md_input_dir=output_dir, docx_output_dir=docx_output_dir)
    else:
        CONSOLE.print("[bold red]Could not deduce experiments from the text. Please try again or use manual mode.[/bold red]")


def main():
    """Main function to run the interactive CLI."""
    # First, ensure we have the API key.
    get_api_key()

    CONSOLE.print(Panel("Welcome to the Lab File Generator!", title="[bold blue]LabGen[/bold blue]", expand=False))

    while True:
        subject_name = questionary.text("Enter the subject name (e.g., Physics):", qmark="📚").ask()
        if not subject_name:
            break

        # Sanitize subject name to create a safe directory name

        system_instruction = questionary.text(
            "Enter a system instruction for the AI (optional, press Enter to skip):",
            qmark="🤖"
        ).ask()

        output_dir = questionary.path("Enter the output directory for the markdown files:", default=os.path.expanduser(f'~/Documents/{_sanitize_subject(subject_name)}')).ask()
        if not output_dir:
            break
        os.makedirs(output_dir, exist_ok=True)
        CONSOLE.print(f"MD files will be saved in: [bold cyan]{output_dir}[/bold cyan]")
        # ensure we have a sanitized subject dirname for downstream paths
        subject_dirname = _sanitize_subject(subject_name)

        main_choice = questionary.select(
            "Choose an option:",
            choices=[
                questionary.Choice("🤖 Let AI deduce aims from a text blob", "ai"),
                questionary.Choice("✍️  Enter aims manually", "manual"),
                questionary.Choice("📄 Convert existing MD files to DOCX", "convert"),
                questionary.Choice("🚪 Exit", "exit")
            ]
        ).ask()

        if main_choice == "ai":
            ai_deduction_mode(subject_name, system_instruction, output_dir)
        elif main_choice == "manual":
            manual_entry_mode(subject_name, output_dir)
        elif main_choice == "convert":
            # Convert MD files for this subject to DOCX. Ask for base output dir (defaults to ~/college/software-craftsmanship)
            # Default directly to ~/college/<subject_name>
            default_docs = os.path.expanduser(f"~/college/{subject_dirname}")
            docx_output_dir = questionary.path(
                "Enter docs output directory:",
                default=default_docs
            ).ask() or default_docs
            os.makedirs(docx_output_dir, exist_ok=True)
            convert_md_to_docs(md_input_dir=output_dir, docx_output_dir=docx_output_dir)
        elif main_choice == "exit" or not main_choice:
            break
        
        CONSOLE.print("\n" + "="*50 + "\n")

    CONSOLE.print("[bold blue]Goodbye![/bold blue]")

if __name__ == "__main__":
    main()
