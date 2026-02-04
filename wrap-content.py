import re
import json

with open('prisma/seed.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find and wrap content objects with JSON.stringify
in_content = False
content_start = -1
brace_count = 0
new_lines = []

for i, line in enumerate(lines):
    # Detect start of content object
    if re.search(r'^\s+content:\s*\{', line):
        in_content = True
        content_start = i
        brace_count = 1
        new_lines.append(line.replace('content: {', 'content: JSON.stringify({'))
        continue
    
    if in_content:
        # Count braces
        brace_count += line.count('{') - line.count('}')
        new_lines.append(line)
        
        # End of content object
        if brace_count == 0:
            # Add closing parenthesis for JSON.stringify
            new_lines[-1] = new_lines[-1].rstrip() + ')\n'
            in_content = False
    else:
        new_lines.append(line)

with open('prisma/seed.ts', 'w', encoding='utf-8', newline='') as f:
    f.writelines(new_lines)

print("Wrapped all content objects with JSON.stringify")
