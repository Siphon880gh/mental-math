import { buildMethodTree } from "../buildMethodTree";
import { specBySlug } from "./specs";

const breakEvenSession = buildMethodTree(specBySlug("break-even"));
export default breakEvenSession;
