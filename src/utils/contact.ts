import { apiRequestExternal } from "./util.js";

const endpoint = `https://formspree.io/${process.env.NEXT_PUBLIC_FORMSPREE_CONTACT_ID}`;

function submit(data: Record<string, any>): Promise<any> {
  return apiRequestExternal(endpoint, "POST", data);
}

const contact = { submit };

export default contact;
