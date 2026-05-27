import os

ui_dir = r"h:\Cotizador-2.0-Enterprise\frontend\src\components\ui"
main_ts = r"h:\Cotizador-2.0-Enterprise\frontend\src\main.ts"

# Get all Ds*.vue files
ds_components = [f[:-4] for f in os.listdir(ui_dir) if f.startswith("Ds") and f.endswith(".vue")]

with open(main_ts, "r", encoding="utf-8") as f:
    content = f.read()

# Generate import block
import_lines = []
for c in ds_components:
    import_lines.append(f"import {c} from './components/ui/{c}.vue';")

import_block = "\n".join(import_lines)

# Generate component registration
reg_lines = []
for c in ds_components:
    reg_lines.append(f"app.component('{c}', {c});")

reg_block = "\n".join(reg_lines)

# Insert after import ToastService
if "import ToastService from 'primevue/toastservice';" in content:
    content = content.replace("import ToastService from 'primevue/toastservice';", 
                              "import ToastService from 'primevue/toastservice';\n" + import_block)

# Insert before app.mount('#app');
if "app.mount('#app');" in content:
    content = content.replace("app.mount('#app');", reg_block + "\napp.mount('#app');")

with open(main_ts, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Registered {len(ds_components)} components globally.")
