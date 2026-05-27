import re
import json

file_path = r'H:\cotizadorpm-pocketbase\frontend\client\system\config.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

permissions = re.findall(r'hasPermission\([\'"]([^\'"]+)[\'"]\)', content)
endpoints = re.findall(r'fetch\([\'"]([^\'"]+)[\'"]', content)
db_access = re.findall(r'getDB\(\)\.collection\([\'"]([^\'"]+)[\'"]\)', content)

result = {
    'permissions_requested': list(set(permissions)),
    'db_collections': list(set(db_access)),
}

print(json.dumps(result, indent=2))
