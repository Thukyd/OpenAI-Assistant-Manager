import client from './openai_client'; // Import the initialized OpenAI client
import fs from 'fs/promises'; // File System module with promise support
import { Assistant, AssistantCreateParams, AssistantUpdateParams } from 'openai/resources/beta/assistants/assistants';
import path from 'path'; // Path module for working with file paths
import deepEqual from 'fast-deep-equal'; // Fast deep equality check for objects and arrays

const configPath = path.join(__dirname, '../config.json'); // Path to the config file

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
 * Checks if the local config settings are the same as the provided params.
 * @param {Assistant} localConfig - The local assistant configuration.
 * @param {AssistantCreateParams} params - The params to compare to the local config.
 * @returns {boolean} True if the local config is the same as the provided params, false otherwise.
 */
function areConfigsEqual(localConfig: any, params: any): boolean {
  // List of fields to compare
  const fieldsToCompare = ['name', 'description', 'instructions', 'model', 'tools', 'file_ids', 'metadata'];

  for (const field of fieldsToCompare) {
      // Handling null and empty string as equivalent
      if (localConfig[field] === null && params[field] === "") continue;
      if (localConfig[field] === "" && params[field] === null) continue;

      // Deep equality check for objects or arrays (like 'tools', 'file_ids', and 'metadata')
      if (typeof localConfig[field] === 'object' || Array.isArray(localConfig[field])) {
          if (!deepEqual(localConfig[field], params[field])) {
              return false;
          }
      }
      // Direct comparison for other types
      else if (localConfig[field] !== params[field]) {
          return false;
      }
  }

  return true;
}

/**
 * Creates a new assistant using the OpenAI API with provided configuration settings.
 * @param {AssistantCreateParams} assistantConfigs - Configuration settings for creating a new assistant.
 * @returns {Promise<Assistant>} The newly created assistant object.
 * @throws {Error} Will throw an error if the assistant cannot be created, including network or API errors.
 */
async function createAssistant(assistantConfigs:AssistantCreateParams): Promise<Assistant> {
  try {
    const assistant = await client.beta.assistants.create(assistantConfigs);
    console.log("Assistant created with ID:", assistant.id);

    // Save the full configuration to the config file
    await writeConfig(assistant);

    return assistant;
  } catch (error) {
    console.error("Error creating assistant:", error);
    throw error;
  }
}

/**
 * Retrieves the assistant with the provided ID from the OpenAI API.
 * @param id 
 * @returns 
 */
async function retrieveRemoteAssistant(id: string): Promise<Assistant> {
  let assistant: Assistant;
  try {
    assistant = await client.beta.assistants.retrieve(id);
    console.log("Retrieving assistant...");
  }
  catch (error) {
    console.error("Error retrieving assistant:", error);
    throw error;
  }
  return assistant
}

/**
 * Updates the assistant with the provided configuration settings.
 * @param assistant 
 * @param config 
 * @returns 
 */
async function updateAssistant(assistant: Assistant, config: AssistantUpdateParams): Promise<Assistant> {
  try {
    assistant = await client.beta.assistants.update(assistant.id, config);
    console.log("Updating assistant...");
  }
  catch (error) {
    console.error("Error updating assistant:", error);
    throw error;
  }
  return assistant;
}

/**
 * Initializes the assistant by loading the remote configs and if these are still up to date.
 * If there are no local configs saved in a config file, it will create a new assistant.
 * @param {AssistantCreateParams} assistantConfigs - Configuration settings for the assistant.
 * @returns {Promise<Assistant>} The initialized assistant object.
 * @throws {Error} Will throw an error if the assistant cannot be initialized, including network or API errors.
 */
async function initializeAssistant(assistantConfigs:AssistantCreateParams): Promise<Assistant> {
  let assistant: Assistant;

  // Does the assistant exist (i.e. is there a config file)?
  try {
    assistant = await readConfig();
    // use the assistant id to retrieve the remote assistant
    assistant = await retrieveRemoteAssistant(assistant.id);

    // Is assistant up to date (i.e. are config params same as remote assistant)?
    if(!areConfigsEqual(assistantConfigs, assistant)) {
      // They are not the same, so update the assistant
      console.log("The assistant on OpenAi is not up to date. Updating the assistant...");
      assistant = await updateAssistant(assistant, assistantConfigs);
    }
      
  }
  // No conifg file exists, so create a new assistant
  catch (error) {
    console.log("\nConfig file does not exist or can't be read. Creating a new assistant...\n\n");
    assistant = await createAssistant(assistantConfigs);
  }
  // Persist assistant data in a config file
  await writeConfig(assistant);

  return assistant;
}

export default initializeAssistant;