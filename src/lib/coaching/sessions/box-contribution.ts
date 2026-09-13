import { buildMethodTree } from "../buildMethodTree";
import { specBySlug } from "./specs";

const boxContributionSession = buildMethodTree(specBySlug("box-contribution"));
export default boxContributionSession;
