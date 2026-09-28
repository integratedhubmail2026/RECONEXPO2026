export const renderTemplateVariables = (templateHtml: string, variables: Record<string, any>): string => {
  let rendered = templateHtml;
  Object.keys(variables).forEach(key => {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    rendered = rendered.replace(regex, String(variables[key] ?? ''));
  });
  return rendered;
};
