import { buildMethodTree } from "../buildMethodTree";
import { specBySlug } from "./specs";

const percentTensSession = buildMethodTree(specBySlug("percent-tens"));
export default percentTensSession;
