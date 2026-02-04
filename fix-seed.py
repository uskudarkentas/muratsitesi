import re

with open('prisma/seed.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix imports
content = re.sub(
    r"import \{ PrismaClient, StageStatus, PostType \} from '@prisma/client';\r?\nimport \{ PrismaPg \} from '@prisma/adapter-pg';\r?\nimport \{ Pool \} from 'pg';\r?\n\r?\nconst pool = new Pool\(\{ connectionString: process\.env\.DATABASE_URL \}\);\r?\nconst adapter = new PrismaPg\(pool\);\r?\nconst prisma = new PrismaClient\(\{ adapter \}\);",
    "import { PrismaClient } from '@prisma/client';\n\nconst prisma = new PrismaClient();",
    content
)

# Replace enum references with strings
content = re.sub(r'StageStatus\.COMPLETED', '"COMPLETED"', content)
content = re.sub(r'StageStatus\.ACTIVE', '"ACTIVE"', content)
content = re.sub(r'StageStatus\.LOCKED', '"LOCKED"', content)
content = re.sub(r'PostType\.ANNOUNCEMENT', '"ANNOUNCEMENT"', content)
content = re.sub(r'PostType\.MEETING', '"MEETING"', content)
content = re.sub(r'PostType\.SURVEY', '"SURVEY"', content)

with open('prisma/seed.ts', 'w', encoding='utf-8', newline='\r\n') as f:
    f.write(content)

print("Fixed seed.ts completely")
