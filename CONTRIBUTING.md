# Contributing Guidelines

Thank you for contributing! To keep our project history clean and manageable, please follow these guidelines.

## 1. Feature Branch Workflow

We use a standard fork-and-pull model:

1. **Fork** the repository and clone it locally.
2. **Branch** from `main` using a descriptive name: `git checkout -b feature/your-feature`
3. **Commit** your changes (see rules below).
4. **Push** to your fork: `git push origin feature/your-feature`
5. **Open a Pull Request** against our `main` branch.

## 2. One Commit Per Pull Request

To maintain a linear and readable project history, **every Pull Request must contain exactly one commit.**

- If you make multiple commits during development, you must squash them before opening the PR:
  `git rebase -i HEAD~n` (where `n` is the number of commits).
- If you need to sync with `main`, use rebase instead of merge:
  `git pull --rebase origin main`
- If reviewers request changes, amend your single commit and force push:
  `git commit --amend`
  `git push -f origin feature/your-feature`

## 3. Conventional Commits

Your single commit message must follow the [Conventional Commits](https://www.conventionalcommits.org/) standard:

`<type>[optional scope]: <description>`

**Common Types:**

- `feat:` A new feature
- `fix:` A bug fix
- `docs:` Documentation only changes
- `refactor:` Code change that neither fixes a bug nor adds a feature
- `chore:` Maintenance tasks, dependency updates

**Example:**
`feat(auth): add password reset functionality`
