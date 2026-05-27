import os
import re

src_dir = r"h:\Cotizador-2.0-Enterprise\frontend\src"

views_dir = os.path.join(src_dir, "views")
components_dir = os.path.join(src_dir, "components")
stores_dir = os.path.join(src_dir, "stores")
services_dir = os.path.join(src_dir, "services")
layouts_dir = os.path.join(src_dir, "layouts")

def analyze_dir(directory, ext=".vue"):
    inventory = []
    if not os.path.exists(directory): return inventory
    for root, _, files in os.walk(directory):
        for f in files:
            if f.endswith(ext) or f.endswith('.ts'):
                filepath = os.path.join(root, f)
                rel_path = os.path.relpath(filepath, src_dir)
                size = os.path.getsize(filepath)
                with open(filepath, "r", encoding="utf-8", errors="ignore") as file:
                    content = file.read()
                
                status = "IMPLEMENTADO"
                if size < 500: status = "PARCIAL"
                if "TODO" in content or "mock" in content.lower() or "bypass" in content.lower():
                    status = "PARCIAL"
                if "bg-white" in content or "text-black" in content or "role ===" in content or "tenant ===" in content:
                    status = "ROTO"
                
                inventory.append({"file": rel_path, "status": status, "size": size})
    return inventory

views = analyze_dir(views_dir)
components = analyze_dir(components_dir)
stores = analyze_dir(stores_dir, ".ts")
services = analyze_dir(services_dir, ".ts")
layouts = analyze_dir(layouts_dir)

report_path = r"h:\Cotizador-2.0-Enterprise\frontend\FRONTEND_INVENTORY_REPORT.md"
with open(report_path, "w", encoding="utf-8") as f:
    f.write("# FRONTEND INVENTORY REPORT\n\n")
    
    f.write("## VIEWS\n")
    for v in views: f.write(f"- `{v['file']}`: **{v['status']}** (Size: {v['size']} bytes)\n")
    
    f.write("\n## COMPONENTS\n")
    for c in components: f.write(f"- `{c['file']}`: **{c['status']}** (Size: {c['size']} bytes)\n")
        
    f.write("\n## STORES\n")
    for s in stores: f.write(f"- `{s['file']}`: **{s['status']}** (Size: {s['size']} bytes)\n")
        
    f.write("\n## SERVICES\n")
    for s in services: f.write(f"- `{s['file']}`: **{s['status']}** (Size: {s['size']} bytes)\n")
        
    f.write("\n## LAYOUTS\n")
    for l in layouts: f.write(f"- `{l['file']}`: **{l['status']}** (Size: {l['size']} bytes)\n")

print("Report generated at", report_path)
