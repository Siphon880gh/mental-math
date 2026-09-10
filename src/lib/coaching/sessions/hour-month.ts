import { buildMethodTree } from "../buildMethodTree";
import { specBySlug } from "./specs";

const hourMonthSession = buildMethodTree(specBySlug("hour-month"));
export default hourMonthSession;
