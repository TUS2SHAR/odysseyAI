import type { ItineraryPlan } from '../types/itinerary';

export function exportPlanAsJSON(plan: ItineraryPlan) {
  const filename = `${plan.destination.toLowerCase().replace(/[^a-z0-9]/g, '_')}_itinerary.json`;
  const blob = new Blob([JSON.stringify(plan, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function generatePlanMarkdown(plan: ItineraryPlan): string {
  let md = `# ${plan.title}\n`;
  md += `**Destination:** ${plan.destination} | **Duration:** ${plan.durationDays} Days | **Style:** ${plan.travelerStyle}\n\n`;
  md += `> ${plan.summary}\n\n`;

  md += `## 🗓 Day-by-Day Itinerary\n\n`;
  plan.days.forEach(day => {
    md += `### Day ${day.dayNumber}: ${day.theme}\n`;
    day.stops.forEach(stop => {
      md += `- **[${stop.time}] ${stop.activity}** (${plan.budget.currencySymbol}${stop.estimatedCost})\n`;
      md += `  *${stop.description}*\n`;
      if (stop.location) md += `  📍 Location: ${stop.location}\n`;
      if (stop.notes) md += `  💡 Tip: ${stop.notes}\n`;
    });
    md += `\n`;
  });

  md += `## 💰 Estimated Budget Breakdown (Total: ${plan.budget.currencySymbol}${plan.budget.totalEstimated})\n\n`;
  plan.budget.categories.forEach(cat => {
    md += `- **${cat.category}:** ${plan.budget.currencySymbol}${cat.amount}\n`;
  });
  if (plan.budget.budgetTip) {
    md += `\n💡 *Budget Tip:* ${plan.budget.budgetTip}\n`;
  }

  md += `\n## 🎒 Packing Checklist\n\n`;
  plan.packingChecklist.forEach(cat => {
    md += `### ${cat.category}\n`;
    cat.items.forEach(item => {
      md += `- [${item.checked ? 'x' : ' '}] ${item.text} ${item.essential ? '(Essential)' : ''}\n`;
    });
    md += `\n`;
  });

  md += `## 🌟 Local Highlights & Insights\n\n`;
  plan.highlights.forEach(h => {
    md += `- **${h.title}** [${h.tag}]: ${h.description}\n`;
  });

  return md;
}

export function exportPlanAsMarkdown(plan: ItineraryPlan) {
  const content = generatePlanMarkdown(plan);
  const filename = `${plan.destination.toLowerCase().replace(/[^a-z0-9]/g, '_')}_itinerary.md`;
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
