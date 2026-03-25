import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import dagre from 'dagre';

/**
 * CLI-based layout engine for Modscape.
 * Replicates the logic from the visualizer to ensure consistency.
 */
export function applyLayout(inputPath, options = {}) {
  const absolutePath = path.resolve(process.cwd(), inputPath);
  if (!fs.existsSync(absolutePath)) {
    console.error(`  ❌ File not found: ${inputPath}`);
    return;
  }

  const raw = fs.readFileSync(absolutePath, 'utf8');
  let schema;
  try {
    schema = yaml.load(raw);
  } catch (e) {
    console.error(`  ❌ Failed to parse YAML: ${e.message}`);
    return;
  }

  if (!schema || !schema.tables) {
    console.error('  ❌ Invalid schema: No tables found.');
    return;
  }

  const consumers = Array.isArray(schema.consumers) ? schema.consumers : [];
  const totalNodes = schema.tables.length + consumers.length;
  console.log(`  🏗️  Calculating layout for ${schema.tables.length} tables and ${consumers.length} consumers...`);

  // Normalize domain members: support both `members` (new) and `tables` (legacy)
  const domains = (schema.domains || []).map(d => ({
    ...d,
    members: Array.isArray(d.members) ? d.members : (Array.isArray(d.tables) ? d.tables : []),
  }));

  // Initialize Dagre Graph
  const g = new dagre.graphlib.Graph({ compound: true });
  g.setGraph({
    rankdir: 'LR',
    nodesep: 80,
    ranksep: 200,
    marginx: 80,
    marginy: 80,
  });
  g.setDefaultEdgeLabel(() => ({}));

  // 1. Add Tables
  schema.tables.forEach((table) => {
    g.setNode(table.id, { width: 280, height: 160 });
  });

  // 2. Add Consumer nodes
  consumers.forEach((uc) => {
    g.setNode(uc.id, { width: 160, height: 60 });
  });

  // 3. Add Lineage Edges (tables and consumers)
  if (schema.lineage) {
    schema.lineage.forEach((edge) => {
      if (g.hasNode(edge.from) && g.hasNode(edge.to)) {
        g.setEdge(edge.from, edge.to);
      }
    });
  }

  // 4. Add ER Relationships
  if (schema.relationships) {
    schema.relationships.forEach((rel) => {
      if (g.hasNode(rel.from.table) && g.hasNode(rel.to.table)) {
        g.setEdge(rel.from.table, rel.to.table);
      }
    });
  }

  // 5. Setup Domains (members can be tables or consumers)
  if (domains.length > 0) {
    domains.forEach((domain) => {
      g.setNode(domain.id, { label: domain.name, cluster: true });
      domain.members.forEach((memberId) => {
        if (g.hasNode(memberId)) {
          g.setParent(memberId, domain.id);
        }
      });
    });
  }

  // Execute Layout Calculation
  dagre.layout(g);

  // 6. Post-process: Convert Dagre results to Modscape Layout format
  const newLayout = {};
  const PAD = 48;
  const TABLE_W = 280;
  const TABLE_H = 160;
  const GAP = 40;

  // Process Domains (Grid packing)
  if (domains.length > 0) {
    domains.forEach(domain => {
      const members = domain.members.filter(mid => g.hasNode(mid));
      if (members.length === 0) return;

      // Sort by dagre rank (left -> right)
      members.sort((a, b) => g.node(a).x - g.node(b).x);

      const cols = Math.min(3, Math.ceil(Math.sqrt(members.length)));
      const rowCount = Math.ceil(members.length / cols);

      const gridW = cols * (TABLE_W + GAP) - GAP;
      const gridH = rowCount * (TABLE_H + GAP) - GAP;

      const cx = members.reduce((s, mid) => s + g.node(mid).x, 0) / members.length;
      const cy = members.reduce((s, mid) => s + g.node(mid).y, 0) / members.length;
      const originX = cx - gridW / 2;
      const originY = cy - gridH / 2;

      members.forEach((mid, idx) => {
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        const xOff = col * (TABLE_W + GAP) + TABLE_W / 2;
        const yOff = row * (TABLE_H + GAP) + TABLE_H / 2;
        newLayout[mid] = {
          x: Math.round(originX + xOff),
          y: Math.round(originY + yOff),
          parentId: domain.id
        };
      });

      // Domain bounding box
      const HEADER = 28;
      newLayout[domain.id] = {
        x: Math.round(originX - PAD),
        y: Math.round(originY - PAD - HEADER),
        width: Math.round(gridW + PAD * 2),
        height: Math.round(gridH + PAD * 2 + HEADER)
      };
    });
  }

  // Standalone Tables
  const domainMemberIds = new Set(domains.flatMap(d => d.members));
  schema.tables.forEach(t => {
    if (!domainMemberIds.has(t.id)) {
      const pos = g.node(t.id);
      newLayout[t.id] = { x: Math.round(pos.x), y: Math.round(pos.y) };
    }
  });

  // Standalone Usecases
  consumers.forEach(uc => {
    if (!domainMemberIds.has(uc.id)) {
      const pos = g.node(uc.id);
      if (pos) newLayout[uc.id] = { x: Math.round(pos.x), y: Math.round(pos.y) };
    }
  });

  // 7. Save back to YAML (write members, not tables, for domains)
  schema.domains = domains.map(d => {
    const { members, ...rest } = d;
    return { ...rest, members };
  });
  schema.layout = newLayout;
  const outputPath = options.output ? path.resolve(process.cwd(), options.output) : absolutePath;

  fs.writeFileSync(outputPath, yaml.dump(schema, { indent: 2, lineWidth: -1, noRefs: true }), 'utf8');
  console.log(`  ✅ Layout complete! Saved to: ${path.relative(process.cwd(), outputPath)}`);
}
