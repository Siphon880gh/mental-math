import { buildMethodTree } from "../buildMethodTree";
import { specBySlug } from "./specs";

const concurrencySession = buildMethodTree(specBySlug("concurrency"));
export default concurrencySession;
