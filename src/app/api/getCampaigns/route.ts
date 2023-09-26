import { NextResponse } from 'next/server'
import path from 'path';
import { promises as fs } from 'fs';
export async function GET() {
     //Find the absolute path of the json directory
  const jsonDirectory = path.join(process.cwd(), 'json');
  //Read the json data file data.json
  const fileContents = await fs.readFile(jsonDirectory + '/campaign.json', 'utf8');
  //Return the content of the data file in json format
  return NextResponse.json(JSON.parse(fileContents))
}