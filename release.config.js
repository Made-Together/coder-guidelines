/**
 * @type {import('semantic-release').GlobalConfig}
 */
module.exports = {
	branches: ["master"],

	plugins: [
		"@semantic-release/commit-analyzer",
		"@semantic-release/release-notes-generator",
		"@semantic-release/changelog",
		[
			"@semantic-release/git",
			{
				assets: ["CHANGELOG.md", "package.json"],
				message: "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}", // eslint-disable-line no-template-curly-in-string
			},
		],
		"@semantic-release/github",
	],
	preset: "conventionalcommits",
	tagFormat: "v${version}", // eslint-disable-line no-template-curly-in-string
};
