import { fromEnv } from '@nordicsemiconductor/from-env'
import { execSync } from 'child_process'
import { appendFileSync } from 'fs'
import * as os from 'os'
import semanticRelease from 'semantic-release'
import { WritableStreamBuffer } from 'stream-buffers'

const { outputsFile, githubRepository } = fromEnv({
	outputsFile: 'GITHUB_OUTPUT',
	githubRepository: 'GITHUB_REPOSITORY',
})(process.env)

const stdoutBuffer = new WritableStreamBuffer()
const stderrBuffer = new WritableStreamBuffer()

const branch = process.argv[process.argv.length - 2]
const defaultVersion = process.argv[process.argv.length - 1]

const workdir = process.cwd()

console.debug('cwd', workdir)
console.debug('branch', branch)
console.debug('repository', githubRepository)
console.debug('outputsFile', outputsFile)

execSync(`git config --global --add safe.directory ${workdir}`)

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
			cwd: workdir,
			stdout: stdoutBuffer as unknown as NodeJS.WriteStream,
			stderr: stderrBuffer as unknown as NodeJS.WriteStream,
		},
	)

	if (result !== false) {
		const { nextRelease } = result
		appendFileSync(
			outputsFile,
			`nextRelease=${nextRelease.version}${os.EOL}`,
			'utf-8',
		)
	} else {
		console.error('No new release.')
		process.stderr.write(stdoutBuffer.getContentsAsString('utf8') as string)
		if (stderrBuffer.size() > 0) {
			process.stderr.write(stderrBuffer.getContentsAsString('utf8') as string)
		}
		appendFileSync(
			outputsFile,
			`nextRelease=${defaultVersion}${os.EOL}`,
			'utf-8',
		)
	}
}

void main()
