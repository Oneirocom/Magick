# Versioning

This project follows the [Semantic Versioning](https://semver.org/) specification.

## Creating a new version

To create a new version of the project, follow these steps:

1. Run the following command in the root of the project.

```
npm run version
```

2. The standard-version tool will automatically:
	- Determine the new version number based on the commit messages
	- Generate a changelog
	- Commit the version update and changelog
	- Create a new git tag for the release

3. Push the changes and the new tag to the remote repository:

```
git push && git push --tags
```

4. ```semantic-release``` will automatically publish the new version to NPM and create a release on GitHub.

**Note**: You will need to configure the `GH_TOKEN` and `NPM_TOKEN` environment variables with your GitHub and NPM access tokens.

Example

```
npm run version

# Output:
# ? Select semver level: patch
# ℹ Running standard-version to update versions, changelogs, and tags ...
# ...
# ℹ Run `git push --follow-tags origin main` to publish.

```

## Release process

eleases are automatically created through CI/CD using Github Actions when a new version is pushed to the main branch. The release notes are automatically generated based on the commit messages since the previous release.
