import axios from "axios";

import { Env } from "../env";

export class Feedly {
  static async getArticles() {
    const streamId = encodeURIComponent(
      "user/d281aac1-ab35-4559-a5b6-a410fb1fa1d7/category/64b263da-85e3-4257-b13b-ee07ac1ed85c"
    );

    return axios.get(
      `https://cloud.feedly.com/v3/streams/${streamId}/contents`,
      { headers: { Authorization: `Bearer ${Env.FEEDLY_TOKEN}` } }
    );
  }
}
