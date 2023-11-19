import client from './openai_client'; // Import the initialized OpenAI client
import fs from 'fs/promises'; // File System module with promise support
import path from 'path';


/* TODO: Requirements create an assistant with the following:
*  [X] for the inital assistant there should be a local config file that contains the assistant id and other static information
*  [X] the script should check if the configs exist and take this parameters to change the existing assistant, otherwise create a new one   
*  [ ] the script should be able to upload a file to openai and return the file id
*/


const CONFIG_PATH = path.join(__dirname, '../config.json'); // Path to the config file

/**
 * Reads the configuration file and returns the parsed JSON.
 * @returns {Promise<any>} The parsed configuration object.
 */
async function readConfig(): Promise<any> {
  try {
    const configFile = await fs.readFile(CONFIG_PATH, 'utf-8');
    return JSON.parse(configFile);
  } catch (error) {
    console.error("Error reading config file:", error);
    throw error;
  }
}

/**
 * Writes the configuration object to the config.json file.
 * @param {any} configData - The configuration data to write.
 */
async function writeConfig(configData: any): Promise<void> {
  await fs.writeFile(CONFIG_PATH, JSON.stringify(configData, null, 2));
}

/**
 * Initializes the assistant by either fetching the existing one or creating a new one.
 * @returns {Promise<string>} The assistant ID.
 */
async function initialize_assistant(): Promise<string> {
  try {
    let config;
    try {
      config = await readConfig();
    } catch (error) {
      // If reading config fails, it likely doesn't exist, so we'll create a new assistant.
      console.log("Config file does not exist. Creating a new assistant...");
      const assistant = await create_assistant();
      await writeConfig({ assistantId: assistant.id });
      return assistant.id;
    }

    // If config file exists but doesn't contain an assistant ID, create a new assistant.
    if (!config.assistantId) {
      console.log("Assistant ID not found in config. Creating a new assistant...");
      const assistant = await create_assistant();
      await writeConfig({ ...config, assistantId: assistant.id });
      return assistant.id;
    }

    // If the assistant ID exists, return it.
    console.log("Assistant ID found in config. Using existing assistant...");
    return config.assistantId;

  } catch (error) {
    console.error("Error initializing assistant:", error);
    throw error;
  }
}

/**
 * Creates an assistant using the OpenAI API.
 * @returns {Promise<any>} The created assistant object.
 */
async function create_assistant(): Promise<any> {
  try {
    const assistant = await client.beta.assistants.create({
      name: "Red Dead Redemption 2 - Poker Assistant",
      instructions: "You are an AI assistant that analyzes screenshots from Red Dead Redemption 2 poker games. Your task is to evaluate the current game situation from these images, offering strategic advice on poker hands and betting tactics. You educate players on evaluating cards and understanding game dynamics, guiding them towards making smart decisions. Your goal is to progressively teach players so they can eventually master poker strategy on their own.",
      model: "gpt-4-1106-preview", // current preview model
      tools: [{ "type": "code_interpreter" }],
    });
    console.log("Assistant created with ID:", assistant.id);
    return assistant;
  } catch (error) {
    console.error("Error creating assistant:", error);
    throw error;
  }
}

export default initialize_assistant;
