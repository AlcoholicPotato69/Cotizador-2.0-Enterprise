import sqlite3
import json
import os
import uuid
import decimal

# Helper to generate deterministic UUIDs if needed or just use random/constant for now
TENANT_MAP = {}
def get_tenant_id(old_tenant):
    if not old_tenant:
        old_tenant = "default"
    if old_tenant not in TENANT_MAP:
        # Generate a stable UUID based on the old tenant string
        TENANT_MAP[old_tenant] = str(uuid.uuid5(uuid.NAMESPACE_OID, old_tenant))
    return TENANT_MAP[old_tenant]

def parse_json(val):
    if not val:
        return []
    try:
        return json.loads(val)
    except:
        return []

def main():
    sqlite_db_path = r"h:\cotizadorpm-pocketbase\backend\pb_data\data.db"
    output_json_path = r"h:\Cotizador-2.0-Enterprise\backend\prisma\seeds\espacios_migrados.json"
    
    conn = sqlite3.connect(sqlite_db_path)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM espacios")
    rows = cursor.fetchall()
    
    migrated_spaces = []
    
    for row in rows:
        r = dict(row)
        
        # Transform images
        images = []
        for img_col in ['imagen_url', 'imagen', 'imagen2', 'imagen3', 'imagen4', 'imagen5']:
            if r.get(img_col):
                images.append(r[img_col])
                
        # Transform tags
        tags = parse_json(r.get('etiquetas'))
        is_digital = False
        if tags and isinstance(tags, list):
            if any('pantalla' in str(t).lower() or 'digital' in str(t).lower() for t in tags):
                is_digital = True
                
        # Basic fields
        status = "AVAILABLE" if r.get('activa') or r.get('activo') else "DECOMMISSIONED"
        
        # We handle capacity as 1 if not available
        capacity = 1
        
        # We need a spaceType, fallback to 'GENERAL' if 'tipo' is missing
        space_type = r.get('tipo') or 'GENERAL'
        
        tenant_id = get_tenant_id(r.get('tenant'))
        
        # Construct the mapped object
        space = {
            "id": r.get('id') if len(str(r.get('id'))) == 36 else str(uuid.uuid4()), # Generate UUID if old id is not UUID
            "tenantId": tenant_id,
            "name": r.get('nombre') or 'Sin nombre',
            "code": r.get('clave'),
            "capacity": capacity,
            "areaSqm": float(r.get('medida_ancho') or 0) * float(r.get('medida_alto') or 0),
            "basePricePerHour": float(r.get('precio_base') or 0),
            "configB2b": parse_json(r.get('config_b2b')),
            "preciosPorDia": parse_json(r.get('precios_por_dia')),
            "diasBloqueados": parse_json(r.get('dias_bloqueados')),
            "impuestosIds": parse_json(r.get('impuestos_ids')),
            "status": status,
            "description": r.get('descripcion') or '',
            "color": r.get('color'),
            "tags": tags,
            "spaceType": space_type,
            "material": r.get('material'),
            "width": float(r.get('medida_ancho') or 0),
            "height": float(r.get('medida_alto') or 0),
            "measureUnit": r.get('medida_unidad'),
            "location": r.get('ubicacion'),
            "allowsAgreement": bool(r.get('permite_convenio')),
            "regulationTemplate": r.get('reglamento_template'),
            "geographicMap": r.get('plano_geografico'),
            "isDigital": is_digital,
            "images": images
        }
        migrated_spaces.append(space)
        
    with open(output_json_path, 'w', encoding='utf-8') as f:
        json.dump(migrated_spaces, f, indent=2, ensure_ascii=False)
        
    print(f"Extracted {len(migrated_spaces)} records and saved to {output_json_path}")

if __name__ == '__main__':
    main()
