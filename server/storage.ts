import { AndroidUi, InsertAndroidUi, androidElementSchema } from "@shared/schema";
import { XMLParser } from "fast-xml-parser";

export interface IStorage {
  parseAndStoreXml(xmlContent: string): Promise<AndroidUi>;
}

export class MemStorage implements IStorage {
  private xmlParser: XMLParser;
  private items: Map<number, AndroidUi>;
  private currentId: number;

  constructor() {
    this.xmlParser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "",
      parseAttributeValue: true,
      trimValues: true,
    });
    this.items = new Map();
    this.currentId = 1;
  }

  private parseXmlToElements(node: any): any {
    if (!node) return null;

    // Extract bounds from the bounds attribute string
    const boundsStr = node.bounds;
    if (!boundsStr) return null;

    // Parse bounds string "[left,top][right,bottom]"
    const matches = boundsStr.match(/\[(\d+),(\d+)\]\[(\d+),(\d+)\]/);
    if (!matches) return null;

    const [_, left, top, right, bottom] = matches.map(Number);

    const element = {
      type: node.class || "View",
      bounds: { left, top, right, bottom },
      text: node.text || "",
      contentDescription: node["content-desc"] || "",
      children: []
    };

    // Handle nested nodes
    if (node.node) {
      // Convert to array if single node
      const childNodes = Array.isArray(node.node) ? node.node : [node.node];
      element.children = childNodes
        .map(child => this.parseXmlToElements(child))
        .filter(Boolean);
    }

    return element;
  }

  async parseAndStoreXml(xmlContent: string): Promise<AndroidUi> {
    try {
      // Предварительная обработка XML
      const cleanXml = xmlContent
        .replace(/\\n/g, '')
        .replace(/\\"/g, '"')
        .trim();

      const parsed = this.xmlParser.parse(cleanXml);
      const hierarchy = parsed.hierarchy;

      if (!hierarchy || !hierarchy.node) {
        throw new Error("Invalid XML structure: missing hierarchy or root node");
      }

      const rootElement = this.parseXmlToElements(hierarchy.node);
      if (!rootElement) {
        throw new Error("Failed to parse UI elements");
      }

      const id = this.currentId++;
      const item: AndroidUi = {
        id,
        xmlContent: cleanXml,
        parsedElements: rootElement,
        screenWidth: rootElement.bounds.right,
        screenHeight: rootElement.bounds.bottom,
      };

      this.items.set(id, item);
      return item;
    } catch (error: any) {
      console.error("XML parsing error:", error);
      throw new Error(`Failed to parse XML: ${error.message}`);
    }
  }
}

export const storage = new MemStorage();