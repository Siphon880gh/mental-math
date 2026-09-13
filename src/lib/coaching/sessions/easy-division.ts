import { buildMethodTree } from "../buildMethodTree";
import { specBySlug } from "./specs";

const easyDivisionSession = buildMethodTree(specBySlug("easy-division"));
export default easyDivisionSession;
