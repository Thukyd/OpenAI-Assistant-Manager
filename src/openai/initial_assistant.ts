import client from './openai_client'; // Import the initialized OpenAI client
import fs from 'fs/promises'; // File System module with promise support
import { Assistant, AssistantCreateParams } from 'openai/resources/beta/assistants/assistants';
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



/* TODO at a later point: check if local configs & remote configs are the same.
*  The initializeAssistant() only check if an assistant exists
*  and if the config params in code are the same as the local config.
*  This means, if you change something remotely, the local config will not be updated.
*  Maybe you can update the local config quickly before comparing it to the remote config.
*  Might be the cleaner and easier solution.
*   => YES, this is the better solution. 
*/ 


//Currently only checks if the assistant exists

/**
 * Initializes the assistant by reading the existing configuration from a file, or
 * creating a new assistant if the configuration file does not exist or cannot be read.
 * It also checks if the existing assistant is up to date (e.g., model, instructions) and 
 * handles any necessary updates.
 *
 * @param {AssistantCreateParams} assistantConfigs - Configuration settings for the assistant.
 * @returns {Promise<Assistant>} The initialized assistant object.
 * @throws {Error} Will throw an error if the assistant cannot be initialized, including network or API errors.
 */
async function initializeAssistant(assistantConfigs:AssistantCreateParams): Promise<Assistant> {
  let assistant: Assistant;

  // Try to read local configs from file the configuration file
  try {
    // todo: try to update local config with remote config, only then read the config file
    assistant = await readConfig();
    // Check if the config params in code are the same as the local config
    if(!areConfigsEqual(assistantConfigs, assistant)) {
      // They are not the same, so update the assistant
      // TODO: update the assistant - should be part of this module, not in a different one
      console.log("The assistant is not up to date. Updating the assistant...");
    }
      
  }
  catch (error) {
    // If config file doesn't exist or can't be read, create a new assistant
    console.log("\nConfig file does not exist or can't be read. Creating a new assistant...\n\n");
    assistant = await createAssistant(assistantConfigs);

    // Persist assistant data in a config file
    await writeConfig(assistant);
  }

  return assistant;
}


/**
 * Creates a new assistant using the OpenAI API with provided configuration settings.
 *
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


export default initializeAssistant;