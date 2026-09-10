import { buildMethodTree } from "../buildMethodTree";
import { specBySlug } from "./specs";

const percentChunksSession = buildMethodTree(specBySlug("percent-chunks"));
export default percentChunksSession;
