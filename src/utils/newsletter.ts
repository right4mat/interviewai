import { apiRequest } from "./util";

function subscribe(data: Record<string, any>): Promise<any> {
  return apiRequest("newsletter", "POST", data);
}

const newsletter = { subscribe };

export default newsletter;
