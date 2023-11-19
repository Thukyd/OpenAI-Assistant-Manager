import client from './openai_client'; // Import the initialized OpenAI client
import fs from 'fs/promises'; // File System module with promise support
import path from 'path';

/**
 * Types for configuration and assistant structures for better type checking.
 */
type AssistantConfig = {
  assistantId?: string;
};

type Assistant = {
  id: string;
};

const configPath = path.join(__dirname, '../config.json'); // Path to the config file

/**
 * Reads and parses the configuration file.
 * @returns {Promise<AssistantConfig>} Parsed configuration object from the file.
 * @throws Will throw an error if the file cannot be read or parsed.
 */
async function readConfig(): Promise<AssistantConfig> {
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
 * @param {AssistantConfig} configData - The configuration data to write to the file.
 * @returns {Promise<void>}
 */
async function writeConfig(configData: AssistantConfig): Promise<void> {
  await fs.writeFile(configPath, JSON.stringify(configData, null, 2));
}

/**
 * Initializes the assistant by checking for an existing config or creating a new assistant.
 * @returns {Promise<string>} The assistant ID.
 * @throws Will throw an error if the assistant cannot be initialized.
 */
async function initializeAssistant(): Promise<string> {
  let config: AssistantConfig;

  try {
    config = await readConfig();
  } catch (error) {
    // Config file does not exist or can't be read, so we'll create a new assistant.
    console.log("Config file does not exist. Creating a new assistant...");
    const assistant = await createAssistant();
    await writeConfig({ assistantId: assistant.id });
    return assistant.id;
  }

  if (!config.assistantId) {
    console.log("Assistant ID not found in config. Creating a new assistant...");
    const assistant = await createAssistant();
    await writeConfig({ ...config, assistantId: assistant.id });
    return assistant.id;
  }

  console.log("Assistant ID found in config. Using existing assistant...");
  return config.assistantId;
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
      instructions: "You are an AI assistant that analyzes screenshots from Red Dead Redemption 2 poker games. Your task is to evaluate the current game situation from these images, offering strategic advice on poker hands and betting tactics. You educate players on evaluating cards and understanding game dynamics, guiding them towards making smart decisions. Your goal is to progressively teach players so they can eventually master poker strategy on their own.",
      model: "gpt-4-1106-preview",
      tools: [{ "type": "code_interpreter" }],
    });
    console.log("Assistant created with ID:", assistant.id);
    return assistant;
  } catch (error) {
    console.error("Error creating assistant:", error);
    throw error;
  }
}

export default initializeAssistant;
