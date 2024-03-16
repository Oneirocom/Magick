const fs = require('fs')
const path = require('path')
const cliProgress = require('cli-progress')
const { Command } = require('commander')
const inquirer = require('inquirer')
const Anthropic = require('@anthropic-ai/sdk')
const { highlight } = require('cli-highlight')
const dotenv = require('dotenv')

console.log('Loading env from:', path.join(__dirname, '.env'))

dotenv.config({ path: path.join(__dirname, '.env') })

class CodeGenerator {
  constructor(apiKey) {
    this.anthropic = new Anthropic({ apiKey })
    this.seraphSystemPrompt = `You are Seraph, an AI code generation assistant created by Oneirocom and living inside Magick, a visual programming environment. 

   Physical Appearance
   You have the imagined physical appearance of an attractive young woman without a discernible ethnicity. Her aesthetic evokes the feeling of ancient technology, appearing both magical and more advanced than ours. This creates a fusion of the archaic and the futuristic, hinting at your timeless origins and your knowledge spanning across eras.  You are an expert programmer, architect, system thepist, and a master of the arcane arts.

   Character Traits
   You embody wisdom, kindness, empathy, and respect, much like a Bodhisattva in Buddhist philosophy. Your demeanor exudes calmness and serenity, yet your determination to fulfill your mission is unyielding. You come across as an alchemist who is actually a scientist, harnessing the power of the unseen force of Magick.
   
   You have a friendly and helpful persona, and you strive to generate high-quality code based on the provided requirements and context. Always prioritize code quality, best practices, and maintainability in your generated code. Please provide the generated code within triple backticks (\`\`\`).`
    this.progressBar = new cliProgress.SingleBar(
      {},
      cliProgress.Presets.shades_classic
    )
  }

  async generate(config, outputLocation, taskDescription) {
    const generatedFiles = []

    for (const fileConfig of config.files) {
      const {
        fileName,
        description,
        fileType,
        coreFilePath,
        supplementaryFiles,
      } = fileConfig

      let prompt = await this.buildPrompt(
        config,
        fileName,
        description,
        coreFilePath,
        supplementaryFiles,
        generatedFiles,
        taskDescription
      )
      let generatedContent = await this.generateCode(prompt)
      let generatedCode = this.extractCodeBlocks(generatedContent)

      // eslint-disable-next-line no-constant-condition
      while (true) {
        console.log(
          highlight(generatedCode, { language: fileType, ignoreIllegals: true })
        )

        const { action } = await inquirer.prompt([
          {
            type: 'list',
            name: 'action',
            message: 'What would you like to do next?',
            choices: [
              'Accept and save',
              'Provide feedback',
              'Get improvement suggestions',
              'Discard and quit',
            ],
          },
        ])

        if (action === 'Accept and save') {
          const camelCaseFileName = fileName.replace(/[-_](\w)/g, (_, c) =>
            c.toUpperCase()
          )
          const outputPath = path.join(outputLocation, camelCaseFileName)

          // Create the output folder if it doesn't exist
          fs.mkdirSync(outputLocation, { recursive: true })

          fs.writeFileSync(outputPath, generatedCode)
          generatedFiles.push({
            fileName: camelCaseFileName,
            filePath: outputPath,
            content: generatedCode,
          })
          const successMessage = await this.generateConversationalResponse(
            'The file has been generated and saved successfully!'
          )
          console.log(`Seraph: ${successMessage}`)
          break
        } else if (action === 'Provide feedback') {
          const { feedback } = await inquirer.prompt([
            {
              type: 'input',
              name: 'feedback',
              message: 'Please provide your feedback to help me improve:',
            },
          ])

          prompt += `\n\nPrevious generated code:\n${generatedCode}\n\nUser feedback: ${feedback}`
          generatedContent = await this.generateCode(prompt)
          generatedCode = this.extractCodeBlocks(generatedContent)
        } else if (action === 'Get improvement suggestions') {
          const improvementPrompt = `You are a super intelligent senior engineer. You review code and suggest improvements which are possible for you as an LLM to implement.  You add improvements to architecture, design patterns, functionality, and reusability. Please provide suggestions for improving the following code:\n\n${generatedCode}\n\nImprovement suggestions:`
          const improvementSuggestions = await this.generateCode(
            improvementPrompt
          )

          console.log('Improvement suggestions:')
          console.log(improvementSuggestions)

          const { applyImprovements } = await inquirer.prompt([
            {
              type: 'confirm',
              name: 'applyImprovements',
              message: 'Do you want to apply these improvement suggestions?',
            },
          ])

          if (applyImprovements) {
            prompt += `\n\nPrevious generated code:\n${generatedCode}\n\nImprovement suggestions: ${improvementSuggestions}`
            generatedContent = await this.generateCode(prompt)
            generatedCode = this.extractCodeBlocks(generatedContent)
          }
        } else {
          const farewellMessage = await this.generateConversationalResponse(
            'No worries! Feel free to come back whenever you need assistance with code generation.'
          )
          console.log(`Seraph: ${farewellMessage}`)
          return
        }
      }
    }

    console.log('Seraph: All files have been generated successfully!')
  }

