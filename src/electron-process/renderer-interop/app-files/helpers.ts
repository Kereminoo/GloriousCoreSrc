import * as readline from 'node:readline/promises';
import { copyFileSync, createReadStream } from 'node:fs';
import { env } from '../others/env';

export const copyAppFile = (sourcePath: string, destinationPath: string): void => {
    try {
        // const fileData = readFileSync(sourcePath);
        // writeFileSync(destinationPath, fileData);
        copyFileSync(sourcePath, destinationPath);
        env.log('electron', 'data', `File copied from ${sourcePath} to ${destinationPath}`);
    } catch (error) {
        env.log('electron', 'error', `Error copying file from ${sourcePath} to ${destinationPath}: ${error}`);
    }
};

export const readFirstLine = async (path: string): Promise<string>  => {
  const inputStream = createReadStream(path);
  try {
      for await (const line of readline.createInterface(inputStream)) return line;
      return ''; // If the file is empty.
  } finally {
      inputStream.destroy(); // Destroy file stream.
  }
};


