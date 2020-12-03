const exec = require("@actions/exec");
const github = require("@actions/github");
const core = require("@actions/core");

const githubToken = core.getInput("githubToken");
const octokit = github.getOctokit(githubToken);

(async function main() {

	const branchName = "docs/update-typed-docs";
	// create new branch for PR
	await exec.exec("git", ["checkout", "-b", `${branchName}`]);
	// Check if the action's branch exists on the remote (exit code 0) or not (exit code 2)
	const exists = !(await exec.exec("git", ["ls-remote", "--exit-code", "--heads", "https://github.com/zwave-js/node-zwave-js.git", branchName], {
		ignoreReturnCode: true
	}));

	if (exists) {
		// point the local branch to the remote branch
		await exec.exec("git", ["branch", "-u", `origin/${branchName}`]);
	}

	// Would the real Al Calzone please stand up?
	await exec.exec("git", ["config", "--global", "user.email", "d.griesel@gmx.net"]);
	await exec.exec("git", ["config", "--global", "user.name", "Al Calzone"]);
	
	// Create a commit
	await exec.exec("git", ["add", "."]);
	await exec.exec("git", ["commit", "-m", "docs: update typed documentation"]);

	// And push it (real good)
	if (exists) {
		await exec.exec("git", ["push", "-f"]);
	} else {
		await exec.exec("git", ["push", "--set-upstream", "origin", branchName]);
	}

	// Find a matching PR
	const PRs = await octokit.pulls.list({
		owner: "zwave-js",
		repo: "node-zwave-js",
		state: "open",
		head: `zwave-js:${branchName}`,
	});
	console.dir(PRs);
	const firstPR = PRs.data[0];
	const currentId = firstPR && firstPR.id;
	if (!currentId) {
		console.log(`creating new PR...`);
		// no PR exists, create one
		await octokit.pulls.create({
			owner: "zwave-js",
			repo: "node-zwave-js",
			head: branchName,
			base: "master",
			title: "docs: update typed documentation 🤖",
			body: `The auto-generated documentation has changed. Please review the changes and merge them if desired.`
		});
	}
})().catch(e => {
	console.error(e);
	process.exit(1);
});