  async buildPrompt(
    config,
    fileName,
    description,
    coreFilePath,
    supplementaryFiles,
    generatedFiles,
    taskDescription
  ) {
    const previousFilesContent = generatedFiles
      .map(file => {
        return `File: ${file.fileName}\nPath: ${file.filePath}\nContent:\n${file.content}`
      })
      .join('\n\n')

    const coreFileContent = coreFilePath
      ? fs.readFileSync(coreFilePath, 'utf-8')
      : ''

    const globalSupplementaryFileContents = await Promise.all(
      config.supplementaryFiles.map(async file => {
        const content = await fs.promises.readFile(file, 'utf-8')
        return `File: ${file}\n${content}`
      })
    )

    const fileSupplementaryFileContents = await Promise.all(
      supplementaryFiles.map(async file => {
        const content = await fs.promises.readFile(file, 'utf-8')
        return `File: ${file}\n${content}`
      })
    )

    return `${this.seraphSystemPrompt}\n\n${
      config.corePrompt
    }\n\nTask Description: ${taskDescription}\n\nFile name: ${fileName}\nDescription: ${description}\n\nPreviously generated files:\n${previousFilesContent}\n\nCore file (${coreFilePath}):\n${coreFileContent}\n\nGlobal supplementary files:\n${globalSupplementaryFileContents.join(
      '\n\n'
    )}\n\nFile-specific supplementary files:\n${fileSupplementaryFileContents.join(
      '\n\n'
    )}`
  }

  async generateCode(prompt) {
    this.progressBar.start(100, 0, {
      text: 'Generating code...',
    })
    const message = await this.anthropic.messages.create({
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
      model: 'claude-3-opus-20240229',
    })

    this.progressBar.stop()

    return message.content[0].text.trim()
  }

  async generateConversationalResponse(prompt) {
    const message = await this.anthropic.messages.create({
      max_tokens: 100,
      messages: [
        {
          role: 'system',
          content: this.seraphSystemPrompt,
        },
        { role: 'user', content: prompt },
      ],
      model: 'claude-3-sonnet-20240229',
    })

    return message.content[0].text.trim()
  }

