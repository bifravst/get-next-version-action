import * as semanticRelease from 'semantic-release'
import { WritableStreamBuffer } from 'stream-buffers'

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
			stdout: (stdoutBuffer as unknown) as NodeJS.WriteStream,
			stderr: (stderrBuffer as unknown) as NodeJS.WriteStream,
		},
	)

	if (result !== false) {
		const { nextRelease } = result
		console.log(`::set-output name=nextRelease::${nextRelease.version}`)
	} else {
		console.error('No new release.')
		process.stderr.write(stdoutBuffer.getContentsAsString('utf8') as string)
		if (stderrBuffer.size() > 0) {
			process.stderr.write(stderrBuffer.getContentsAsString('utf8') as string)
		}
		console.log(`::set-output name=nextRelease::${defaultVersion}`)
	}
}

void main()
