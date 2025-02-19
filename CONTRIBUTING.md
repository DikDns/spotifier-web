# SPOTifier Contributing Guide

Thank you for your interest in contributing to SPOTifier. Before proceeding, please read the following brief points:

- [SPOTifier Contributing Guide](#spotifier-contributing-guide)
  - [Contributing](#contributing)
  - [Getting Started](#getting-started)
    - [CLI Commands](#cli-commands)
  - [Commit Guidelines](#commit-guidelines)
    - [Commit Message Guidelines](#commit-message-guidelines)
  - [Pull Request Policy](#pull-request-policy)
    - [When Merging](#when-merging)

## Contributing

Every individual is welcome to contribute to SPOTifier. This repository currently has two types of contribution personas:

- **Contributor** is any individual who creates issues/PRs, comments on issues/PRs, or contributes in other ways.

- **Collaborator** is any individual who reviews issues/PRs, manages issues/PRs, or actively contributes in discussions and decision-making in this project.

## Getting Started

The steps below will give you an overview of how to set up your local environment for SPOTifier and the general steps to complete something and submit your contribution.

1. Click the fork button in the top right to copy the [SPOTifier Web Repository](https://github.com/dikdns/spotifier-web/fork)

2. Clone your fork using SSH, GitHub CLI, or HTTPS.

   ```bash
   git clone git@github.com:<NAMA_PENGGUNA_GITHUB_ANDA>/spotifier-web.git # SSH
   git clone https://github.com/<NAMA_PENGGUNA_GITHUB_ANDA>/spotifier-web.git # HTTPS
   gh repo clone <NAMA_PENGGUNA_GITHUB_ANDA>/spotifier-web # GitHub CLI
   ```

3. Change to the spotifier-web directory.

   ```bash
   cd spotifier-web
   ```

   1. **Prerequisites for .env file**: Create a `.env` file in the project root.

   2. Follow the getting started guide at [Turso](https://docs.turso.tech/quickstart) for `DATABASE_AUTH_TOKEN` and `DATABASE_URL`.

      ```bash
      DATABASE_AUTH_TOKEN=
      DATABASE_URL=
      ```

4. Create a remote to keep your fork and local clone up to date.

   ```bash
   git remote add upstream git@github.com:dikdns/spotifier-web.git # SSH
   git remote add upstream https://github.com/dikdns/spotifier-web.git # HTTPS
   gh repo sync dikdns/spotifier-web # GitHub CLI
   ```

5. Create a new branch for your work.

   ```bash
   git checkout -b nama-cabang-anda
   ```

6. Run the following commands to install dependencies and start a local preview of your work.

   ```bash
   npm run db:push # push database schema to Turso
   npm ci # install project dependencies
   npm run dev # start development environment
   ```

7. Make your changes.

8. Merge to sync your current branch with the upstream branch.

   ```bash
   git fetch upstream
   git merge upstream/main
   ```

9. Run `npm run lint` to ensure that linting and formatting are correct.

   ```bash
   npm run lint
   ```

10. Once you're satisfied with your changes, add and commit them to your branch, then push the branch to your fork.

    ```bash
    cd ~/spotifier-web
    git add .
    git commit # Silakan ikuti pedoman commit di bawah ini
    git push -u origin nama-cabang-anda
    ```

    > [!IMPORTANT]\
    > Before committing and opening a Pull Request, please read the [Commit Guidelines](#commit-guidelines) and [Pull Request Policy](#pull-request-policy) explained below.

11. Create a Pull Request.

    > [!NOTE]\
    > We ask PR authors to avoid unnecessarily rebasing/updating their PRs with the base branch (`main`).

### CLI Commands

This repository contains several scripts and commands to perform various tasks. The most relevant commands are described below.

<details>
  <summary>Commands for Running & Building Website</summary>

- `npm run dev` runs the Next.js Local Development Server, listening by default at `http://localhost:3000/`.
- `npm run build` builds the Application in Production mode. The output is by default inside the `.next` folder.
- `npm run start` starts a web server running the content built from `npm run build`

</details>

<details>
  <summary>Commands for Maintenance Tasks and Tests</summary>

- `npm run db:push` - pushes the database schema to Turso.
- `npm run db:studio` - runs drizzle studio for database management.
- `npm run lint` runs the linter for all files.

</details>

## Commit Guidelines

This project follows the [Conventional Commits][]. specification.

Commits must be signed. You can read more about [Signing Commits][] here.

### Commit Message Guidelines

- Commit messages must include a "type" as described in Conventional Commits
- Commit messages must not end with a period `.`

## Pull Request Policy

This policy governs how contributions should be made in this repository. The lines below state the checks and policies that must be followed before merging and when merging.

### When Merging

- - All required Status checks must pass.
- Ensure that all discussions have been resolved.
- [`squash`][] pull requests consisting of multiple commits

[`squash`]: https://help.github.com/en/articles/about-pull-request-merges#squash-and-merge-your-pull-request-commits
[Conventional Commits]: https://www.conventionalcommits.org/
[Signing Commits]: https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits
