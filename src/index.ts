// hello world
console.log('hello world');

// upload file to openai
import { upload_file } from './openai/upload_files';
const file_path = './test-screenshots/PXL_20231119_105003966.jpg';
upload_file(file_path);
