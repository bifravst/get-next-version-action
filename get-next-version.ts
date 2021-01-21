import * as semanticRelease from 'semantic-release'
import { WritableStreamBuffer } from 'stream-buffers'
import { getInput, setOutput } from '@actions/core'
const getRequiredInput = (input: string) => getInput(input, { required: true })

const stdoutBuffer = new WritableStreamBuffer()
const stderrBuffer = new WritableStreamBuffer()

const main = async () => {
	const result = await semanticRelease(
		{
			// Core options
			branch: getRequiredInput('branch'),
			repositoryUrl: getRequiredInput('repositoryUrl'),
			plugins: ['@semantic-release/commit-analyzer'],
			dryRun: true,
			ci: false,
		},
		{
			cwd: process.cwd(),
			stdout: (stdoutBuffer as unknown) as NodeJS.WriteStream,
			stderr: (stderrBuffer as unknown) as NodeJS.WriteStream,
		},
	)

	if (result) {
		const { nextRelease } = result
		setOutput('nextRelease', nextRelease.version)
	} else {
		console.error('No new release.')
		process.stderr.write(stdoutBuffer.getContentsAsString('utf8') as string)
		if (stderrBuffer.size() > 0) {
			process.stderr.write(stderrBuffer.getContentsAsString('utf8') as string)
		}
		setOutput('nextRelease', getRequiredInput('defaultVersion'))
	}
}

main()
