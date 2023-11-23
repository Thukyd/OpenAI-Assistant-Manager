import client from './openai_client'; // Import the initialized OpenAI client
import fs from 'fs/promises'; // File System module with promise support
import { AssistantUpdateParams } from 'openai/resources/beta/assistants/assistants';
import path from 'path';

const configPath = path.join(__dirname, '../config.json'); // Path to the config file

// TODO: OBSOLETED BY THE INITIAL ASSISTANT FUNCTION => Still work in prorgess


async function hasAssistantConfigDifferences(assistantId:string,localConfig:any): Promise<boolean> {
    // send request to openai to get the assistant config
    const assistant = await client.beta.assistants.retrieve(assistantId);
    // check if there are any differences between the local and the remote assistant
    console.log("HABABNJKDNAJKSNDK " + assistant)
    console.debug(assistant);
    console.log("HABABNJKDNAJKSNDK " + assistant)

    // if there are differences return true

    return true;

}


/**
 * Reads the configuration file and returns the config object
 * @returns {Promise<JSON>} The config object
 */
async function readConfig(): Promise<JSON> {
    // Read the configuration file
    const config = await fs.readFile(configPath, 'utf8');

    // return the config object
    const returnConfig = JSON.parse(config);
    return returnConfig;
}



// FIXME: the types are not declared properly yet

async function overwriteRemoteAssistant(assistantId:string,localConfig:any): Promise<string> { 
    // Type assertion on localConfig to bypass strict type checking
    const config = localConfig as AssistantUpdateParams;

    // send request to openai to overwrite the remote assistant with the local config
    const assistant = await client.beta.assistants.update(assistantId, localConfig);
    
    // return the assistant id & log success
    console.info('Successfully updated the configuration of assistant "'+ assistant.name +'" with id: ' + assistant.id);

    return assistant.id;
}

/*
async function updateAssistant(assistantId:string): Promise<string> {
    // Read the configuration file
        // seperate conifg from assistant id!
    const localConfig = await readConfig();

    // compare the local and the remote assistant
    let different_config = hasAssistantConfigDifferences(assistantId,localConfig); 

    // if different update the remote assistant
    if(different_config) {
        // update the remote assistant
        let result = await stuff();

        
    }else{
        // do nothing?? maybe debug log?
    }

    return result;

}


export default updateAssistant;
*/

// For testing purposes only, we are exporting this function under a different name
// This is NOT part of the public API and should be used for testing only
export const _testExports = {
    overwriteRemoteAssistant,
    hasAssistantConfigDifferences,
};