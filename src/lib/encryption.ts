import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

export function encryptData(data: Record<string, string>): string {
  const jsonData = JSON.stringify(data);
  const key = randomBytes(32);
  const iv = randomBytes(16);
  const cipher = createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(jsonData, "utf8", "hex");
  encrypted += cipher.final("hex");

  return `${iv.toString("hex")}:${encrypted}:${key.toString("hex")}`;
}

export function decryptData(encryptedData: string): Record<string, string> {
  const [ivHex, encryptedHex, keyHex] = encryptedData.split(":");
  const iv = Buffer.from(ivHex ?? "", "hex");
  const encrypted = Buffer.from(encryptedHex ?? "", "hex");
  const key = Buffer.from(keyHex ?? "", "hex");

  const decipher = createDecipheriv("aes-256-cbc", key, iv);
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return JSON.parse(decrypted.toString()) as {
    userId: string;
    laravelSession: string;
    xsrfToken: string;
    casAuth: string;
  };
}
