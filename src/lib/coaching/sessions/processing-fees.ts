import { buildMethodTree } from "../buildMethodTree";
import { specBySlug } from "./specs";

const processingFeesSession = buildMethodTree(specBySlug("processing-fees"));
export default processingFeesSession;
