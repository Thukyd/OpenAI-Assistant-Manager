import client from './openai_client'; // Import the initialized OpenAI client
import fs from 'fs/promises'; // File System module with promise support
import path from 'path';

const configPath = path.join(__dirname, '../config.json'); // Path to the config file


/**
 * TODO: Add JSDoc comments
 * TODO: Give the handover the setup descriptions as name, instructions, model, tools etc. as param from index.ts
 * TODO: Add functionality to check if the assistant is still up to date. If not it should be handled in a update assistant module function.
 */

// Define a type for the local assistant configuration
type AssistantConfig = {
  assistantId?: string;
  name?: string | null;
  instructions?: string | null;
  model?: string | null;
  tools?: AssistantTool[] | null;
};

// Define a type for the assistant's tool configuration
type AssistantTool = {
  type: string;
};

// Define a type for the assistant object
type Assistant = {
  id: string;
  name?: string | null;
  instructions?: string | null;
  model?: string | null;
  tools?: AssistantTool[] | null;
};

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
 * Initializes the assistant by checking for an existing configuration or creating a new assistant.
 * 
 * This function performs the following steps:
 * 1. Tries to read an existing configuration file. If successful, it uses the stored assistantId.
 * 2. If the configuration file does not exist or cannot be read (e.g., the file is missing or corrupted),
 *    a new assistant is created using the OpenAI API, and its full configuration is written to the config.json file.
 * 3. If the configuration file exists but does not contain an assistantId (indicating a previous initialization was incomplete),
 *    a new assistant is created. However, only the assistantId is updated in the existing configuration to preserve other settings.
 * 
 * @returns {Promise<string>} The assistant ID. Returns the ID of either the newly created assistant or the one found in the existing configuration.
 * @throws {Error} Throws an error if the assistant cannot be initialized, or if there is a failure in reading or writing the configuration file.
 */
async function initializeAssistant(): Promise<string> {
  let config: AssistantConfig;

  try {
    // Attempt to read the existing config
    config = await readConfig();
  } catch (error) {
    // If config file doesn't exist or can't be read, create a new assistant
    console.log("Config file does not exist or can't be read. Creating a new assistant...");
    const assistant = await createAssistant();

    // Write the complete configuration for the new assistant
    const configData: AssistantConfig = {
      assistantId: assistant.id,
      name: assistant.name,
      instructions: assistant.instructions,
      model: assistant.model,
      tools: assistant.tools,
    };

    await writeConfig(configData);
    return assistant.id;
  }

  if (!config.assistantId) {
    // If assistantId is not found in the config, create a new assistant
    console.log("Assistant ID not found in config. Creating a new assistant...");
    const assistant = await createAssistant();

    // Update the existing config with the new assistantId
    config = { ...config, assistantId: assistant.id };
    await writeConfig(config);
    return assistant.id;
  }

  // If assistantId is found, use the existing assistant
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
      instructions: "You are an AI assistant that analyzes screenshots from Red Dead Redemption 2 poker games...",
      model: "gpt-4-1106-preview",
      tools: [{ "type": "code_interpreter" }],
    });
    console.log("Assistant created with ID:", assistant.id);

    // New code: Create a config object with all necessary details
    const configData: AssistantConfig = {
      assistantId: assistant.id,
      name: assistant.name,
      instructions: assistant.instructions,
      model: assistant.model,
      tools: assistant.tools,
    };

    // Save the full configuration to the config file
    await writeConfig(configData);

    return assistant;
  } catch (error) {
    console.error("Error creating assistant:", error);
    throw error;
  }
}


export default initializeAssistant;