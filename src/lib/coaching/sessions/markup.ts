import { buildMethodTree } from "../buildMethodTree";
import { specBySlug } from "./specs";

const markupSession = buildMethodTree(specBySlug("markup"));
export default markupSession;
