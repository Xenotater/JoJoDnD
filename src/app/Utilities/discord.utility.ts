import { doFetch } from "./fetch.utility";
import { logError } from "./logging.utility";

export enum DiscordComponent {
  ACTION_ROW = 1,
  BUTTON = 2,
  STRING_SELECT = 3,
  TEXT_INPUT = 4,
  USER_SELECT = 5,
  ROLE_SELECT = 6,
  MENTIONABLE_SELECT = 7,
  CHANNEL_SELECT = 8,
  SECTION = 9,
  TEXT_DISPLAY = 10,
  THUMBNAIL = 11,
  MEDIA_GALLERY = 12,
  FILE = 13,
  SEPARATOR = 14,
  CONTAINER = 17,
  LABEL = 18,
  FILE_UPLOAD = 19,
  RADIO_GROUP = 21,
  CHECKBOX_GROUP = 22,
  CHECKBOX = 23
}

export interface DiscordWebhookPayload {
  content?: string;
  components: {
    type: number;
    content?: string;
    components?: {
      type: number;
      content?: string;
      label?: string;
      style?: number;
      url?: string;
    }[];
    accessory?: {
      type: number;
      media?: {
        url: string;
      }
    }
    items?: {
      media: {
        url: string
      }
    }[];
    divider?: boolean;
    spacing?: number;
  }[];
}

const getWebhookUrl = () => process.env.DISCORD_WEBHOOK_URL!;

export async function sendDiscordWebhook(payload: DiscordWebhookPayload) {
  try {
    const endpoint = getWebhookUrl() + "?with_components=true";
    const resp = await doFetch(endpoint, "POST", {
      ...payload,
      flags: 1 << 15, //IS_COMPONENTS_V2
      tts: false
    }, {
      "Content-Type": "application/json"
    });
    return resp.status;
  }
  catch {
    logError("Failed to POST to Discord Webhook");
    return 500;
  }
}