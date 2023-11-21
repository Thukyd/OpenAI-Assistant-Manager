import client from './openai_client'; // Import the initialized OpenAI client
import fs from 'fs/promises'; // File System module with promise support
import { Assistant } from 'openai/resources/beta/assistants/assistants';
import path from 'path';

const configPath = path.join(__dirname, '../config.json'); // Path to the config file


// TODO: Add the update assistant function here
// TODO: The Configs should acutally come fro index.ts and not directly in the create assistant function

/**
 * Reads and parses the configuration file.
 * @returns {Promise<Assistant>} Parsed configuration object from the file.
 * @throws Will throw an error if the file cannot be read or parsed.
 */
async function readConfig(): Promise<Assistant> {
  try {
    const configFile = await fs.readFile(configPath, 'utf-8');
    return JSON.parse(configFile);
  } catch (error) {
    console.error("Error reading config file:", error);
    throw error;
  }
}

/**
 * Writes the assistant configuration to a file.
 * @param {Assistant} configData - The configuration data to write to the file.
 * @returns {Promise<void>}
 */
async function writeConfig(configData: Assistant): Promise<void> {
  await fs.writeFile(configPath, JSON.stringify(configData, null, 2));
}

/**
 * Initializes the assistant by reading the existing configuration from a file, or
 * creating a new assistant if the configuration file does not exist or cannot be read.
 * It also checks if the existing assistant is up to date and handles any necessary updates.
 *
 * @returns {Promise<Assistant>} The initialized assistant object.
 * @throws Will throw an error if the assistant cannot be initialized.
 */
async function initializeAssistant(): Promise<Assistant> {
  let assistant: Assistant;

  // Try to read local configs from file the configuration file
  try {
    assistant = await readConfig();
    // TODO: add here the check if the assistant is still up to date
  }
  catch (error) {
    // If config file doesn't exist or can't be read, create a new assistant
    console.log("\nConfig file does not exist or can't be read. Creating a new assistant...\n\n");
    assistant = await createAssistant();

    // Persist assistant data in a config file
    await writeConfig(assistant);
  }

  return assistant;
}


/**
 * Creates a new assistant using the OpenAI API.
 * @returns {Promise<Assistant>} The newly created assistant object.
 * @throws Will throw an error if the assistant cannot be created.
 */
async function createAssistant(): Promise<Assistant> {
  try {
    const assistant = await client.beta.assistants.create({
      name: "Red Dead Redemption 2 - Poker Assistant",
      instructions: "You are an AI assistant that analyzes screenshots from Red Dead Redemption 2 poker games...",
      model: "gpt-4-1106-preview",
      tools: [{ "type": "code_interpreter" }],
    });
    console.log("Assistant created with ID:", assistant.id);

    // Save the full configuration to the config file
    await writeConfig(assistant);

    return assistant;
  } catch (error) {
    console.error("Error creating assistant:", error);
    throw error;
  }
}


export default initializeAssistant;