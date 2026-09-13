import { buildMethodTree } from "../buildMethodTree";
import { specBySlug } from "./specs";

const differenceSquaresSession = buildMethodTree(specBySlug("difference-squares"));
export default differenceSquaresSession;
