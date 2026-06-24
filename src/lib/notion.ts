import {
  mockProjects,
  mockPensieveThoughts,
  mockKnowledgeNotes,
  Project,
  PensieveThought,
  KnowledgeNote
} from "./portfolioMockData";

/**
 * Lightweight Notion API Client
 * Uses standard Fetch API to interact with Notion databases.
 * Fallbacks to local mock databases if NOTION_TOKEN is not configured.
 */

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const PROJECTS_DB_ID = process.env.NOTION_PROJECTS_DB_ID;
const PENSIEVE_DB_ID = process.env.NOTION_PENSIEVE_DB_ID;
const KNOWLEDGE_DB_ID = process.env.NOTION_KNOWLEDGE_DB_ID;

const isNotionConfigured = !!(NOTION_TOKEN && (PROJECTS_DB_ID || PENSIEVE_DB_ID || KNOWLEDGE_DB_ID));

export async function getProjects(): Promise<Project[]> {
  if (!isNotionConfigured) {
    return mockProjects;
  }

  try {
    const res = await fetch(`https://api.notion.com/v1/databases/${PROJECTS_DB_ID}/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${NOTION_TOKEN}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
      },
      next: { revalidate: 3600 } // cache for 1 hour
    });

    if (!res.ok) throw new Error("Failed to query Notion Projects DB");

    const data = await res.json();
    // Parse Notion properties into Project interface
    const projects: Project[] = data.results.map((page: any) => {
      const props = page.properties;
      return {
        id: page.id,
        title: props.Title?.title[0]?.plain_text || "Untitled Project",
        tagline: props.Tagline?.rich_text[0]?.plain_text || "",
        category: props.Category?.select?.name || "General",
        score: props.Score?.rich_text[0]?.plain_text || "",
        metrics: {
          efficiency: props.MetricEfficiency?.number || 0,
          alignment: props.MetricAlignment?.number || 0,
          security: props.MetricSecurity?.number || 0,
          impact: props.MetricImpact?.rich_text[0]?.plain_text || ""
        },
        glowColor: props.GlowColor?.rich_text[0]?.plain_text || "group-hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]",
        accentColor: props.AccentColor?.rich_text[0]?.plain_text || "portfolio-gold",
        slug: props.Slug?.rich_text[0]?.plain_text || page.id,
        problem: props.Problem?.rich_text[0]?.plain_text || "",
        solution: props.Solution?.rich_text[0]?.plain_text || "",
        impactText: props.ImpactText?.rich_text[0]?.plain_text || "",
        frameworks: props.Frameworks?.multi_select?.map((t: any) => t.name) || [],
        readTime: props.ReadTime?.rich_text[0]?.plain_text || "5 min read",
        projectType: props.ProjectType?.rich_text[0]?.plain_text || ""
      };
    });

    return projects.length > 0 ? projects : mockProjects;
  } catch (err) {
    console.warn("Notion projects query failed, falling back to local mocks:", err);
    return mockProjects;
  }
}

export async function getPensieveThoughts(): Promise<PensieveThought[]> {
  if (!isNotionConfigured) {
    return mockPensieveThoughts;
  }

  try {
    const res = await fetch(`https://api.notion.com/v1/databases/${PENSIEVE_DB_ID}/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${NOTION_TOKEN}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
      },
      next: { revalidate: 3600 }
    });

    if (!res.ok) throw new Error("Failed to query Notion Pensieve DB");

    const data = await res.json();
    const thoughts: PensieveThought[] = data.results.map((page: any) => {
      const props = page.properties;
      return {
        id: page.id,
        title: props.Title?.title[0]?.plain_text || "Untitled Thought",
        category: props.Category?.select?.name || "Case Studies",
        summary: props.Summary?.rich_text[0]?.plain_text || "",
        readTime: props.ReadTime?.rich_text[0]?.plain_text || "5 min read",
        date: props.Date?.rich_text[0]?.plain_text || new Date().toLocaleDateString(),
        content: props.Content?.rich_text[0]?.plain_text || ""
      };
    });

    return thoughts.length > 0 ? thoughts : mockPensieveThoughts;
  } catch (err) {
    console.warn("Notion pensieve query failed, falling back to local mocks:", err);
    return mockPensieveThoughts;
  }
}

export async function getKnowledgeNotes(): Promise<KnowledgeNote[]> {
  if (!isNotionConfigured) {
    return mockKnowledgeNotes;
  }

  try {
    const res = await fetch(`https://api.notion.com/v1/databases/${KNOWLEDGE_DB_ID}/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${NOTION_TOKEN}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
      },
      next: { revalidate: 3600 }
    });

    if (!res.ok) throw new Error("Failed to query Notion Knowledge DB");

    const data = await res.json();
    const notes: KnowledgeNote[] = data.results.map((page: any) => {
      const props = page.properties;
      return {
        id: page.id,
        title: props.Title?.title[0]?.plain_text || "Untitled Note",
        category: props.Category?.select?.name || "General PM",
        date: props.Date?.date?.start || new Date().toISOString().split("T")[0],
        tags: props.Tags?.multi_select?.map((t: any) => t.name) || [],
        content: props.Content?.rich_text[0]?.plain_text || ""
      };
    });

    return notes.length > 0 ? notes : mockKnowledgeNotes;
  } catch (err) {
    console.warn("Notion knowledge notes query failed, falling back to local mocks:", err);
    return mockKnowledgeNotes;
  }
}
