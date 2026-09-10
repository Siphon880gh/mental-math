import { buildMethodTree } from "../buildMethodTree";
import { specBySlug } from "./specs";

const stackedFounderSession = buildMethodTree(specBySlug("stacked-founder"));
export default stackedFounderSession;
