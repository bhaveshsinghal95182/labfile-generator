# Lab Report Generator - TODO List (Revised)

This document outlines the plan to build the web application, prioritizing the replication of the existing CLI features first, and then expanding to the advanced report generator.

---

## Part 1: Replicate Core CLI Functionality in the Web App

**Goal:** Bring all the features of the Python CLI tool to the web interface.

-   [ x ] **1. Project Setup:**
    -   [ x ] Ensure all `pnpm` dependencies are installed in the `www` directory.
    -   [ x ] Set up environment variables for the web app (e.g., `GOOGLE_API_KEY` in a `.env.local` file).

-   [ ] **2. AI-Powered Aim Extraction:**
    -   [ ] Create a new API route in Next.js (e.g., `src/app/api/extract/route.ts`) to handle the AI logic.
    -   [ ] In this API route, use a Google Generative AI library for Node.js (like `@google/generative-ai`) to replicate the "extract aims from text" functionality.
    -   [ ] Create a UI component with a `textarea` for users to paste a blob of text and a button to call the new API route.
    -   [ ] Display the extracted aims to the user.

-   [ ] **3. Markdown Generation:**
    -   [ ] Create a UI for manually adding/editing the aims and experiment numbers (as an alternative to the AI extraction).
    -   [ ] Implement the logic to generate a structured Markdown string based on the list of aims, including sections for Aim, Theory, Procedure, etc.

-   [ ] **4. DOCX Conversion & Simple Styling:**
    -   [ ] Install and set up the `mohtasham/md-to-docx` library.
    -   [ ] Build a simple UI for basic styling (e.g., font size and family for headings and paragraphs).
    -   [ ] Implement the logic to convert the generated Markdown to a DOCX file, applying the user's simple style choices.
    -   [ ] Add a "Download" button.

---

## Part 2: Advanced Report Generator Features

**Goal:** Expand the application into a full-featured report builder.

-   [ ] **5. Multi-Page Report Structure:**
    -   [ ] Create a UI to define a report structure with multiple chapters/sections.
    -   [ ] Allow users to add content for each section.
    -   [ ] Update the generation logic to combine all sections into a single report.

-   [ ] **6. Cover Page Designer:**
    -   [ ] Build a dedicated UI for designing a cover page with titles, authors, logos, etc.
    -   [ ] Integrate the cover page into the final DOCX document.

-   [ ] **7. Save/Load Functionality:**
    -   [ ] Implement features to save a report's structure and style settings as a reusable template.
    -   [ ] Implement a feature to load a saved template.

---