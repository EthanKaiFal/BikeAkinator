import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import outputs from '../../amplify_outputs.json';
import { Amplify } from "aws-amplify";

Amplify.configure(outputs);
const client = generateClient<Schema>();

export default client;
