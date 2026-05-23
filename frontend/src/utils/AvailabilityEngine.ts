export interface ReservationState {
  id: string;
  estado: 'tentative' | 'reserved' | 'contracted' | 'blocked' | 'maintenance';
  fecha_inicio: string; // ISO DateTime
  fecha_fin: string; // ISO DateTime
  mounting_hours: number;
  dismantling_hours: number;
  is_exclusive: boolean;
}

export interface SpacePolicy {
  capacity_min: number;
  capacity_max: number;
  allowed_event_types: string[];
  occupancy_policy: 'exclusive' | 'shared' | 'segmented';
}

export interface AvailabilityRequest {
  espacio_id: string;
  fecha_inicio: string;
  fecha_fin: string;
  mounting_hours: number;
  dismantling_hours: number;
  pax_estimado: number;
  tipo_evento: string;
}

export class AvailabilityEngine {
  
  /**
   * Verifica la disponibilidad considerando montajes, bloqueos operativos y políticas de ocupación.
   */
  static validateAvailability(
    request: AvailabilityRequest, 
    spacePolicy: SpacePolicy, 
    existingReservations: ReservationState[]
  ): { isAvailable: boolean; reasons: string[] } {
    
    const reasons: string[] = [];

    // 1. Capacity Validation
    if (spacePolicy.capacity_max && request.pax_estimado > spacePolicy.capacity_max) {
      reasons.push(`La capacidad excede el máximo permitido del espacio (${spacePolicy.capacity_max} pax).`);
    }
    if (spacePolicy.capacity_min && request.pax_estimado < spacePolicy.capacity_min) {
      reasons.push(`La capacidad no alcanza el mínimo requerido para este espacio (${spacePolicy.capacity_min} pax).`);
    }

    // 2. Event Type Validation
    if (spacePolicy.allowed_event_types && spacePolicy.allowed_event_types.length > 0) {
      if (!spacePolicy.allowed_event_types.includes(request.tipo_evento)) {
        reasons.push(`El tipo de evento '${request.tipo_evento}' no está permitido en este espacio.`);
      }
    }

    // 3. Collision Logic based on states and blocks
    const reqStart = new Date(request.fecha_inicio);
    reqStart.setHours(reqStart.getHours() - request.mounting_hours); // Subtract mounting time
    
    const reqEnd = new Date(request.fecha_fin);
    reqEnd.setHours(reqEnd.getHours() + request.dismantling_hours); // Add dismantling time

    for (const res of existingReservations) {
      // Ignorar tentativas vencidas si existiera lógica (aquí asumimos que si viene, está activa)
      
      const resStart = new Date(res.fecha_inicio);
      resStart.setHours(resStart.getHours() - res.mounting_hours);

      const resEnd = new Date(res.fecha_fin);
      resEnd.setHours(resEnd.getHours() + res.dismantling_hours);

      // Checar traslape (A_start < B_end && A_end > B_start)
      const isOverlapping = (reqStart < resEnd && reqEnd > resStart);

      if (isOverlapping) {
        if (res.estado === 'blocked' || res.estado === 'maintenance') {
          reasons.push(`Bloqueo operativo: El espacio se encuentra en mantenimiento o bloqueado (${resStart.toISOString()} a ${resEnd.toISOString()}).`);
        } else if (spacePolicy.occupancy_policy === 'exclusive' || res.is_exclusive) {
          reasons.push(`Conflicto de disponibilidad: El espacio ya cuenta con una reserva exclusiva en estas fechas (Estado: ${res.estado}).`);
        } else if (spacePolicy.occupancy_policy === 'shared') {
          // Shared policy permite múltiples reservas (Ej: Campañas Digitales PM-02)
          // Solo se bloquea si el estado de la reserva existente fuerza exclusividad (is_exclusive), ya checado arriba.
        } else {
           reasons.push(`Conflicto de fechas con una reserva existente (Estado: ${res.estado}).`);
        }
      }
    }

    return {
      isAvailable: reasons.length === 0,
      reasons
    };
  }
}
