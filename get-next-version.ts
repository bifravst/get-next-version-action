import * as semanticRelease from 'semantic-release'
import { WritableStreamBuffer } from 'stream-buffers'
import { writeFileSync, readFileSync } from 'fs'
import os from 'os'

const stdoutBuffer = new WritableStreamBuffer()
const stderrBuffer = new WritableStreamBuffer()

const githubRepository = process.env.GITHUB_REPOSITORY
const branch = process.argv[process.argv.length - 2]
const defaultVersion = process.argv[process.argv.length - 1]

const main = async () => {
	const result = await semanticRelease(
		{
			// Core options
			branch,
			repositoryUrl: `https://github.com/${githubRepository}.git`,
			plugins: ['@semantic-release/commit-analyzer'],
			dryRun: true,
			ci: false,
		},
		{
			cwd: process.cwd(),
			stdout: stdoutBuffer as unknown as NodeJS.WriteStream,
			stderr: stderrBuffer as unknown as NodeJS.WriteStream,
		},
	)

	const outputs = readFileSync(process.env.GITHUB_OUTPUT, 'utf-8')
	if (result !== false) {
		const { nextRelease } = result
		writeFileSync(process.env.GITHUB_OUTPUT, [outputs, `nextRelease=${nextRelease.version}`].join(os.EOL), 'utf-8')
	} else {
		console.error('No new release.')
		process.stderr.write(stdoutBuffer.getContentsAsString('utf8') as string)
		if (stderrBuffer.size() > 0) {
			process.stderr.write(stderrBuffer.getContentsAsString('utf8') as string)
		}
		writeFileSync(process.env.GITHUB_OUTPUT, [outputs, `nextRelease=${defaultVersion}`].join(os.EOL), 'utf-8')
	}
}

void main()
