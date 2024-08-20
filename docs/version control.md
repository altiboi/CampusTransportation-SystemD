Version Control Processes

Branching:

Main Branch (main or master): This is the stable branch containing our deployed production code. Merges into this branch should be thoroughly tested and reviewed.

Development Branch (develop): This branch is where the latest development work is integrated, tested and reviewed. This is the base for all feature branches.

Feature Branches (feature/feature-name): These branches are created for each new application feature or enhancement. Naming conventions should be consistent (e.g., feature/map-enhancement).

Bugfix Branches (bugfix/bug-name): Created for urgent fixes required in the deployed production code. After the fix is applied, the branch is merged back into main and develop.

Pull Requests:

PR Etiquette: Try to ensure that every PR includes a description, issue references, testing instructions, and any dependencies.

Code Reviews: All PRs should be reviewed by at least one other developer/team memeber. Contact team members to review pull requests, and only in dire circumstances can a merge be made without review.

Automated Tests: Integrated CI/CD pipelines will automatically run tests on every PR. This ensures that new code doesn’t break existing functionality. These CI/CD piplines can be updated as the codebase grows but must not cause unnecessary errors.

Commit Messages:

Use Conventional Commits: We must try to follow a standardized format for commit messages (e.g., feature: add map integration, fix: resolve navigation bug).

Atomic Commits: Make small, focused commits that do one thing well. This makes it easier to track changes and allow us to roll back if necessary.

Git Commands:

**NB** The Source Control tab in VS Code and VS Code Extensions for GitHub make this a lot easier as they make relevant suggestions

1. Repository Cloning
git clone <repository-url>: Clone the repository from Github to your local machine.

2. Git Configuration
git config --global user.name "Your Name": Set the global username for Git commits.
git config --global user.email "your.email@example.com": Set the global email address for Git commits.
git config --global core.editor "code --wait": Set VS Code (or another editor) as the default Git editor.

3. Branch Management
git branch: List all branches in the repository.
git branch <branch-name>: Create a new branch.
git checkout <branch-name>: Switch to an existing branch.
git checkout -b <branch-name>: Create a new branch and switch to it.
git branch -d <branch-name>: Delete a branch locally.
git push origin --delete <branch-name>: Delete a branch remotely.

4. Commit Workflow
git status: Check the status of your working directory (e.g., changes to be committed, untracked files).
git add <file-or-directory>: Stage changes (files or directories) for the next commit.
git add .: Stage all changes in the current directory for the next commit.
git commit -m "commit message": Commit staged changes with a descriptive message.
git commit --amend -m "new commit message": Amend the last commit with a new message.

5. Pulling & Pushing Changes
git pull: Fetch and merge changes from the remote repository into your current branch.
git pull --rebase: Fetch changes from the remote repository and rebase your commits on top of them.
git push origin <branch-name>: Push your branch to the remote repository.

6. Merging & Rebasing
git merge <branch-name>: Merge a branch into your current branch.
git rebase <branch-name>: Reapply your commits on top of another branch’s history.
git rebase --continue: Continue the rebase process after resolving conflicts.
git rebase --abort: Abort the rebase process and return to the original state.

7. Stashing & Restoring Changes
git stash: Stash (temporarily save) changes in your working directory that aren’t ready to be committed.
git stash apply: Reapply the most recently stashed changes.
git stash pop: Reapply the most recently stashed changes and remove them from the stash list.
git stash list: List all stashed changes.

8. Viewing Commit History
git log: View the commit history for the current branch.
git log --oneline: View the commit history with one line per commit.
git log --graph --decorate --oneline: View a graphical representation of the commit history.

9. Working with Remote Repositories
git remote -v: List remote repositories and their URLs.
git remote add <name> <url>: Add a new remote repository.
git fetch <remote>: Download objects and refs from another repository.
git push <remote> <branch>: Push changes from your local branch to a remote branch.

10. Resolving Conflicts
git diff: Show changes between commits, commit and working tree, etc.
git diff <branch1> <branch2>: Compare the differences between two branches.
git mergetool: Use a merge tool to resolve merge conflicts.
git reset --hard <commit-hash>: Reset your current branch to a specific commit, discarding all changes.
git reset <commit-hash>: Reset your current branch to a specific commit, keeping changes in your working directory.

11. Tagging Releases
git tag <tag-name>: Create a new tag for the current commit.
git tag -a <tag-name> -m "message": Create an annotated tag with a message.
git push origin <tag-name>: Push the tag to the remote repository.

12. Undoing Changes
git checkout -- <file>: Discard changes in a specific file.
git reset HEAD <file>: Unstage a file without discarding changes.
git revert <commit>: Revert a specific commit, creating a new commit that undoes the changes.

13. Checking and Comparing
git show <commit>: Show various types of objects (e.g., commits, tags).
git diff <commit1> <commit2>: Show the difference between two commits.
git blame <file>: Show who made changes to each line in a file and when.