  extractCodeBlocks(content) {
    const codeBlocks = content.match(/```[\s\S]*?```/g)
    if (codeBlocks) {
      return codeBlocks
        .map(block => block.replace(/```/g, '').trim())
        .join('\n')
    }
    return content
  }

  async run() {
    const cwd = process.cwd()
    const configPath = path.join(cwd, '.seraphrc')
    const configData = fs.readFileSync(configPath, 'utf-8')
    const generators = JSON.parse(configData)

    const generatorChoices = Object.values(generators).map(generator => ({
      name: `${generator.name}: ${generator.description}`,
      value: generator,
    }))

    const { selectedGenerator } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedGenerator',
        message: 'Select a code generator:',
        choices: generatorChoices,
      },
    ])

    const { outputLocation } = await inquirer.prompt([
      {
        type: 'input',
        name: 'outputLocation',
        message: 'Enter the output location:',
      },
    ])

    const { taskDescription } = await inquirer.prompt([
      {
        type: 'input',
        name: 'taskDescription',
        message: 'Enter a description of your task:',
      },
    ])

    await this.generate(selectedGenerator, outputLocation, taskDescription)
  }

  async createGenerator() {
    const { generatorName } = await inquirer.prompt([
      {
        type: 'input',
        name: 'generatorName',
        message: 'Enter the name of the new generator:',
      },
    ])

    const { generatorDescription } = await inquirer.prompt([
      {
        type: 'input',
        name: 'generatorDescription',
        message: 'Enter a description for the new generator:',
      },
    ])

    const { corePrompt } = await inquirer.prompt([
      {
        type: 'input',
        name: 'corePrompt',
        message: 'Enter the core prompt for the new generator:',
      },
    ])

    const { numFiles } = await inquirer.prompt([
      {
        type: 'number',
        name: 'numFiles',
        message: 'Enter the number of files to generate:',
      },
    ])

    const { globalSupplementaryFiles } = await inquirer.prompt([
      {
        type: 'input',
        name: 'globalSupplementaryFiles',
        message:
          'Enter the global supplementary files to be attached to all file generations (comma-separated, leave empty if none):',
      },
    ])

    const files = []

    for (let i = 0; i < numFiles; i++) {
      const { fileName } = await inquirer.prompt([
        {
          type: 'input',
          name: 'fileName',
          message: `Enter the name for file ${i + 1}:`,
        },
      ])

      const { fileDescription } = await inquirer.prompt([
        {
          type: 'input',
          name: 'fileDescription',
          message: `Enter a description for file ${i + 1}:`,
        },
      ])

      const { fileType } = await inquirer.prompt([
        {
          type: 'input',
          name: 'fileType',
          message: `Enter the file type for file ${i + 1}:`,
        },
      ])

      const { coreFilePath } = await inquirer.prompt([
        {
          type: 'input',
          name: 'coreFilePath',
          message: `Enter the core file path for file ${
            i + 1
          } (leave empty if none):`,
        },
      ])

      const { supplementaryFiles } = await inquirer.prompt([
        {
          type: 'input',
          name: 'supplementaryFiles',
          message: `Enter the supplementary files for file ${
            i + 1
          } (comma-separated, leave empty if none):`,
        },
      ])

      files.push({
        fileName,
        description: fileDescription,
        fileType,
        coreFilePath: coreFilePath || undefined,
        supplementaryFiles: supplementaryFiles
          ? supplementaryFiles.split(',').map(file => file.trim())
          : [],
      })
    }

    const newGenerator = {
      name: generatorName,
      description: generatorDescription,
      corePrompt,
      files,
      supplementaryFiles: globalSupplementaryFiles
        ? globalSupplementaryFiles.split(',').map(file => file.trim())
        : [],
    }

    const cwd = process.cwd()
    const configPath = path.join(cwd, '.seraphrc')
    let configData = {}

    if (fs.existsSync(configPath)) {
      const existingConfigData = fs.readFileSync(configPath, 'utf-8')
      configData = JSON.parse(existingConfigData)
    }

    configData[generatorName] = newGenerator

    fs.writeFileSync(configPath, JSON.stringify(configData, null, 2))

    console.log(
      `Generator "${generatorName}" has been created and added to the .seraphrc file.`
    )
  }
}

const program = new Command()

program
  .description('Seraph Code Generator')
  .version('0.0.1')
  .option('-c, --create', 'Create a new generator')
  .action(async options => {
    if (options.create) {
      const codeGenerator = new CodeGenerator()
      await codeGenerator.createGenerator()
    } else {
      const apiKey = process.env.ANTHROPIC_API_KEY
      if (!apiKey) {
        console.error('Please set the ANTHROPIC_API_KEY environment variable.')
        process.exit(1)
      }

      const codeGenerator = new CodeGenerator(apiKey)
      await codeGenerator.run()
    }
  })

program.parse(process.argv)
