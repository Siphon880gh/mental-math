import { buildMethodTree } from "../buildMethodTree";
import { specBySlug } from "./specs";

const divBy5Session = buildMethodTree(specBySlug("div-by-5"));
export default divBy5Session;
