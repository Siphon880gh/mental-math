import { buildMethodTree } from "../buildMethodTree";
import { specBySlug } from "./specs";

const percentTipSession = buildMethodTree(specBySlug("percent-tip"));
export default percentTipSession;
