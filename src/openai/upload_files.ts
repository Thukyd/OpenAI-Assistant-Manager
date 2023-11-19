
import fs from 'fs'; // Node.js file system module for file operations 
import client  from './openai_client'; // Import the initialized OpenAI client

/**
 * Uploads a file to OpenAI and returns the file ID.
 * @param {string} file_path - Path to the file to be uploaded.
 * @returns A promise that resolves with the file ID of the uploaded file.
 */
export async function upload_file(file_path: string): Promise<string> {
  console.log(`Attempting to upload file: ${file_path}`);

  try {
    const response = await client.files.create({
      file: fs.createReadStream(file_path),
      purpose: "assistants",
    });

    const fileId = response.id; // Extract the file ID from the response
    console.log(`File uploaded successfully. File ID: "${fileId}"`);
    return fileId; // Return the file ID
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}
