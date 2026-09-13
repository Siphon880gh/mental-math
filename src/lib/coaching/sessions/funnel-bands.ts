import { buildMethodTree } from "../buildMethodTree";
import { specBySlug } from "./specs";

const funnelBandsSession = buildMethodTree(specBySlug("funnel-bands"));
export default funnelBandsSession;
