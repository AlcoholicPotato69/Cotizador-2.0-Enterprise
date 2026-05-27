import os
import re

views_dir = r"h:\Cotizador-2.0-Enterprise\frontend\src\views"

replacements = {
    r"<Button(\s|>)": r"<DsButton\1",
    r"</Button>": r"</DsButton>",
    r"<DataTable(\s|>)": r"<DsTable\1",
    r"</DataTable>": r"</DsTable>",
    r"<Column(\s|>)": r"<DsColumn\1",
    r"</Column>": r"</DsColumn>",
    r"<Dialog(\s|>)": r"<DsModal\1",
    r"</Dialog>": r"</DsModal>",
    r"<InputText(\s|>)": r"<DsInput\1",
    r"</InputText>": r"</DsInput>",
    r"<Textarea(\s|>)": r"<DsTextarea\1",
    r"</Textarea>": r"</DsTextarea>",
    r"<Card(\s|>)": r"<DsCard\1",
    r"</Card>": r"</DsCard>",
    r"<Badge(\s|>)": r"<DsBadge\1",
    r"</Badge>": r"</DsBadge>",
    r"<Tag(\s|>)": r"<DsTag\1",
    r"</Tag>": r"</DsTag>",
    r"<InputNumber(\s|>)": r"<DsInputNumber\1",
    r"</InputNumber>": r"</DsInputNumber>",
    r"<Skeleton(\s|>)": r"<DsSkeleton\1",
    r"</Skeleton>": r"</DsSkeleton>",
    r"<ProgressSpinner(\s|>)": r"<DsProgressSpinner\1",
    r"</ProgressSpinner>": r"</DsProgressSpinner>",
    r"<MultiSelect(\s|>)": r"<DsMultiSelect\1",
    r"</MultiSelect>": r"</DsMultiSelect>",
}

import_pattern = re.compile(r"import\s+(?:\{[^}]+\}|\w+)\s+from\s+['\"]primevue/(?!(usetoast|useconfirm))[^'\"]+['\"];?\n?")

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = content
    for old, new in replacements.items():
        new_content = re.sub(old, new, new_content)

    new_content = import_pattern.sub('', new_content)

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Refactored: {filepath}")

for root, dirs, files in os.walk(views_dir):
    for file in files:
        if file.endswith('.vue'):
            process_file(os.path.join(root, file))

print("Refactoring complete.")
