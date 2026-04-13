import { defineExtensionMessaging } from "@webext-core/messaging";

interface ProtocolMap {
  store(data: string): void;
  get(): string;
}

export const { sendMessage, onMessage } =
  defineExtensionMessaging<ProtocolMap>();
