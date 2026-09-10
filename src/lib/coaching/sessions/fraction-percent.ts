import { buildMethodTree } from "../buildMethodTree";
import { specBySlug } from "./specs";

const fractionPercentSession = buildMethodTree(specBySlug("fraction-percent"));
export default fractionPercentSession;
